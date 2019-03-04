import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import { GLOBAL_STYLES } from '../../config/constants';
import styles from './styles';

export default class Loader extends PureComponent {
  render() {
    return (
      <Modal
        visible={this.props.loading}
        transparent
        style={styles.content}
        onRequestClose={() => {}}
      >
        <View style={styles.content}>
          <ActivityIndicator animating color={GLOBAL_STYLES.BRAND_COLOR} size="large" />
        </View>
      </Modal>
    );
  }
}
