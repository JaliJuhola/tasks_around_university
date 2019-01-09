import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Headline, TextInput, ProgressBar, Appbar} from 'react-native-paper';

import AliasScreenStyles from '../styles/AliasScreenStyles';
import {Http} from '../../core/connections/http';
import {getSocketConnection} from '../../common/minigame/Connection';
import { Actions } from 'react-native-router-flux';

export class AliasScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            words: '',
            textInput: '',
            currentWord: 'Peli alkaa hetken kuluttua!',
            correctWord: ' ',
            explainer: true,
            timeElapsed: 0,
            totalTimeElapsed: 0,
            score: 0,
            latestScore: 0,
            scoreTimer: '',
            wordTimeout: '',
            readyCheck: '',
            remainingTimeout: '',
            debug: '',
            groupId: 0,
            playerId: 0,
            playerName: 0,
            groupName: 0,
            isLeader: false,

        };
        this.pusher = getSocketConnection();
        this.activate_channels_alias = this.activate_channels_alias.bind(this);

    }
    async componentDidMount() {
        var self = this;
        Http.get('api/me').then(function (response) {
                self.setState(previousState => (
                    {groupId: response['data']['group']['id'], playerId: response['data']['player']['id'], playerName: response['data']['player']['name'], groupName: response['data']['group']['name'], isLeader: response['data']['player']['leader']}
            ));
        }).then(() => {
          this.activate_channels_alias();
          if(this.state.isLeader) {
            setTimeout(this.readyForNext, 5000);
          }
          setTimeout(this.endRound, 60000);
          this.interval = setInterval(() => {
            this.updateTotalTimer();
           }, 3000);

        });
    }

    activate_channels_alias = () => {
        var that = this;
        var channel = that.pusher.subscribe('alias-' + that.state.groupId);
        channel.bind('new-word', function(data) {
          if(!data['currentword']) {
              alert("Peli loppui pisteesi olivat " + that.state.score);
              return Actions.main_map()
          }
          that.setState(previousState => {
            return { currentWord: data['currentword'], score: data['current_score']};
          });
          if(that.state.playerId === data['target']) {
            that.setState(previousState => {
              return { correctWord: data['currentword'], explainer: true};
              });
          } else {
            that.setState(previousState => {
                return { correctWord: "Et ole selittäjä", explainer:false};
            });
          }
        });
        return channel;
      }


    endRound = () => {
        var self = this;
        Http.post('api/alias/end').then(function (response) {
            alert("Peli loppui sinulla on " + this.state.score + " pistettä");
        })
    }

    updateTotalTimer = () => {
        this.setState(prevState => ({
            totalTimeElapsed: prevState.totalTimeElapsed + 1
        }));
    }

    // This function updates score followingly: <=10s elapsed gives 500 points,
    // 30s elapsed (max time per word) gives 100 points, everything in between is linearly determined

    // This function checks if user's guess was right or wrong and updates things accordingly
    checkGuess = () => {
        var self = this;
        if (this.state.currentWord != "Peli loppui") {
            let guess = this.state.textInput.toLowerCase();
            if (guess === this.state.correctWord.toLowerCase()) {
                alert("Arvasit oikein!");
                Http.patch('api/alias/score',{}).then(function (response) {
                  self.setState({textInput: ""});
                });
            }
            else {
                alert("Arvasit väärin!");
            }
        }
    }
    readyForNext = () => {
        var self = this;
        Http.get('api/alias/score',{}).then(function (response) {
            self.setState({textInput: ""});
        });
    }
    render() {
        var buttonColor = '#4e008e';
        return (
            <View>
                <Appbar.Header>
                    <Appbar.BackAction
                    onPress={() => {
                        Http.post('api/alias/end',{
                        })
                    }}
                    >
                    </Appbar.BackAction>
                    <Appbar.Content
                    title={"Alias"}
                    />
                </Appbar.Header>

                <View style={AliasScreenStyles.container}>
                    <ProgressBar progress={(this.state.timeElapsed) / 20} style={AliasScreenStyles.progressBar} />
                    <Text style={AliasScreenStyles.text}>
                    Rymäsi pisteet: {this.state.score}
                    </Text>
                    <Text style={AliasScreenStyles.text}>
                    {this.state.explainer ? "Selitettävä sana on: " + this.state.currentWord : "Et ole selittäjä!"}
                    </Text>
                    <TextInput
                    disabled={this.state.explainer}
                    style={AliasScreenStyles.textInput}
                    placeholder='Kirjoita sana tänne'
                    value={this.state.textInput}
                    onChangeText={textInput => this.setState({ textInput })}
                    onSubmitEditing={() => this.checkGuess()}
                    />
                    <Button mode="contained" disabled={this.state.explainer} onPress={this.checkGuess} color={buttonColor} style={{marginTop: "10%",width: "60%", elevation: 1, opacity: 1}}>Arvaa
                    </Button>
                    <Button mode="contained" disabled={this.state.explainer} onPress={this.readyForNext} color={buttonColor} style={{width: "60%",marginTop: "10%", elevation: 1, opacity: 1}}>Seuraava sana
                    </Button>
                </View>
            </View>
        );
    }
}
