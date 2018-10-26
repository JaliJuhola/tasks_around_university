import React from 'react';
import {
  ScrollView,
} from 'react-native';
import PushTheButtons from '../components/PushTheButtons';
export default class PushTheButtonsScreen extends React.Component {
  static navigationOptions = {
    title: 'Push The Buttons',
  };
  constructor(props) {
    super(props);
    this.state = {
      playerToClickMessage: "Player 3 should click the button!",
      joinGroupModalVisible: false
    };
  }

  render() {
    return (
      <ScrollView>
        <PushTheButtons></PushTheButtons>
      </ScrollView>
    );
  }
}
