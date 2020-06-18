import React, { Component , useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView,FlatList } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Dashboard from './screens/DashboardScreen';
import Login from './screens/LoginScreen';
import CallPopup from './screens/CallPopupScreen';
import Progress from './screens/ProgressFormScreen';
import LeadScreen from './screens/LeadFormScreen';
import VoiceError from './screens/VoiceErrorScreen';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}


export default class App extends React.Component {

  constructor() {
        super();
        
        this.main();
    }

    main = () =>{
      this.state = {
            datafor: "Login",
            open: false,
            connected : false,
            mysocket :"",
            response : {},
            agentdata : {},
            leaddata : {},
            CampaignList : [],
            loggedin : false,
            leadadded : false,
            agentstatus:"currentstatus",
            cdrtdata: "data",
            CallProgress: {}
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
          console.log('getting response from websocket in on message');
        try {
            let response = JSON.parse(event.data);
            this.setState({response: response});

            console.log('in message')
            console.log(this.state.response);

           if(this.state.loggedin == false && ('data' in response && response.data != 'AVAILABLE')){
                this.setState({loggedin : true});
            }
            if('data' in response && response.data == "LOGGED-OUT"){
              console.log('loggedout')
              this.setState({loggedin : false});
              this.socket.close();
            }
            if('ReqAction' in response && response.ReqAction == "CALL_OFFER")
            {
              this.setState({CallProgress : response})
              this.setState({datafor : 'CallPopup'});
            }
            if("action" in response &&  response.action == "CALL_HANGUP")
            {
              let mySession = { "reqid": this.state.CallProgress.reqid, "AgentId":AgentSession.UserId, "AgentExtension":AgentSession.Mobile, "CallerNum":this.state.CallProgress.CallerNum, "CampaignId":this.state.CallProgress.CampaignId,"ProgressAction": "CALL_DISCONNECT", "ActionTime": this.state.CallProgress.ActionTime};
              let data = { action: 'CALL_DISCONNECT', 'CallProgress': mySession };
              this.Senddata(data);  

              setTimeOut(function(){
                let mySession = { "reqid": this.state.CallProgress.reqid, "AgentId":AgentSession.UserId, "AgentExtension":AgentSession.UserId, "CallerNum":this.state.CallProgress.CallerNum, "CampaignId":this.state.CallProgress.CampaignId,"ProgressAction": "CALL_RELEASED", "ActionTime": this.state.CallProgress.ActionTime};
                let res = {'action':'CALL_RELEASED', 'CallProgress': mySession };
                this.Senddata(res);
                this.navigation('Dashboard');
              },1000)

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

    setCampaign = (data) =>{
      this.setState({CampaignList : data});
    }

    setLeadAdded = (data) => {
      this.setState({leadadded : data});
    }

    setLeadData = (data) =>{
      this.setState({leaddata : data});

    }

    Reconnect = () =>{
      console.log('in Reconnect')
      // this.socket = new WebSocket('ws://180.179.210.49:6789/');
      this.main();
      this.navigation('Login');
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

        if(this.socket.readyState == 3){
          try{
              this.navigation('VoiceError');
          }
          catch(e){
            console.log(e)
            console.log('Voice Not Connected');
          }  
        }
    
    <AppLoading startAsync={fetchFonts} />

    switch(this.state.datafor){
      case 'Dashboard' :
      return (
            <Dashboard Senddata={this.Senddata} response={this.state} navigation={this.navigation} Connect={this.Connect} setCampaign={this.setCampaign} setLeadAdded={this.setLeadAdded}/>
            // <AppNavigator onWebsocketCall = {this.socket}/>
          );
      break;
      case 'Login' :
      return (
            <Login navigation={this.navigation} setAgentData = {this.setAgentData}/>
          );
      break;
      case 'CallPopup' :
      return (
            <CallPopup navigation={this.navigation} response={this.state} Senddata={this.Senddata} setLeadData={this.setLeadData}/>
          );
      break;
      case 'LeadScreen' :
      return (
            <LeadScreen navigation={this.navigation} response={this.state} Senddata={this.Senddata} setLeadAdded={this.setLeadAdded}/>
          );
      break;
      case 'ProgressScreen' :
      return (
            <Progress navigation={this.navigation} response={this.state} Senddata={this.Senddata} setLeadAdded={this.setLeadAdded}/>
          );
      break;
      case 'VoiceError':
      return (
            <VoiceError navigation={this.navigation} Reconnect={this.Reconnect}/>
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

