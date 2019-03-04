import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export default class PostedItem extends PureComponent {
  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.itemprop}> {this.props.content} </Text>
        <Text style={styles.btn}> {this.props.votes > 0 && this.props.votes} </Text>
      </View>
    );
  }
}
