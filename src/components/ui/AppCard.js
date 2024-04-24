import { StyleSheet, View } from 'react-native';

export const AppCard = (props) => (
  <View style={{ ...styles.default, ...props.style }}>{props.children}</View>
);

const styles = StyleSheet.create({
  default: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.3)',
    elevation: 8,
    backgroundColor: '#fff',
    borderRadius: 10
  }
});
