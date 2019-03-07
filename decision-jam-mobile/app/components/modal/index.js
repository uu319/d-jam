import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import styles from './styles';
import { GLOBAL_STYLES } from '../../config/constants';

export default class PromptModal extends Component {
  onModalToggle = () => {
    this.props.onModalToggle();
  };
  render() {
    const { title, text } = this.props;
    return (
      <Modal isVisible={this.props.visible}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text>{text}</Text>
            <Button title="Hide" onPress={this.onModalToggle} color={GLOBAL_STYLES.BRAND_COLOR} />
          </View>
        </View>
      </Modal>
    );
  }
}

PromptModal.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
