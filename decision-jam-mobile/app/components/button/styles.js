import { StyleSheet, Platform } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      backgroundColor: '#2196F3',
      borderRadius: 2,
      height: 50,
      padding: 5,
    },
  }),
  button1: {
    borderWidth: 2,
    borderColor: GLOBAL_STYLES.BRAND_COLOR,
  },
  text: Platform.select({
    ios: {
      color: GLOBAL_STYLES.BRAND_COLOR,
      textAlign: 'center',
      padding: 8,
      fontSize: 18,
    },
    android: {
      color: 'white',
      textAlign: 'center',
      padding: 8,
      fontWeight: '500',
    },
  }),
  text1: {
    color: GLOBAL_STYLES.BRAND_COLOR,
  },
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
});
