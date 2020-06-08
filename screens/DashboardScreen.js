import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Alert,AsyncStorage,ScrollView,Button } from 'react-native';
import Colors from '../Constants/Colors';

const DashboardScreen = props => {

  const [SessionData, setSessionData] = useState([]);
  const [showBreakButton, setShowBreakButton] = useState(true);

  const getSessionData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if(userData){
      setSessionData(JSON.parse(userData));
    }
    else{
      console.log('Session Time Out Please Retry App');
    }
    return userData;
  }
  getSessionData();

  const [websocket, setWebsocket] = useState({});

  const checkSocketConnection = async() => {
    let socketdata = await AsyncStorage.getItem('websocket');

    if(!socketdata)
    {
      setWebsocket(new WebSocket("ws://180.179.210.49:6789/"));
      console.log(websocket);
      if(Object.keys(websocket).length === 0 && websocket.constructor === Object){
        Alert.alert('Error','Voice Socket Not Connected');
        return false;
      }

      // let mySession = {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
      // let data = { action: 'LOGIN', AnAgent: mySession };
      // let currentStatus = 'AVAILABLE';

      // try{
      //   websocket.send(JSON.stringify(data))
      // }
      // catch(e){
      //   websocket.onopen = () => websocket.send(JSON.stringify(data));
      // }

      // AsyncStorage.setItem('websocket',websocket);
    }
  }
  useEffect(() =>{
    checkSocketConnection();
  })
  console.log('here')
      console.log(websocket);

  //  websocket = new WebSocket("ws://180.179.210.49:6789/");
  //  console.log('here');
  //  let mySession = {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
  //  let data = { action: 'LOGIN', AnAgent: mySession };
  //  let currentStatus = 'AVAILABLE';

  //  try{
  //    websocket.send(JSON.stringify(data))
  //  }
  //  catch(e){
  //    websocket.onopen = () => websocket.send(JSON.stringify(data));
  //  }

//   const Logout = (SessionData) => {
//     let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "LOGUT", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] } ;
//     let data = { action: 'LOGOUT', AnAgent: mySession };
//     let currentStatus = 'LOGOUT';
//     websocket.send(JSON.stringify(data));
//     AsyncStorage.removeItem('userData');
//     props.navigation.navigate('LoginScreen');
//   }

//   const Break = (SessionData) => {
//     let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
//     let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'BREAK' };
//     let currentStatus = 'BREAK';
//     websocket.send(JSON.stringify(data));
//   }

// if(Object.keys(websocket).length > 0 && websocket.constructor === Object){
//   let mySessiondata =  {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] }
//   let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySessiondata };
//   websocket.send(JSON.stringify(res));
// }

//    websocket.onmessage = function (event) {
//     try
//     {
//       let response = JSON.parse(event.data);
//       console.log('in on message')
//       console.log(response);
//       if('ReqAction' in response && response.ReqAction == "CALL_OFFER")
//       {
//         props.navigation.navigate('CallPopupScreen');
//       }
//       else if('ProgressAction' in response && response.ProgressAction == 'AVAILABLE')
//       {
//         let mySession =  {"EntId": 1, "SubEntId":0, "SocketId": "", "AgentId": 1, "AgentExtension" :  "8077140282","Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] }

//         let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySession };

//          websocket.send(JSON.stringify(res));
//       }
//       if(response.Status == "AVAILABLE" && typeof response.SessionDetails === 'object')
//       {
//         console.log('agent session data');
//       }

//     } 
//     catch(e){
//       console.log(e.message)
//     }
//   }


return (
  <ScrollView>
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
       <Button title="Break" color={Colors.DANGER_COLOR} onPress={() => Break(SessionData)}/>
      </View>
      <View style={styles.callingbuttons}>
      <Button title="Logout" color={Colors.DANGER_COLOR} onPress={() => Logout(SessionData)}/>
      </View>
    </View>
  
    </View>
    </ScrollView>

    // <View style = {styles.screen}><Text style={styles.itemstext}>This is DashboardScreen</Text></View>
);

};

const styles = StyleSheet.create({

    
    screen: {
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




