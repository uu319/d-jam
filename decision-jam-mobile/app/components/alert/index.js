import React, { PureComponent } from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import styles from './styles';
import { GLOBAL_STYLES } from '../../config/constants';

export default class PromptAlert extends PureComponent {
  onModalConfirm = () => {
    if (this.props.page) {
      this.props.onModalConfirm(this.props.page);
    } else {
      this.props.onModalConfirm();
    }
  };
  onModalCancel = () => {
    this.props.onModalCancel();
  }
  render() {
    const {
      modalContainer,
      viewContainer,
      buttonContainer,
      buttonCancelStyle,
      buttonConfirmStyle,
      textCancelStyle,
      textConfirmStyle
    }= styles;
    return (
      <Modal
        visible={this.props.visible}
        transparent
        style={modalContainer}
        animationIn="slideInUp"
        animationInTiming={300}
        onRequestClose={() => {}}
      >
        <View style={viewContainer}>
          <Text>
            <Icon name="exclamation-circle" size={60} color="#f8bb86" />;
          </Text>
          <Text style={{
             fontSize: 20,
              textAlign: 'center',
            }}
          >
            Are you sure you want to continue?
          </Text>

        <View style={buttonContainer}>
            <TouchableOpacity style={buttonCancelStyle} onPress={this.onModalCancel}>
              <Text style={textCancelStyle}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={buttonConfirmStyle} onPress={this.onModalConfirm}>
              <Text style={textConfirmStyle}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
