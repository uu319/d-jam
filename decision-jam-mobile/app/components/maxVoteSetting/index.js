import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';

import styles from './styles';

export default class MaxVoteSetting extends PureComponent {
  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  adjustMaxVotes = direction => {
    console.log('adjusting: ', direction);

    const maxVoteRef = firebase.database().ref(`rooms/${this.props.roomCode}/metadata/max_votes`);
    maxVoteRef.transaction(
      maxVotes => {
        const newMaxVotes = (maxVotes || 0) + direction;
        if (newMaxVotes < 1) {
          return undefined; /* abort the transction */
        }

        return newMaxVotes;
      },
      error => {
        if (error) {
          console.log(error);
        }
      },
    );
  };

  addMax = () => {
    this.adjustMaxVotes(1);
  };

  subtractMax = () => {
    this.adjustMaxVotes(-1);
  };

  render() {
    return (
      <View style={styles.control}>
        <Text style={styles.label}>Max votes per person: </Text>
        <TouchableOpacity style={styles.btn} onPress={this.subtractMax}>
          <Text style={styles.operator}>-</Text>
        </TouchableOpacity>
        <Text style={styles.number}>{this.props.text}</Text>
        <TouchableOpacity style={styles.btn} onPress={this.addMax}>
          <Text style={styles.operator}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

MaxVoteSetting.propTypes = {
  text: PropTypes.string.isRequired,
  roomCode: PropTypes.string.isRequired,
};
