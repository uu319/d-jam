import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles';

export default class VoteCounter extends PureComponent {
  setUserVotes = direction => {
    const currentVotesRef = firebase
      .database()
      .ref(`rooms/${this.props.roomCode}/users/${this.props.userId}/current_votes`);

    console.log('set user votes', currentVotesRef);

    currentVotesRef.transaction(currentVotesData => {
      const current = currentVotesData || {};
      if (!_.has(current, this.props.id)) {
        current[this.props.id] = 0;
      }
      current[this.props.id] += direction;

      const newCurrentTotal = this.props.current + direction;
      // console.log(newCurrentTotal, this.props.max);

      if (current[this.props.id] < 0 || newCurrentTotal > this.props.max) {
        return undefined;
      }
      return current;
    });
  };

  adjustVote = direction => {
    // console.log('adjustVote');
    const postRef = firebase
      .database()
      .ref(`rooms/${this.props.roomCode}/posts/${this.props.id}/votes`);

    postRef.transaction(
      tally => {
        const newTally = (tally || 0) + direction;
        const newCurrentTotal = this.props.current + direction;
        // console.log(newCurrentTotal, this.props.max);
        // console.log(newTally);
        if (newTally < 0 || newCurrentTotal > this.props.max) {
          return undefined; /* abort the transction */
        }
        // Putting this here causes some problem when spamming the button
        // this.setUserVotes(direction);
        return newTally;
      },
      error => {
        console.log(error);
      },
    );
  };

  add = () => {
    // Spam button proof
    if (this.props.currentVote < this.props.max) {
      this.props.addCurrentVote(1);
      this.adjustVote(1);
      this.setUserVotes(1);
    } else {
      console.log('no more vote');
      this.props.modalVisible();
    }
  };

  sub = () => {
    if (this.props.currentVote > 0) {
      this.props.addCurrentVote(-1);
      this.adjustVote(-1);
      this.setUserVotes(-1);
    }
  };

  render() {
    console.log('VoteCounterProps', this.props);
    return (
      <View style={styles.content}>
        <Text style={styles.itemprop}> {this.props.content}</Text>
        {this.props.yourVote > 0 ? (
          <View style={styles.row}>
            <TouchableOpacity onPress={this.sub}>
              <Text style={styles.btn}>-</Text>
            </TouchableOpacity>
            <Text style={styles.item}> {this.props.yourVote} </Text>
            <TouchableOpacity onPress={this.add}>
              <Text style={styles.btn}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={this.add}>
            <Text style={styles.btn}>VOTE</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

VoteCounter.propTypes = {
  id: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  roomCode: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};
