import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';

import { GLOBAL_STYLES, STAGE_POST } from '../config/constants';
import { generateRoomCode } from '../lib/helpers';
import Button from '../components/button';
import Input from '../components/input';
import Loading from '../components/loader';

const placeHolder = ['Start typing a topic', 'Where should we eat out?', 'How might we...'];

export default class CreateRoom extends React.Component {
  state = {
    content: placeHolder[2],
    ctr: 2,
    text: '',
    userId: this.props.navigation.getParam('userId', null),
    roomCode: null,
    isButtonDisabled: false,
    loading: false,
  };

  componentDidMount() {
    // change placeholder every 5 seconds
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        ctr: (prevState.ctr + 1) % placeHolder.length,
        content: placeHolder[prevState.ctr],
      }));
    }, 5000);
  }

  onChangeText = text => {
    this.setState({ text });
  };

  onPress = () => {
    this.setState(
      {
        roomCode: generateRoomCode(5),
        // roomCode: 10102,
        isButtonDisabled: true,
        loading: true,
      },
      () => {
        this.initializeRoom(this.state.roomCode);
      },
    );
  };

  initializeRoom = roomCode => {
    console.log('creating room...', roomCode);

    // add 92 seconds to time. additional 2 seconds so it looks like 1:30min
    let targetTime = new Date().getTime();
    targetTime += 92 * 1000;

    // initialize metadata
    const metadateData = firebase.database().ref(`rooms/${roomCode}/metadata`);
    const metadataInitialValue = {
      max_votes: 2,
      admin: this.state.userId,
      topic: this.state.text === '' ? 'Topics? Ideas?' : this.state.text.trim(),
      target_time: targetTime,
      stage: STAGE_POST,
    };

    metadateData.set(metadataInitialValue, error => {
      if (error) {
        console.log('An error occured for metadata');
        console.log(error);
        this.initializeRoom(this.state.roomCode);
      } else {
        this.joinUser();
      }
    });
  };

  joinUser = () => {
    const { roomCode, userId } = this.state;

    const usersDataRef = firebase.database().ref(`rooms/${roomCode}/users/${userId}`);

    usersDataRef.set({ current_votes: { nothing: 0 } }, error => {
      if (error) {
        console.log('Error trying to join. Will try to create.', error);
        this.initializeRoom(roomCode);
      } else {
        this.navigateScreen();
      }
    });
  };

  navigateScreen = () => {
    const { navigate } = this.props.navigation;
    const { roomCode, userId } = this.state;

    this.setState({
      loading: false,
      text: '',
      isButtonDisabled: false,
    });

    navigate('Post', {
      roomCode,
      userId,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <Text style={styles.title}> Set a Topic </Text>
        <Input
          onChangeText={this.onChangeText}
          value={this.state.text}
          placeholder={this.state.content}
          placeholderTextColor="gray"
          border="black"
        />
        <View style={styles.button}>
          <Button
            onPress={this.onPress}
            title="Start Decision Jam"
            color={GLOBAL_STYLES.BRAND_COLOR}
            disabled={this.state.isButtonDisabled} // show loader when disabled
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
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  title: {
    fontSize: 35,
    color: GLOBAL_STYLES.BRAND_COLOR,
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'stretch',
  },
});
