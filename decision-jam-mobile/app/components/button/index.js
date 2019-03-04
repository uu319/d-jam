import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ColorPropType,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { GLOBAL_STYLES } from '../../config/constants';

export default class Button extends PureComponent {
  onPress = () => {
    if (this.props.page) {
      this.props.onPress(this.props.page);
    } else {
      this.props.onPress();
    }
  };

  render() {
    const { color, title, style, disabled } = this.props;
    const buttonStyles = style ? [styles.button, styles.button1] : [styles.button];
    const textStyles = style ? [styles.text, styles.text1] : [styles.text];
    if (color) {
      if (Platform.OS === 'ios') {
        textStyles.push({ color: GLOBAL_STYLES.BRAND_COLOR });
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }
    const formattedTitle = Platform.OS === 'android' ? title.toUpperCase() : title;
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

    return (
      <Touchable accessibilityComponentType="button" disabled={disabled} onPress={this.onPress}>
        <View style={buttonStyles}>
          <Text style={textStyles} disabled={disabled}>
            {formattedTitle}
          </Text>
        </View>
      </Touchable>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: ColorPropType,
  disabled: PropTypes.bool,
  page: PropTypes.string,
};

Button.defaultProps = {
  color: '#2196F3',
  disabled: false,
  page: null,
};
