import { StyleSheet, Dimensions } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textInputIcon: {
    flex: 0.5,
    padding: 20,
    paddingRight: 0,
    fontSize: 40,
    textAlign: 'center',
    color: GLOBAL_STYLES.BRAND_COLOR,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 0.5,
    fontSize: 30,
    textAlign: 'center',
    color: GLOBAL_STYLES.BRAND_COLOR,
    fontWeight: 'bold',
    width: Dimensions.get('window').width * 0.8,
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
  iconStyle: {
    padding: 10,
    marginRight: 20,
  },
});
