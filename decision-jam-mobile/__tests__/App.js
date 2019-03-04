import 'react-native';
import React from 'react';
import App from '../app/index';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'; // eslint-disable-line

it('renders correctly', () => {
  const tree = renderer.create(<App />); // eslint-disable-line
});
