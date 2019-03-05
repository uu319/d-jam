import React, { PureComponent } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';
import styles from './styles';

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
    return (
      <Modal
        visible={this.props.visible}
        transparent
        style={styles.content}
        onRequestClose={() => {}}
      >
        <View style={styles.viewContent}>
          <Text style={{ fontSize: 20 }}>Are you sure you want to continue?</Text>
        <View style={styles.buttonView}>
          <Button
              title="Cancel"
              onPress={this.onModalCancel}
              color={GLOBAL_STYLES.BRAND_COLOR}
              accessibilityLabel="Learn more about this purple button"
            />
          <Button
            title="Yes"
            onPress={this.onModalConfirm}
            color={GLOBAL_STYLES.BRAND_COLOR}
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
      </Modal>
    );
  }
}
