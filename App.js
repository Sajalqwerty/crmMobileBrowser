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
        this.navigate = 'Login';
        this.state = {
            open: false,
            connected : false,
            mysocket :"",
            response : {},

        };
        this.socket = new WebSocket('ws://180.179.210.49:6789/');

        this.socket.onopen = () => {
          console.log("Connected with socket :" + this.socket)
          this.setState({connected : true});
          this.setState({mysocket: this.socket});

        };


        this.socket.onmessage = (event) => {
          try {
            let response = JSON.parse(event.data);
            this.state.response = response;
            console.log(this.state.response);
          }
          catch(e){

          }
        }
        console.log('in message')
        console.log(this.state.response)
    }


    Senddata = (data) => {
      if (this.state.connected == true){
        console.log('here')
      this.socket.send(JSON.stringify(data));

      }

    }

    navigation = (data) => {
      this.navigate = data;
      console.log('navigation page is :'+this.navigate);
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
    switch(this.navigate){
      case 'Dashboard' :
      return (
            <Dashboard Senddata={this.Senddata} response={this.state} navigation={this.navigation}/>
            // <AppNavigator onWebsocketCall = {this.socket}/>
          );
      break;
      case 'Login' :
      return (
            <Login Senddata={this.Senddata} response={this.state}/>
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

