import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ScrollView,Button,AsyncStorage } from 'react-native';
import Colors from '../Constants/Colors';


const setSession = async(data) => {

    AsyncStorage.setItem('userData',JSON.stringify({
                 'UserId' : 22,
                 'UserName' : 'Agent 1 cc',
                 'Email' : 'Agent1cc@digialaya.com',
                 'Mobile' : '8077140282',
                 'EnterpriseId' : 23,
                 'SubEnterpriseId' : null,
                 'RoleId' : '5',
                 'Role' : 'Agent',
             }));
}


const CategoriesScreen = props => {

  const [totalCalls, setTotalCalls] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [avtt, setAvtt] = useState(0);
  const [maxtt, setMaxtt] = useState(0);
  const [loginDate, setLoginDate] = useState('00/00/0000');
  const [loginTime, setLoginTime] = useState('00:00');
  const [showBreakButton, setShowBreakButton] = useState(true);
  const [SessionData, setSessionData] = useState([]);
  
	console.log('This response is getting in dashboard');
	console.log(props.response);

  const getSessionData = async () => {

    setSession();
    

    const userData = await AsyncStorage.getItem('userData');
    console.log(userData)
    if(userData){
      let data = JSON.parse(userData);

      setSessionData(data);
      // fetch('http://devcc.digialaya.com/WebServices/getCampaignApi/'+data.UserId+'/'+data.EnterpriseId+'/'+data.SubEnterpriseId, {
      //   method: 'post',
      //   async : false,
      //   }).then((response) => {
      //   return response.json();
      //   })
      //   .then((jsonObject) => {
      //     console.log(jsonObject);
      //       let camparr = [];
      //       let campoption = [{label: '-- Select Campaign --', value: ''}];
      //       let statusoption = [{label: '-- Select Status --', value: ''}];
      //       if(jsonObject['status'] == 'success'){

      //         let Campaign = jsonObject['data']['Campaign'];
      //         let LeadStatus = jsonObject['data']['LeadStatus'];

      //         if(Campaign.length > 0){
      //           for(var i=0; i < Campaign.length; i++){
      //             camparr.push(Campaign[i].Campaign_Id);
      //             campoption.push({'label' : Campaign[i].Campaign_Name, 'value' : Campaign[i].Campaign_Id})
      //           }
      //           setFetchCampaign(campoption);
      //           setCampaignList(camparr);
      //           console.log(fetchCampaign);
      //         }

      //         if(LeadStatus.length > 0){
      //           for(var i=0; i < LeadStatus.length; i++){
      //             statusoption.push({'label' : LeadStatus[i].LeadStatus_Name, 'value' : LeadStatus[i].LeadStatus_Name})
      //           }
      //           setFetchStatus(statusoption);
      //         }

      //       }
      //       else{
      //         console.log('validation error');
      //       }
      //   });
    }
    else{
      console.log('Session Time Out Please Retry App');
    }
    return userData;
  }

  useEffect(() =>{
      getSessionData();
      if(!SessionData && SessionData.length === 0){
        Alert.alert('Connection Close Please Try Again Later');
        return false;
      }
      let mySession = {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
      let data = { action: 'LOGIN', AnAgent: mySession };
      let currentStatus = 'AVAILABLE';

      try{
        console.log('connect');
        props.Senddata(data);
      }
      catch(e){
        console.log('tryagainconnect');
        props.Senddata(data);
      }
    },[]) 
    

 const Logout = (SessionData) => {
    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "LOGUT", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] } ;
    let data = { action: 'LOGOUT', AnAgent: mySession };
    let currentStatus = 'LOGOUT';
    websocket.send(JSON.stringify(data));
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('LoginScreen');
  }

  const Break = (SessionData) => {

    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'BREAK' };
    let currentStatus = 'BREAK';
    console.log(data);
    props.Senddata(data);
    // websocket.send(JSON.stringify(data));
  }


return (
      <ScrollView>
      <View style={styles.screen}>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext} style={styles.itemstext}>Total Calls</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{totalCalls}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Accepted</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{accepted}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Rejected</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{rejected}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Login Date</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{loginDate}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Login Time</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{loginTime}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Avtt</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{avtt}</Text>
      </View>
    </View>
    <View style={styles.parenttile}>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>Maxtt</Text>
      </View>
      <View style={styles.tile}>
      <Text style={styles.itemstext}>{maxtt}</Text>
      </View>
    </View>
      
    <View style={styles.buttonView} >
      <View style={styles.callingbuttons} >
       {showBreakButton ? 
        (<Button title="Break" color={Colors.DANGER_COLOR} onPress={() => Break(SessionData)}/>):
        (<Button title="Unbreak" color={Colors.DANGER_COLOR} onPress={() => UnBreak(SessionData)}/>)}
      </View>
      <View style={styles.callingbuttons}>
      <Button title="Logout" color={Colors.DANGER_COLOR} onPress={() => Logout(SessionData)}/>
      </View>
    </View>
  
    </View>
    </ScrollView>
    );
// return (
//     <View style = {styles.screen}><Text>This is CategoriesScreen</Text></View>
// );

};

const styles = StyleSheet.create({
    screen: {
        marginTop : "15%",
        marginHorizontal : 10,
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


export default CategoriesScreen;




