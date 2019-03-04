import { StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  default: {
    fontFamily: GLOBAL_STYLES.FONT_STYLE,
  },
  label: {
    color: '#1C1E3F',
  },
  content: {
    color: GLOBAL_STYLES.DARK_GREY_COLOR,
  },
  buttonText: {
    color: '#FFF',
  },
});
