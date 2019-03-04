import { createStackNavigator } from 'react-navigation';
import { GLOBAL_STYLES } from './constants';
import Landing from '../screens/landing';
import JoinRoom from '../screens/join';
import CreateRoom from '../screens/create';
import PostRoom from '../screens/post';
import VoteRoom from '../screens/vote';
import ResultRoom from '../screens/result';

const defaultNavOptions = {
  headerTintColor: GLOBAL_STYLES.BRAND_COLOR,
  headerTitleStyle: {
    fontWeight: '500',
    fontSize: 24,
    marginTop: 5,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  // headerRight: <View />,
};

const AppSwitchNavigator = createStackNavigator(
  {
    Home: {
      screen: Landing,
      navigationOptions: {
        header: null,
      },
    },
    Join: {
      screen: JoinRoom,
      navigationOptions: defaultNavOptions,
    },
    Create: {
      screen: CreateRoom,
      navigationOptions: defaultNavOptions,
    },
    Post: {
      screen: PostRoom,
      navigationOptions: {
        ...defaultNavOptions,
        headerTitle: 'Post',
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
    Vote: {
      screen: VoteRoom,
      navigationOptions: {
        ...defaultNavOptions,
        headerTitle: 'Post',
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
    Result: {
      screen: ResultRoom,
      navigationOptions: {
        ...defaultNavOptions,
        headerTitle: 'Post',
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export { AppSwitchNavigator };
export default AppSwitchNavigator;
