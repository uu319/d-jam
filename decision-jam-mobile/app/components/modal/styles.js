import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    height: 300,
    width: 300,
  },
  title: {
    fontSize: 20,
  },
  buttons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  button: {
    width: 75,
    padding: 5,
  },
});
