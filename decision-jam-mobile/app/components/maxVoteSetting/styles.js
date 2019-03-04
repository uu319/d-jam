import { StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  label: {
    fontSize: 20,
  },
  number: {
    fontSize: 20,
    fontWeight: '500',
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  operator: {
    fontWeight: '900',
    fontSize: 16,
    fontFamily: GLOBAL_STYLES.FONT_STYLE,
    color: '#FFF',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: GLOBAL_STYLES.BRAND_COLOR,
    borderRadius: 100,
    margin: 10,
  },
});
