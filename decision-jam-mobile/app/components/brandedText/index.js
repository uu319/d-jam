import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class BrandedText extends PureComponent {
  render() {
    const { style, type } = this.props;
    const textStyles = [styles.default];

    if (type) {
      textStyles.push(styles[type]);
    }

    return (
      <Text style={textStyles}>
        <Text style={style}>{this.props.content}</Text>
      </Text>
    );
  }
}

BrandedText.TYPE_LABEL = 'label';
BrandedText.TYPE_CONTENT = 'content';
BrandedText.TYPE_BUTTON_TEXT = 'buttonText';

BrandedText.propTypes = {
  content: PropTypes.string,
  type: PropTypes.oneOf([
    BrandedText.TYPE_LABEL,
    BrandedText.TYPE_CONTENT,
    BrandedText.TYPE_BUTTON_TEXT,
  ]),
};

BrandedText.defaultProps = {
  content: '',
  type: BrandedText.TYPE_LABEL,
};
