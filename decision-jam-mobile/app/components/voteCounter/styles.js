import { StyleSheet, Dimensions } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  item: {
    fontSize: 14,
    padding: 10,
    fontWeight: 'bold',
  },
  itemprop: {
    fontSize: 14,
    color: '#1F1F1F',
    width: Dimensions.get('window').width * 0.5,
  },
  btn: {
    fontSize: 14,
    padding: 10,
    fontWeight: 'bold',
    color: GLOBAL_STYLES.BRAND_COLOR,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3D3D3',
    width: Dimensions.get('window').width * 0.8,
    alignSelf: 'stretch',
    margin: 3,
  },
  row: {
    flexDirection: 'row',
  },
});
