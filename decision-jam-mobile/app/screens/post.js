import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from 'react-native';
import firebase from 'react-native-firebase';
import _ from 'lodash';

import { GLOBAL_STYLES, STAGE_POST, STAGE_VOTE } from '../config/constants';
import PostItem from '../components/post/postItem';
import Button from '../components/button';
import TopicInput from '../components/topicInput';

const roomData = {
  post_contents: [],
  current_votes: 0,
  topic: '',
  max_votes: 3,
  adminId: null,
  results_for_saving: '',
  current_stage: STAGE_POST,
  targetTime: '0:00',
  users: [],
  posts: [],
};

export default class PostRoom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVoteDisabled: true,
      isTopicEditable: true,
      post: '',
      userId: this.props.navigation.getParam('userId', null),
      roomCode: this.props.navigation.getParam('roomCode', null),
      myPostContents: [],

      countdownTimer: '',
      countdownInterval: null,
      placeholder: '0:00 | Suggest an answer...',
      roomData: _.cloneDeep(roomData),
    };
    this.listenToRoomChanges = this.listenToRoomChanges.bind(this);
  }

  componentDidMount() {
    // this.setState({roomData[posts]:[]});

    this.listenToRoomChanges();
  }

  componentWillUnmount() {
    this.listenToRoomChanges = null;
  }

  onNavigateToVote = () => {
    firebase
      .database()
      .ref(`rooms/${this.state.roomCode}/metadata/stage`)
      .set(STAGE_VOTE);
  };

  onChangeText = post => {
    this.setState({ post });
  };

  onTopicChange = newTopic => {
    this.setState({
      roomData: {
        topic: newTopic,
      },
    });
  };

  getMyCards = () => {
    const { roomCode } = this.state;
    const currentContents = {};

    const postsRef = firebase.database().ref(`rooms/${roomCode}/posts`);
    postsRef.once('value').then(snapshot => {
      _.mapKeys(snapshot.val(), (data, key) => {
        if (this.state.userId === data.poster) {
          _.assign(currentContents, { [key]: data });
        }
      });
      this.setState({
        myPostContents: currentContents,
        isVoteDisabled: _.isEmpty(currentContents),
      });
    });
  };

  setTimer = roomValues => {
    //    console.console.log;
    const { targetTime } = this.state.roomData;
    if (!roomValues.metadata.target_time) {
      // no target time. don't start timer. do nothing
    } else if (!targetTime && roomValues.metadata.target_time) {
      // start timer
      const currentTime = new Date().getTime();
      this.setState({
        countdownTimer: (roomValues.metadata.target_time - currentTime) / 1000,
      });
      this.startTimer();
    } else if (targetTime && targetTime !== roomValues.metadata.target_time) {
      // target time has changed. adjust ours.
      const currentTime = new Date().getTime();
      this.setState({
        countdownTimer: (roomValues.metadata.target_time - currentTime) / 1000,
      });
      this.startTimer();
    } else {
      // assume that targetTime is still the same. keep things as is
    }
    this.startTimer();
  };

  startTimer = () => {
    let { countdownInterval, countdownTimer } = this.state;
    this.displayTime();
    try {
      clearInterval(countdownInterval);
    } catch (e) {
      console.log(e);
    }

    countdownInterval = setInterval(() => {
      this.displayTime();

      countdownTimer -= 1;
      if (countdownTimer < 0) {
        clearInterval(countdownInterval);
        this.setState({ countdownTimer });
      }
      // console.log('currentTest', this.state);
      this.setState({ countdownInterval, countdownTimer });
    }, 1000);
  };

  displayTime = () => {
    let { countdownTimer } = this.state;
    const { targetTime } = this.state.roomData;
    // i have to check this
    if (targetTime) {
      const currentTime = new Date().getTime();
      countdownTimer = (targetTime - currentTime) / 1000;
    }
    if (countdownTimer < 0 || targetTime - new Date().getTime() < 0) {
      this.setState({ countdownTimer: 0 });
    }

    const minutes = parseInt(countdownTimer / 60, 10);
    let seconds = parseInt(countdownTimer % 60, 10);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    const time = `${minutes}:${seconds}`;

    this.setState({
      placeholder: `${countdownTimer && countdownTimer > 0 ? time : '0:00'} | Suggest an answer...`,
    });
  };
  extendTimer = () => {
    const targetTimeRef = firebase
      .database()
      .ref(`rooms/${this.state.roomCode}/metadata/target_time`);
    targetTimeRef.transaction(targetTimeTimestamp => {
      let timestamp = targetTimeTimestamp;

      if (!timestamp || timestamp - new Date().getTime() < 0) {
        // time now is greater than the current targetTime');
        timestamp = new Date().getTime();
      }
      return timestamp + 12000;
    });

    if (!this.state.countdownInterval) {
      this.startTimer();
    }
  };

  addCard = () => {
    const { post, roomCode, userId, myPostContents } = this.state;
    const { adminId } = this.state.roomData;
    const postText = post.trim();

    if (postText.length > 0) {
      // ==========================
      //      FIND DUPLICATES
      // ==========================
      const duplicateItem = _.filter(
        myPostContents,
        item => item.content.toLowerCase() === postText.toLowerCase(),
      );

      if (!_.isEmpty(duplicateItem)) {
        this.setState({
          post: '',
        });
        return;
      }
      // =========================
      //  ADD DATA TO FIREBASE /
      //  SET TIMER
      // =========================
      const postsData = firebase.database().ref(`rooms/${roomCode}/posts`);
      const postContent = {
        content: postText,
        votes: 0,
        poster: userId,
      };
      postsData.push(postContent);
      this.getMyCards(postContent);
    } else if (userId === adminId) {
      this.extendTimer();
    }
    // clear textbox
    this.setState({
      post: '',
    });
  };

  listenToRoomChanges = () => {
    const firebaseRoomData = firebase.database().ref(`rooms/${this.state.roomCode}`);
    firebaseRoomData.on('value', snapshot => {
      const contents = snapshot.val();
      if (contents) {
        this.refreshRoom(contents);
      }
    });
  };

  refreshRoom = roomValues => {
    let { posts, users } = roomValues;
    const { metadata } = roomValues;

    if (_.isEmpty(posts)) posts = {};
    if (_.isEmpty(users)) users = {};

    this.setTimer(roomValues);

    const buttonstate = _.isEmpty(posts);
    this.setState({
      isTopicEditable: metadata.admin === this.state.userId,
      isVoteDisabled: buttonstate,
      roomData: {
        adminId: metadata.admin,
        topic: metadata.topic,
        targetTime: metadata.target_time,
        current_stage: metadata.stage,
        posts,
        users,
        ...roomValues,
      },
    });
    // console.log(this.state.roomData.targetTime - new Date().getTime());

    // Navigate to screen according to stage
    //  Happens when admin is not current user
    const { stage } = metadata;
    if (stage !== 'posting') {
      this.setState({
        myPostContents: [],
      });
      const { navigate } = this.props.navigation;
      const { roomCode, userId } = this.state;
      let room = null;
      // Useful when user joined from a WEB-based room admin
      room = stage === STAGE_VOTE ? 'Vote' : 'Result';
      navigate(room, {
        userId,
        roomCode,
      });
    }
  };

  Post = () => {
    const { myPostContents } = this.state;
    const Post = [];

    _.mapKeys(myPostContents, (data, key) => {
      Post.push(<PostItem key={key} {...data} />);
    });

    return Post;
  };

  render() {
    const { roomCode, post, placeholder, isVoteDisabled, isTopicEditable, userId } = this.state;
    const { adminId, topic } = this.state.roomData;

    return (
      <View style={styles.container} behavior="padding" enabled>
        <Text style={{ fontSize: 24 }}>{roomCode}</Text>
        <View style={styles.container}>
          <TopicInput
            roomCode={roomCode}
            editable={isTopicEditable}
            topic={topic}
            onChange={this.onTopicChange}
          />
          <ScrollView>
            <View>{this.Post()}</View>
          </ScrollView>
          <KeyboardAvoidingView style={styles.input}>
            <TextInput
              onChangeText={this.onChangeText}
              value={post}
              placeholder={placeholder}
              placeholderTextColor="gray"
              style={styles.text}
            />
            <View style={styles.button}>
              <Button onPress={this.addCard} title="Add" color={GLOBAL_STYLES.BRAND_COLOR} />
            </View>
          </KeyboardAvoidingView>
          <View style={styles.button}>
            {adminId === userId && (
              <Button
                onPress={this.onNavigateToVote}
                title="Vote"
                disabled={isVoteDisabled}
                color={GLOBAL_STYLES.BRAND_COLOR}
              />
            )}
          </View>
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
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  text: {
    width: Dimensions.get('window').width * 0.7,
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  topic: {
    fontSize: 40,
  },
  buttonSet: {
    margin: 10,
    alignSelf: 'stretch',
    width: Dimensions.get('window').width * 0.4,
  },
});
