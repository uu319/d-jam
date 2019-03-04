import React, { PureComponent } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';

import Input from '../input';
import styles from './styles';

export default class TopicInput extends PureComponent {
  setTitle = () => {
    const { topic } = this.props;

    const metadateData = firebase.database().ref(`rooms/${this.props.roomCode}/metadata`);
    const metaDataValues = {
      topic: topic === '' ? 'Topics? Ideas?' : topic.trim(),
    };

    metadateData.update(metaDataValues, error => {
      if (error) {
        console.log('Error changing post title');
        console.log(error);
      }
    });
  };

  render() {
    return (
      <View>
        <Input
          style={styles.topic}
          mode="icon"
          roomCode={this.props.roomCode}
          onChangeText={this.props.onChange}
          onBlur={this.setTitle}
          value={this.props.topic}
                // value={"sample topic"}
          editable={this.props.editable}
          multiline
        />
      </View>
    );
  }
}

TopicInput.propTypes = {
  roomCode: PropTypes.string,
  editable: PropTypes.bool,
  topic: PropTypes.string,
  onChange: PropTypes.func,
};

TopicInput.defaultProps = {
  roomCode: '',
  editable: true,
  topic: 'Topics? Ideas?',
  onChange: () => {},
};
