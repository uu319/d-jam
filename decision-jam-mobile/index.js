import { AppRegistry, YellowBox } from 'react-native';
import App from './app/index';

console.disableYellowBox = true;
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
AppRegistry.registerComponent('decisionJamMobile', () => App);
