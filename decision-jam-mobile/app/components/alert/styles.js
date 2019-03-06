import { StyleSheet} from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewContainer: {
    width:'80%',
    height:'30%',
    padding:20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 7,
  },
  buttonContainer:{
    flexDirection:'row',
    flex:1,
    width:'50%',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  buttonView:{
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonCancelStyle:{
    backgroundColor: '#efefef',
    height:35,
    borderRadius: 3,
    padding:7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonConfirmStyle:{
    backgroundColor: '#7cd1f9',
    height:35,
    borderRadius: 3,
    padding:7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCancelStyle: {
    color:'#555',
    fontSize:15,
    alignSelf:'center',
  },
  textConfirmStyle: {
    color:'#ffffff',
    fontSize: 15,
  },
});
