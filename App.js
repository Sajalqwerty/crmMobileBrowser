import React, { Component , useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView,FlatList } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Dashboard from './screens/CategoriesScreen';
import Login from './screens/LoginScreen';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}


export default class App extends React.Component {

  constructor() {
        super();
        this.state = {
            datafor: "Login",
            open: false,
            connected : false,
            mysocket :"",
            response : {},
            agentdata : {},
            loggedin : false,
            agentstatus:"currentstatus",
            cdrtdata: "data",
            CallProgress: "data"
        };
        this.socket = new WebSocket('ws://180.179.210.49:6789/');

        this.socket.onopen = () => {
          console.log("Connected with socket :" + this.socket)
          this.setState({connected : true});
          this.setState({mysocket: this.socket});

        };

        this.socket.onclose = (event) => {
          this.setState({connected : false});
        }


        this.socket.onmessage = (event) => {
          try {
            let response = JSON.parse(event.data);
            this.setState({response: response});

            console.log('in message')
            console.log(this.state.response);
          
          if('data' in response && response.data == "LOGGED-OUT"){
            console.log('loggedout')
            this.setState({loggedin : false});
            }

          }
          catch(e){
            console.log('error found')
            this.setState({response: {}});
              console.log(e)
          }
        }
        
    }


    Senddata = (data) => {
      if (this.state.connected == true){
      this.socket.send(JSON.stringify(data));

      }
    }

    navigation = (data) => {
      this.setState({datafor : data});
    }

    setAgentData = (data) => {
      console.log(data);
      this.setState({agentdata : data});
      console.log('seiitng session data')
      console.log(this.state.agentdata);

    }

  //  const [fontLoading,setFontLoading] = useState(false);
  // if(!fontLoading) {
  //   return (<AppLoading startAsync={fetchFonts} onFinish={() => setFontLoading(true)} />); 
  // }
  //   // return (<View><Text>This is app</Text></View>);
  //   return (
  //         <AppNavigator />
  //       );

  render() {
    console.log('calling render');
    // console.log(this.state);
    
    switch(this.state.datafor){
      case 'Dashboard' :
      return (
            <Dashboard Senddata={this.Senddata} response={this.state} navigation={this.navigation} Connect={this.Connect}/>
            // <AppNavigator onWebsocketCall = {this.socket}/>
          );
      break;
      case 'Login' :
      return (
            <Login navigation={this.navigation} setAgentData = {this.setAgentData}/>
            // <AppNavigator onWebsocketCall = {this.socket}/>
          );
      break;
    }
  } 
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "40%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
});

