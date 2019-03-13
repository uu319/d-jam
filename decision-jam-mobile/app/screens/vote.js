import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, BackHandler } from 'react-native';
import firebase from 'react-native-firebase';
import _ from 'lodash';

import { GLOBAL_STYLES, STAGE_VOTE, STAGE_REVEAL, STAGE_POST } from '../config/constants';
import VoteCounter from '../components/voteCounter';
import MaxVoteSetting from '../components/maxVoteSetting';
import Button from '../components/button';
// import PromptAlert from '../components/alert';
import PromptModal from '../components/modal';

const roomData = {
  currentVotes: 0,
  topic: '',
  maxVotes: '2',
  adminId: null,
  current_stage: STAGE_VOTE,
  users: [],
  posts: [],
};

export default class VoteRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voteAlertVisible: false,
      userId: this.props.navigation.getParam('userId', null),
      roomCode: this.props.navigation.getParam('roomCode', null),
      roomData,
      currentVote: 0,
      voteModalVisible: false,
    };

    this.listenToRoomChanges = this.listenToRoomChanges.bind(this);
  }

  componentDidMount() {
    this.listenToRoomChanges();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this.setState({ voteAlertVisible: false });
    this.setState({ voteModalVisible: false });
    this.listenToRoomChanges = null;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  onPress = page => {
    if (this.state.roomData.totalGivenVotes === this.state.roomData.maxVotesCount) {
      const roomStage = firebase.database().ref(`rooms/${this.state.roomCode}/metadata/stage`);
      const stage = page === 'Post' ? STAGE_POST : STAGE_REVEAL;
      roomStage.set(stage);
    } else {
      this.setState({ voteAlertVisible: true });
    }
  };

  onAlertConfirm = () => {
    this.setState({ voteAlertVisible: false }, this.changeRoom());
  };
  onAlertCancel = () => {
    this.setState({ voteAlertVisible: false });
  };

  onModalToggle = modalID => {
    if (modalID === 'NoVote') {
      this.setState({ voteModalVisible: !this.state.voteModalVisible });
    } else if (modalID === 'NotContinue') {
      this.setState({ voteAlertVisible: !this.state.voteAlertVisible });
    }
  };

  getCurrentVotes = curVotes => {
    let total = 0;

    Object.keys(curVotes).forEach(key => {
      total += curVotes[key];
    });
    return total;
  };

  changeRoom = page => {
    const roomStage = firebase.database().ref(`rooms/${this.state.roomCode}/metadata/stage`);
    const stage = page === 'Post' ? STAGE_POST : STAGE_REVEAL;
    roomStage.set(stage);
  };

  handleBackButton = () => {
    firebase
      .database()
      .ref(`rooms/${this.state.roomCode}/metadata/stage`)
      .set(STAGE_POST);
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
    console.log('roomValues', roomValues);

    if (_.isEmpty(posts)) posts = {};
    if (_.isEmpty(users)) users = {};

    // ========================
    //  Set totals for votes
    // ========================

    let totalGivenVotes = 0;
    let maxVotesCount = 0;
    let currentVotes = 0;

    if (users) {
      const userCurrentVotes = users[this.state.userId].current_votes || 0;
      _.map(userCurrentVotes, number => {
        currentVotes += number;
      });

      _.mapKeys(users, (data, index) => {
        totalGivenVotes += this.getCurrentVotes(roomValues.users[index].current_votes);
        maxVotesCount += parseInt(roomValues.metadata.max_votes, 10);
      });
    }

    const yourCurrentVotes = users[this.state.userId].current_votes;
    let yourCurrentTotal = 0;
    if (!_.isEmpty(posts) && yourCurrentVotes) {
      _.mapKeys(yourCurrentVotes, (data, index) => {
        if (posts[index] && posts[index] !== 'nothing') {
          posts[index].yourVote = data;
          yourCurrentTotal += data;
        }
      });
    }

    this.setState({
      roomData: {
        adminId: metadata.admin,
        topic: metadata.topic,
        maxVotes: metadata.max_votes,
        current_stage: metadata.stage,
        maxVotesCount,
        currentVotes,
        yourCurrentTotal,
        totalGivenVotes,
        posts,
        users,
      },
    });
    // Navigate to screen according to stage
    //  Happens when admin is not current user
    const { stage } = metadata;
    if (stage !== STAGE_VOTE) {
      const { navigate } = this.props.navigation;
      const { roomCode, userId } = this.state;
      let room = null;
      // Useful when user joined from a WEB-based room admin
      room = stage === STAGE_POST ? 'Post' : 'Result';
      navigate(room, {
        userId,
        roomCode,
      });
    }
  };

  addCurrentVote = direction => {
    this.setState(prevState => ({
      currentVote: prevState.currentVote + direction < 0 ? 0 : prevState.currentVote + direction,
    }));
  };

  modalVisible = () => {
    console.log('Entered Modal Visible');
    this.setState({ voteModalVisible: true });
  };

  VoteItems = () => {
    const { posts, yourCurrentTotal, maxVotes } = this.state.roomData;
    const items = [];

    _.mapKeys(posts, (data, index) => {
      items.push({
        data,
        index,
        userId: this.state.userId,
        roomCode: this.state.roomCode,
        max: parseInt(maxVotes, 10),
        current: yourCurrentTotal,
        currentVote: this.state.currentVote,
        addCurrentVote: this.addCurrentVote,
        modalVisible: this.modalVisible,
      });
    });
    const uniqueItems = _.uniqBy(items, item => item.data.content);

    return uniqueItems.map(data => {
      console.log('data passed to voteCounter', data);
      return (
        <VoteCounter
          {...data.data}
          key={data.index}
          id={data.index}
          userId={this.state.userId}
          roomCode={this.state.roomCode}
          max={parseInt(maxVotes, 10)}
          current={yourCurrentTotal}
          currentVote={this.state.currentVote}
          addCurrentVote={this.addCurrentVote}
          modalVisible={this.modalVisible}
        />
      );
    });
    // return items;
  };

  render() {
    const {
      topic,
      maxVotes,
      adminId,
      maxVotesCount,
      currentVotes,
      totalGivenVotes,
    } = this.state.roomData;

    return (
      <View style={styles.container}>
        {/* <PromptAlert
          visible={this.state.voteAlertVisible}
          onModalConfirm={this.onAlertConfirm}
          onModalCancel={this.onAlertCancel}
        /> */}
        <PromptModal
          visible={this.state.voteAlertVisible}
          modalID="NotContinue"
          onModalToggle={this.onModalToggle}
          onAlertConfirm={this.onAlertConfirm}
          title="WAIT!"
          text="Are you sure you want to continue?"
          isContinue
          cancelButtonTxt="No"
        />
        <PromptModal
          visible={this.state.voteModalVisible}
          modalID="NoVote"
          onModalToggle={this.onModalToggle}
          title="STOP!"
          isContinue={false}
          text="You already used all your vote points."
          cancelButtonTxt="Ok"
        />
        <Text style={styles.title}> {topic} </Text>

        {adminId === this.state.userId && (
          <View>
            <View style={styles.input} />
            <MaxVoteSetting text={maxVotes.toString()} roomCode={this.state.roomCode} />
          </View>
        )}

        <View style={styles.status}>
          <View style={styles.votes}>
            <Text>
              {totalGivenVotes} / {maxVotesCount}
            </Text>
            <Text>Total Votes</Text>
          </View>
          <View style={styles.votes}>
            <Text>
              {currentVotes} / {maxVotes}
            </Text>
            <Text>Your Votes</Text>
          </View>
        </View>

        <ScrollView>
          <View>{this.VoteItems()}</View>
        </ScrollView>

        <View style={styles.button}>
          {this.state.roomData.adminId === this.state.userId && (
            <Button
              onPress={this.onPress}
              title="Result"
              disabled={this.state.disabled}
              color={GLOBAL_STYLES.BRAND_COLOR}
            />
          )}
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
  title: {
    fontSize: 40,
    color: GLOBAL_STYLES.SECONDARY_COLOR,
  },
  itemprop: {
    fontSize: 20,
    color: 'gray',
    width: Dimensions.get('window').width * 0.75,
  },
  button: {
    alignSelf: 'stretch',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  votes: {
    flexDirection: 'column',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSet: {
    margin: 10,
    alignSelf: 'stretch',
    width: Dimensions.get('window').width * 0.4,
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
