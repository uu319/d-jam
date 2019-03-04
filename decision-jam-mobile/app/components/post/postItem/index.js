import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

export default class PostItem extends PureComponent {
  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.itemprop}> {this.props.content} </Text>
      </View>
    );
  }
}

PostItem.propTypes = {
  content: PropTypes.string,
};

PostItem.defaultProps = {
  content: '',
};
