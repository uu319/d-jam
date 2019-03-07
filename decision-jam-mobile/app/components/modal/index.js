import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import styles from './styles';
import { GLOBAL_STYLES } from '../../config/constants';

export default class PromptModal extends Component {
  onModalToggle = modalID => {
    this.props.onModalToggle(modalID);
  };
  onAlertConfirm = () => {
    this.props.onAlertConfirm();
  };
  render() {
    const { title, text, cancelButtonTxt, isContinue, modalID } = this.props;
    let contButton;
    if (isContinue) {
      contButton = (
        <Button title="Yes" onPress={this.onAlertConfirm} color={GLOBAL_STYLES.BRAND_COLOR} />
      );
    }
    return (
      <Modal isVisible={this.props.visible} onBackdropPress={this.onModalToggle}>
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
            <Text>
              <Icon name="exclamation-circle" size={150} color="#f8bb86" />
            </Text>
            <Text>{text}</Text>

            <View style={styles.buttons}>
              <View style={styles.button}>{contButton}</View>
              <View style={styles.button}>
                <Button
                  title={`${cancelButtonTxt}`}
                  onPress={() => this.onModalToggle(`${modalID}`)}
                  color={GLOBAL_STYLES.BRAND_COLOR}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

PromptModal.propTypes = {
  modalID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  cancelButtonTxt: PropTypes.string.isRequired,
  isContinue: PropTypes.bool.isRequired,
};
