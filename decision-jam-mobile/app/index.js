import React, { PureComponent } from 'react';
import { AppSwitchNavigator } from './config/routes';

export default class App extends PureComponent {
  componentDidCatch(error, info) {
    console.log('error: ', error);
    console.log('info: ', info);
  }

  render() {
    return <AppSwitchNavigator />;
  }
}
