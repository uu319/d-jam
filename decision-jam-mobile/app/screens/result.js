import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import firebase from 'react-native-firebase';
import _ from 'lodash';

import { GLOBAL_STYLES, STAGE_REVEAL, STAGE_POST } from '../config/constants';
import Result from '../components/postedItem';
import Button from '../components/button';
// import PromptAlert from '../components/alert';
import PromptModal from '../components/modal';

const roomData = {
  post_contents: [],
  current_votes: 0,
  topic: '',
  maxVotes: '2',
  adminId: null,
  results_for_saving: '',
  current_stage: STAGE_REVEAL,
  users: [],
  posts: [],
};

export default class ResultRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restartAlertVisible: false,
      userId: this.props.navigation.getParam('userId', null),
      roomCode: this.props.navigation.getParam('roomCode', null),
      roomData,
    };

    this.listenToRoomChanges = this.listenToRoomChanges.bind(this);
  }

  componentDidMount() {
    this.listenToRoomChanges();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this.setState({ restartAlertVisible: false });
    this.listenToRoomChanges = null;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  onPress = page => {
    const { navigation } = this.props;
    if (page === 'Post') {
      this.setState({ restartAlertVisible: true });
      // Restart jam
    } else {
      // roomCode -> null :: avoids going back to Post page when admin restarts jam, considering the user joined the room after the jam. Does not work when user joined before jam ended
      this.state.roomCode = null;
      if (page === 'Home') {
        navigation.popToTop();
      } else if (page === 'Download') {
        console.log('Download Clicked');
      } else {
        navigation.navigate(page, {
          userId: this.state.userId,
          roomCode: null,
        });
      }
    }
  };
  onAlertConfirm = () => {
    this.setState({ restartAlertVisible: false });
    const { roomCode } = this.state;
    let targetTime = new Date().getTime();
    targetTime += 92 * 1000;
    const database = firebase.database();
    const roomStage = database.ref(`rooms/${roomCode}/metadata/stage`);
    const targetTimeRef = database.ref(`rooms/${roomCode}/metadata/target_time`);
    const user = Object.keys(this.state.roomData.users);
    // clear ideas
    database.ref(`rooms/${roomCode}/posts`).remove();
    // clear votes
    for (let i = 0; i < user.length; i += 1) {
      const userRef = database.ref(`rooms/${roomCode}/users/${user[i]}`);
      userRef.set({ current_votes: { nothing: 0 } }, error => {
        if (error) {
          console.log(error);
        }
      });
    }
    roomStage.set(STAGE_POST);
    targetTimeRef.set(targetTime);
  };
  onAlertCancel = () => {
    this.setState({ restartAlertVisible: false });
  };

  handleBackButton = () => {
    ToastAndroid.show("You can't go back to vote page!", ToastAndroid.SHORT);
    return true;
  };

  listenToRoomChanges = () => {
    console.log('listen to room changes...');
    const firebaseRoomData = firebase.database().ref(`rooms/${this.state.roomCode}`);
    firebaseRoomData.on('value', snapshot => {
      const contents = snapshot.val();
      if (contents) {
        this.refreshRoom(contents);
      }
    });
  };

  refreshRoom = roomValues => {
    console.log('result roomValues', roomValues);

    let { posts, users } = roomValues;
    const { metadata } = roomValues;

    if (_.isEmpty(posts)) posts = {};
    if (_.isEmpty(users)) users = {};

    this.setState({
      roomData: {
        adminId: metadata.admin,
        topic: metadata.topic,
        maxVotes: metadata.max_votes,
        current_stage: metadata.stage,
        posts,
        users,
      },
    });

    // Navigate to screen according to stage
    //  Happens when admin is not current user
    const { stage } = metadata;
    if (stage !== STAGE_REVEAL) {
      const { navigate } = this.props.navigation;
      const { roomCode, userId } = this.state;
      let room = null;
      // Useful when user joined from a WEB-based room admin
      room = stage === STAGE_POST ? 'Post' : 'Vote';
      navigate(room, {
        userId,
        roomCode,
      });
    }
  };

  Items = () => {
    const { posts } = this.state.roomData;
    const items = [];

    const orderedVotes = _.orderBy(posts, ['votes'], ['desc']);
    _.mapKeys(orderedVotes, (data, index) => {
      items.push(<Result key={index} {...data} />);
    });

    return items;
    // _.mapKeys(orderedVotes, (data, index) => {
    //   items.push({
    //     key: index,
    //     data,
    //   });
    // });
    // const uniqueItems = _.uniqBy(items, item => item.data.content);
    // return uniqueItems.map(data => <Result {...data.data} key={data.index} />);
  };

  buttons = [
    {
      index: 1,
      page: 'Download',
      label: 'Download Result',
      style: null,
      color: GLOBAL_STYLES.BRAND_COLOR,
    },
    {
      index: 2,
      page: 'Create',
      label: 'Create New Jam',
      style: null,
      color: GLOBAL_STYLES.BRAND_COLOR,
    },
    {
      index: 3,
      page: 'Home',
      label: 'Home',
      style: 1,
      color: 'white',
    },
  ];

  render() {
    const { adminId, topic } = this.state.roomData;
    return (
      <View style={styles.container}>
        <PromptModal
          visible={this.state.restartAlertVisible}
          modalID="Restart"
          onModalToggle={this.onAlertCancel}
          onAlertConfirm={this.onAlertConfirm}
          title="WAIT!"
          text="Delete All and Restart?"
          isContinue
          cancelButtonTxt="No"
        />
        <View style={styles.header}>
          <Text style={styles.title}>Hooray! We&apos;ve got winners! 🎉</Text>
          <Text
            style={{
              color: GLOBAL_STYLES.SECONDARY_COLOR,
              fontWeight: 'bold',
            }}
          >
            TOPIC
          </Text>
          <Text style={styles.topic}>{topic}</Text>
        </View>
        <ScrollView>
          <View>{this.Items()}</View>
        </ScrollView>
        <View style={styles.buttonGroup}>
          {adminId === this.state.userId && (
            <View key={0} style={styles.button}>
              <Button
                onPress={this.onPress}
                title="Restart the Jam"
                page="Post"
                style={null}
                color={GLOBAL_STYLES.BRAND_COLOR}
              />
            </View>
          )}
          {this.buttons.map(button => (
            <View key={button.index} style={styles.button}>
              <Button
                onPress={this.onPress}
                title={button.label}
                page={button.page}
                style={button.style}
                color={button.color}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  header: {
    alignItems: 'flex-start',
    width: Dimensions.get('window').width * 0.8,
  },
  topic: {
    fontSize: 20,
    marginBottom: 10,
    color: GLOBAL_STYLES.BRAND_COLOR,
  },
  title: {
    fontSize: 35,
    color: GLOBAL_STYLES.SECONDARY_COLOR,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'column',
    width: Dimensions.get('window').width * 0.8,
  },
  button: {
    margin: 2,
    // width: 50,
  },
});
