import React, { PureComponent } from 'react';
import { TextInput, View, TouchableOpacity, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles';

export default class Input extends PureComponent {
  getInvite = () => {
    console.log('getting invite link');

    const { roomCode } = this.props;

    const shareBlurb = `Join this Crowd Jam: ${roomCode} - https://decisionjam.com/#${roomCode}`;
    Share.share(
      {
        message: shareBlurb,
        url: `https://decisionjam.com/#${roomCode}`,
        title: `Join this crowd Jam: ${roomCode}`,
      },
      {
        // Android only:
        dialogTitle: `Join this crowd Jam: ${roomCode}`,
      },
    );
  };

  render() {
    const styling = [styles.textInput];
    if (!_.isEmpty(this.props.style)) {
      styling.push(this.props.style);
    }

    // ===================
    // Display component
    // ===================

    if (this.props.mode === 'icon') {
      return (
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textInputIcon}
            {...this.props}
          />
          <TouchableOpacity style={styles.iconStyle} onPress={this.getInvite}>
            <Icon name="share" size={20} />
          </TouchableOpacity>
        </View>
      );
    }

    return <TextInput underlineColorAndroid="transparent" style={styling} {...this.props} />;
  }
}

Input.MODE_NORMAL = 'normal';
Input.MODE_ICON = 'icon';

Input.propTypes = {
  mode: PropTypes.string,
  roomCode: PropTypes.string,
};

Input.defaultProps = {
  mode: Input.MODE_NORMAL,
  roomCode: '',
};
