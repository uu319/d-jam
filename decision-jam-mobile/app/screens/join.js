import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import firebase from 'react-native-firebase';

import { GLOBAL_STYLES } from '../config/constants';
import Button from '../components/button';
import Input from '../components/input';
import BrandedText from '../components/brandedText';

const STAGES = {
  posting: 'Post',
  voting: 'Vote',
  reveal: 'Result',
};

export default class JoinRoom extends Component {
  state = {
    userId: this.props.navigation.getParam('userId', null),
    roomCode: this.props.navigation.getParam('roomCode', null),
    isJoinDisabled: true,
  };

  onChangeText = roomCode => {
    const state = roomCode === '';

    this.setState({
      roomCode,
      isJoinDisabled: state,
    });
  };

  navigate = () => {
    const { roomCode } = this.state;
    const metadataRef = firebase.database().ref(`rooms/${roomCode}/metadata`);

    metadataRef.once('value').then(snapshot => {
      if (snapshot.val() && snapshot.val().stage) {
        const { stage } = snapshot.val();

        const { navigate } = this.props.navigation;
        return navigate(STAGES[stage], {
          roomCode: this.state.roomCode,
          userId: this.state.userId,
        });
      }

      return undefined;
    });
  };

  joinUser = () => {
    const { roomCode, userId } = this.state;
    const usersDataRef = firebase.database().ref(`rooms/${roomCode}/users/${userId}`);

    usersDataRef
      .set({ current_votes: { nothing: 0 } }, error => {
        if (error) {
          console.log('error trying to join. will try to create.', error);
          this.joinUser();
        }
      })
      .then(error => {
        if (error) {
          console.log(error);
          return null;
        }

        this.navigate();
        return true;
      });
  };

  render() {
    const { isJoinDisabled } = this.state;
    return (
      <View style={styles.container}>
        <BrandedText style={styles.title} content="Room code" />
        <Input
          onChangeText={this.onChangeText}
          placeholder="Enter room code"
          placeholderTextColor="gray"
        />
        <View style={styles.button}>
          <Button
            onPress={this.joinUser}
            title="Join"
            color={GLOBAL_STYLES.BRAND_COLOR}
            disabled={isJoinDisabled}
          />
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
  title: {
    fontSize: 40,
    color: GLOBAL_STYLES.SECONDARY_COLOR,
  },
  button: {
    alignSelf: 'stretch',
  },
});
