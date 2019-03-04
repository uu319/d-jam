import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  itemprop: {
    fontSize: 20,
    color: '#1F1F1F',
    width: Dimensions.get('window').width * 0.75,
    padding: 3,
    margin: 6,
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    alignSelf: 'stretch',
    margin: 3,
  },
});
