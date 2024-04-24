import { useReducer, useContext } from 'react';
import { Alert } from 'react-native';

import {
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_ERROR,
  CLEAR_ERROR,
  FETCH_TODOS
} from '../types';
import { ScreenContext } from '../screen/screenContext';
import { Http } from '../../http';

import { TodoContext } from './todoContext';
import { todoReducer } from './todoReducer';

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [],
    loading: false,
    error: null
  };
  const { changeScreen } = useContext(ScreenContext);
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = async (title) => {
    clearError();
    try {
      const data = await Http.post('https://jsonplaceholder.typicode.com/todos', {
        title
      });
      dispatch({ type: ADD_TODO, title, id: data.name });
    } catch (e) {
      showError('Что-то пошло не так');
    }
  };

  const removeTodo = (id) => {
    const todo = state.todos.find((t) => t.id === id);
    Alert.alert(
      'Удаление элемента',
      `Вы уверены, что хотите удалить "${todo.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            changeScreen(null);
            await Http.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
            dispatch({ type: REMOVE_TODO, id });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const data = await Http.get('https://jsonplaceholder.typicode.com/todos');
      const todos = Object.keys(data).map((key) => ({ ...data[key], id: key }));
      dispatch({ type: FETCH_TODOS, todos });
    } catch (e) {
      showError('Что-пошло не так...');
      console.log(e);
    } finally {
      hideLoader();
    }
  };

  const updateTodo = async (id, title) => {
    clearError();
    try {
      await Http.patch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      dispatch({ type: UPDATE_TODO, id, title });
    } catch (e) {
      showError('Что-пошло не так...');
      console.log(e);
    }
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER });

  const showError = (error) => dispatch({ type: SHOW_ERROR, error });

  const clearError = () => dispatch({ type: CLEAR_ERROR });

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos
      }}>
      {children}
    </TodoContext.Provider>
  );
};
