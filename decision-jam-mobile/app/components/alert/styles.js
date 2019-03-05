import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewContent: {
    width:'80%',
    height:'40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  buttonView:{
    flexDirection:'row',
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
