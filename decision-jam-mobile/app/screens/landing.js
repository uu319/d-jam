import React from 'react';
import { StyleSheet, View, Dimensions, Text, Linking, StatusBar } from 'react-native';
import firebase from 'react-native-firebase';
import Hyperlink from 'react-native-hyperlink';
import { GLOBAL_STYLES } from '../config/constants';
import Button from '../components/button';
import BrandedText, { TYPE_LABEL } from '../components/brandedText';

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
    };
    this.authSubscription = null;
  }

  componentDidMount() {
    this.anonymousSignup();
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      this.setState({
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  onPress = page => {
    const { navigate } = this.props.navigation;

    navigate(page, {
      userId: this.state.user,
    });
  };

  anonymousSignup = () => {
    this.setState({
      loading: true,
    });

    firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        this.setState({ user: user.uid });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage) {
          console.log(errorCode, errorMessage);
        }
      });
  };

  buttons = [
    {
      index: 0,
      page: 'Join',
      label: 'Join Room',
      style: null,
      color: GLOBAL_STYLES.BRAND_COLOR,
    },
    {
      index: 1,
      page: 'Create',
      label: 'Start a Decision Jam',
      style: 1,
      color: 'white',
    },
  ];

  render() {
    if (this.state.loading) return null; // create loader component

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.header}>
          <BrandedText style={styles.title} content="Decision Jam" type={TYPE_LABEL} />
        </View>
        <View style={styles.subcontain}>
          <Text style={styles.sub}>
            Post, Vote, Reveal: {'\n'}Crowdsource ideas and make better decisions quickly with your
            team
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          {this.buttons.map(button => (
            <View key={button.index} style={styles.button}>
              <Button
                onPress={this.onPress}
                title={button.label}
                page={button.page}
                style={button.style}
                color={button.color}
              />
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          {/* <BrandedText
            style={styles.feedback}
            content="© 2018 Decision Jam | Made with 💖 by"
            type={TYPE_LABEL}
          /> */}
          <Hyperlink
            linkStyle={styles.link}
            linkText={url => (url === 'https://www.symph.co/' ? 'Symph' : url)}
            onPress={() => Linking.openURL('https://www.symph.co/')}
          >
            <Text style={styles.feedback}>
              © 2018 Decision Jam | Made with 💖 by https://www.symph.co/
            </Text>
          </Hyperlink>
          <BrandedText style={styles.feedback} content="We love your feedback." type={TYPE_LABEL} />
          <Hyperlink onPress={() => Linking.openURL('mailto:decisionjam@symph.co')}>
            <Text style={styles.link}>Send to decisionjam@symph.co</Text>
          </Hyperlink>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  title: {
    fontSize: 50,
  },
  sub: {
    textAlign: 'center',
    fontSize: 20,
  },
  subcontain: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
  header: {
    marginTop: 50,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width * 0.8,
    margin: 100,
  },
  button: {
    margin: 20,
  },
  feedback: {
    textAlign: 'center',
    color: '#1C1E3F',
  },
  link: {
    color: '#fc3f73',
  },
});
