import { StyleSheet, Dimensions } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';

export default StyleSheet.create({
  itemprop: {
    fontSize: 14,
    color: '#1F1F1F',
    width: Dimensions.get('window').width * 0.5,
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
  btn: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    color: GLOBAL_STYLES.SECONDARY_COLOR,
  },
});
