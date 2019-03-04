import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import _ from 'lodash';

import { GLOBAL_STYLES, STAGE_VOTE, STAGE_REVEAL, STAGE_POST } from '../config/constants';
import VoteCounter from '../components/voteCounter';
import MaxVoteSetting from '../components/maxVoteSetting';
import Button from '../components/button';

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
      userId: this.props.navigation.getParam('userId', null),
      roomCode: this.props.navigation.getParam('roomCode', null),
      roomData,
      currentVote: 0,
    };

    this.listenToRoomChanges = this.listenToRoomChanges.bind(this);
  }

  componentDidMount() {
    this.listenToRoomChanges();
  }

  componentWillUnmount() {
    this.listenToRoomChanges = null;
  }

  onPress = page => {
    const roomStage = firebase.database().ref(`rooms/${this.state.roomCode}/metadata/stage`);
    const stage = page === 'Post' ? STAGE_POST : STAGE_REVEAL;
    roomStage.set(stage);
  };

  getCurrentVotes = curVotes => {
    let total = 0;

    Object.keys(curVotes).forEach(key => {
      total += curVotes[key];
    });
    return total;
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
    // console.log(posts);

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

  VoteItems = () => {
    const { posts, yourCurrentTotal, maxVotes } = this.state.roomData;

    const items = [];


    const testPosts = [];
    _.mapKeys(posts, data => {
      testPosts.push(data);
    });
    // console.log('my uniq post',uniqPosts);
    // console.log('posts', posts);

    // _.mapKeys(posts, (data, index) => {
    //   console.log(data);
    //   items.push(
    //     <VoteCounter
    //       {...data}
    //       key={index}
    //       id={index}
    //       userId={this.state.userId}
    //       roomCode={this.state.roomCode}
    //       max={parseInt(maxVotes, 10)}
    //       current={yourCurrentTotal}
    //       currentVote={this.state.currentVote}
    //       addCurrentVote={this.addCurrentVote}
    //     />,
    //   );
    // });
    _.mapKeys(posts, (data, index) => {
      items.push({
        data,
        index,
        userId: this.state.userId,
        roomCode:this.state.roomCode,
        max: parseInt(maxVotes, 10),
        current:yourCurrentTotal,
        currentVote:this.state.currentVote,
        addCurrentVote:this.addCurrentVote,
      });
    });
    const uniqueItems = _.uniqBy(items, item => item.data.content);
    console.log('uniqueItems', uniqueItems);

    return uniqueItems.map(data =>
      // console.log('data.content', data.data.content);
      // console.log('data',data);
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
      />
    );
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
