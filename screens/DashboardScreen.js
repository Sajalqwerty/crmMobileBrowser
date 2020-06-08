import React,{useState} from 'react';
import { StyleSheet, Text, View, Alert,AsyncStorage,ScrollView,Button } from 'react-native';
import Colors from '../Constants/Colors';


const DashboardScreen = props => {

  const [SessionData, setSessionData] = useState([]);
    console.log('here')
  const getSessionData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if(userData){
      setSessionData(userData);
    }
    else{
      console.log('Session Time Out Please Retry App');
    }
    return userData;
  }
  getSessionData();

  const Logout = () => {
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('LoginScreen');
  }
  

  let websocket = new WebSocket("ws://180.179.210.49:6789/");
  let mySession = {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
  let data = { action: 'LOGIN', AnAgent: mySession };
  let currentStatus = 'AVAILABLE';
  try{
    websocket.send(JSON.stringify(data))
  }
  catch(e){
    websocket.onopen = () => websocket.send(JSON.stringify(data));
  }

  // let mySessiondata =  {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] }
  // let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySessiondata };
  // websocket.send(JSON.stringify(res));

  websocket.onmessage = function (event) {
    try
    {
      let response = JSON.parse(event.data);
      if('ReqAction' in response && response.ReqAction == "CALL_OFFER")
      {
        props.navigation.navigate('CallPopupScreen');
      }
      else if('ProgressAction' in response && response.ProgressAction == 'AVAILABLE')
      {
        let mySession =  {"EntId": 1, "SubEntId":0, "SocketId": "", "AgentId": 1, "AgentExtension" :  "8077140282","Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] }

        let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySession };

         websocket.send(JSON.stringify(res));
      }
      if(response.Status == "AVAILABLE" && typeof response.SessionDetails === 'object')
      {
        console.log('agent session data')
        // $('#LeadGenrationFormDiv').addClass('hidden');
        // $('#AddProgressFormDiv').addClass('hidden');
        // $('#TotalCalls').html(response.SessionDetails.TotalCalls);
        // $('#TotalAccepted').html(response.SessionDetails.Accepted);
        // $('#TotalRejected').html(response.SessionDetails.Rejected);
        // var parts = response.logintime.split(/[- :]/);
        // var date = `${parts[2]}/${parts[1]}/${parts[0]}`;
        // var time = `${parts[3]}:${parts[4]}`
        // $('#LoginDate').html(date);
        // $('#LoginTime').html(time);
        // $('#Avtt').html(response.SessionDetails.AvTT);
        // $('#Maxtt').html(response.SessionDetails.MaxTT);
        // $('#Timer').html('');
        // clearInterval(refreshIntervalId);
        // totalSeconds = 0;
      }

    } 
    catch(e){
      console.log(e)
      Alert.alert(e)
    }
  }


return (
  <ScrollView style = {styles.fullscreen}>
  <View style={styles.screen}>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext} style={styles.itemstext}>Total Calls</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>0</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Accepted</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>0</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Rejected</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>0</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Login Date</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>00/00/0000</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Login Time</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>00:00</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Avtt</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>0</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Maxtt</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>0</Text>
      </View>
    </View>
      
    <View style={styles.buttonView} >
      <View style={styles.callingbuttons} >
      <Button title="Break" color={Colors.DANGER_COLOR}/>
      </View>
      <View style={styles.callingbuttons}>
      <Button title="Logout" color={Colors.DANGER_COLOR} onPress={Logout}/>
      </View>
    </View>
  
    </View>
    </ScrollView>

    // <View style = {styles.screen}><Text style={styles.itemstext}>This is DashboardScreen</Text></View>
);

};

const styles = StyleSheet.create({

    fullscreen: {
        backgroundColor : Colors.DARK_COLOR,
    },
    screen: {
        backgroundColor : Colors.DARK_COLOR,
        marginTop : "5%",
    },
    parenttile :{
        flexDirection : 'row'
    },
    tile : {
        backgroundColor : Colors.DANGER_COLOR,
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent : 'center',
        height : 60,
        flex : 1,
    },
    itemstext :{
        color : '#fff',
        fontSize : 20,
    },
    buttonView: {
        flexDirection : "row",
        marginTop: 20,
    },
    callingbuttons :{
        width : "50%",
        justifyContent : 'space-between',
        marginRight : 5,
        alignSelf: 'stretch'
    },

});


export default DashboardScreen;




