import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Alert,AsyncStorage,ScrollView,Button,Image,TextInput } from 'react-native';
import Colors from '../Constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import DropDownPicker from 'react-native-dropdown-picker';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = props => {
  console.log('these are props');
  console.log(props.senddata);
  console.log('end of props');

  const [SessionData, setSessionData] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [campaign, setCampaign] = useState('');
  const [fetchCampaign, setFetchCampaign] = useState([{label: '-- Select Campaign --', value: ''}]);
  const [fetchStatus, setFetchStatus] = useState([{label: '-- Select Status --', value: ''}]);
  const [showBreakButton, setShowBreakButton] = useState(true);
  const [socketState,setSocketState] = useState(1);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [remarks, setRemarks] = useState('');
  const [leadId, setLeadId] = useState('');
  
  const [uuid,setuuid ] = useState('');
  const [callerNum,setCallerNum ] = useState('');
  const [campaignId,setCampaignId ] = useState('');
  const [actionTime,setActionTime ] = useState('');
  const [callingState,setCallingState ] = useState(0);

  const [totalCalls, setTotalCalls] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [avtt, setAvtt] = useState(0);
  const [maxtt, setMaxtt] = useState(0);
  const [loginDate, setLoginDate] = useState('00/00/0000');
  const [loginTime, setLoginTime] = useState('00:00');

  const campaignName = '';
  const StatusName = '';

  const [campaignVal,setCampaignVal] = useState('');
  const [statusVal,setStatusVal] = useState('');

  
  const getLeadByNumber = (MobileNum,CampaignSelected) => {
    console.log('in getLeadByNumber');
    fetch('http://devcc.digialaya.com/WebServices/getLeadbyNumberApi', {
        body: JSON.stringify({
            'CustomerExt' : MobileNum,
            'CampaignId' : CampaignSelected,
        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
          console.log(jsonObject);
            if(jsonObject['status'] == 'success'){
                setSocketState(4);
                changeStatus({'StatusName' : jsonObject['data'].CustomerLead_Status});
                setLeadId(jsonObject['data'].CustomerLead_Id);
                setFname(jsonObject['data'].CustomerLead_FirstName);
                setLname(jsonObject['data'].CustomerLead_LastName);
                setEmail(jsonObject['data'].CustomerLead_UserEmail);
            }
            else{
                setSocketState(3);
            }
        });
  }

const changeCampaign = (campaign) => {
 setCampaignVal(campaign.campaignName);
}

const changeStatus = (status) =>{
 setStatusVal(status.StatusName);
}

const CallAccepted = () => {
    let mySession = {"EntId":SessionData.EnterpriseId,"SubEntId":SessionData.SubEnterpriseId,"CampaignId":campaignId,"CallerNum":callerNum,"AgentSocketId":"", "VoiceSocketId":"","reqid": uuid, "AgentId": SessionData.UserId, "ReqAction" :"CALL_ACCEPTED", "AgentExtension":SessionData.Mobile, "ActionTime" :actionTime,"Status":"CALL_ACCEPTED", "AgentType":"normal", "SessionDetails" : "", "CampaignsIdLinked" : campaignList};
    let data = { action: 'CALL_ACCEPTED', FreeAgentReq: mySession, newstatus: 'CALL_ACCEPTED'};
    let currentStatus = data.newstatus;
    websocket.send(JSON.stringify(data));
}

const CallRejected = () => {
  let mySession = {"EntId":SessionData.EnterpriseId,"SubEntId":SessionData.SubEnterpriseId,"CampaignId":campaignId,"CallerNum":callerNum,"AgentSocketId":"", "VoiceSocketId":"","reqid": uuid, "AgentId": SessionData.UserId, "ReqAction" :"CALL_REJECTED", "AgentExtension":SessionData.Mobile, "ActionTime" :actionTime,"Status":"CALL_REJECTED", "AgentType":"normal", "SessionDetails" : "", "CampaignsIdLinked" : campaignList};
  let data = { action: 'CALL_REJECTED', FreeAgentReq: mySession, newstatus: 'CALL_REJECTED'};
  let currentStatus = data.newstatus;
  websocket.send(JSON.stringify(data));
}

const CallDiscopnnect = () => {
  let mySession = { "reqid": uuid, "AgentId":SessionData.UserId, "AgentExtension":SessionData.Mobile, "CallerNum":"", "CampaignId":campaignId,"ProgressAction": "CALL_DISCONNECT", "ActionTime":actionTime};
  let data = { action: 'CALL_DISCONNECT', 'CallProgress': mySession };
  let currentStatus = 'CALL_DISCONNECT';
  websocket.send(JSON.stringify(data));
}

const CallRelease = () => {
  let mySession = { "reqid": uuid, "AgentId":SessionData.UserId, "AgentExtension":SessionData.UserId, "CallerNum":callerNum, "CampaignId":campaignId,"ProgressAction": "CALL_RELEASED", "ActionTime":actionTime};
  let res = {'action':'CALL_RELEASED', 'CallProgress': mySession };
  let currentStatus = "AVAILABLE";

  websocket.send(JSON.stringify(res));
}

  const addLead = () =>{
  fetch('http://devcc.digialaya.com/WebServices/addLeadsApi', {
        body: JSON.stringify({
            'Lead_LeadStatus' : statusVal,
            'Lead_Campaign' : campaignVal,
            'Lead_Description' : description,
            'UserFirst_Name' : fname,
            'UserLast_Name' : lname,
            'User_Email' : email,
            'User_Mobile' : mobile,
            'AgentName' : SessionData.UserName,
            'EnterpriseId' : SessionData.EnterpriseId,
            'SubEnterpriseId' : SessionData.SubEnterpriseId,

        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
            if(jsonObject['status'] == 'success'){
               Alert.alert('Success','Lead Added Successfully');
              setSocketState(2);
            }
            else if(jsonObject['status'] == 'alreadyassign'){
              Alert.alert('Error','Record already exist');
              return false;
            }
            else{
             Alert.alert('Error','Validation Error please fill all details');
              return false; 
            }
        });
    }

    const addProgress = () => {
      
      fetch('http://devcc.digialaya.com/WebServices/addLeadProgressApi', {
        body: JSON.stringify({
            'Lead_LeadStatus' : statusVal,
            'Lead_Id' : leadId,
            'Remarks' : remarks,
            'AgentName' : SessionData.UserName,
            'Role' : SessionData.Role,
            'EnterpriseId' : SessionData.EnterpriseId,
            'SubEnterpriseId' : SessionData.SubEnterpriseId,
        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json(); 
        })
        .then((jsonObject) => {
            if(jsonObject['status'] == 'success'){
                setSocketState(2);
            }
            else{
              Alert.alert('Error','Please check your form again');
              return false;
            }
        }); 
    }


  const getSessionData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if(userData){
      let data = JSON.parse(userData);

      setSessionData(data);
      fetch('http://devcc.digialaya.com/WebServices/getCampaignApi/'+data.UserId+'/'+data.EnterpriseId+'/'+data.SubEnterpriseId, {
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
          console.log(jsonObject);
            let camparr = [];
            let campoption = [{label: '-- Select Campaign --', value: ''}];
            let statusoption = [{label: '-- Select Status --', value: ''}];
            if(jsonObject['status'] == 'success'){

              let Campaign = jsonObject['data']['Campaign'];
              let LeadStatus = jsonObject['data']['LeadStatus'];

              if(Campaign.length > 0){
                for(var i=0; i < Campaign.length; i++){
                  camparr.push(Campaign[i].Campaign_Id);
                  campoption.push({'label' : Campaign[i].Campaign_Name, 'value' : Campaign[i].Campaign_Id})
                }
                setFetchCampaign(campoption);
                setCampaignList(camparr);
                console.log(fetchCampaign);
              }

              if(LeadStatus.length > 0){
                for(var i=0; i < LeadStatus.length; i++){
                  statusoption.push({'label' : LeadStatus[i].LeadStatus_Name, 'value' : LeadStatus[i].LeadStatus_Name})
                }
                setFetchStatus(statusoption);
              }

            }
            else{
              console.log('validation error');
            }
        });
    }
    else{
      console.log('Session Time Out Please Retry App');
    }
    return userData;
  }

  const [websocket, setWebsocket] = useState({});

  
    useEffect(() =>{
      getSessionData();
      if(!SessionData && SessionData.length === 0){
        Alert.alert('Connection Close Please Try Again Later');
        return false;
      }
      console.log(SessionData);
      var W3CWebSocket = require('websocket').w3cwebsocket;
      let socketconnect = new W3CWebSocket("ws://180.179.210.49:6789/", 'echo-protocol');
      console.log(socketconnect)
      setWebsocket(socketconnect);

      let mySession = {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList };
      let data = { action: 'LOGIN', AnAgent: mySession };
      let currentStatus = 'AVAILABLE';

      try{
        console.log('connect');
        console.log(websocket)
        websocket.send(JSON.stringify(data))
      }
      catch(e){
        console.log('tryagainconnect');
        websocket.onopen = () => websocket.send(JSON.stringify(data));
      }
    },[]) 
    
  const Logout = (SessionData,websocket) => {
    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "LOGUT", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList } ;
    let data = { action: 'LOGOUT', AnAgent: mySession };
    let currentStatus = 'LOGOUT';
    websocket.send(JSON.stringify(data));
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('LoginScreen');
  }

  const Break = (SessionData,websocket) => {
    console.log(websocket)
    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'BREAK' };
    let currentStatus = 'BREAK';
    console.log(data);
    props.SendData(data);
    // websocket.send(JSON.stringify(data));
  }

  const UnBreak = (SessionData,websocket) => {
    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'AVAILABLE' };
    let currentStatus = 'AVAILABLE';
    websocket.send(JSON.stringify(data));
  }

  DashboardScreen.navigationOptions = (navData) => {    
    return {
        title: 'Dashboard',
        headerLeft: () => '',
       headerRight: () =>
                <Ionicons name='ios-power' size={25} style={styles.headericon} onPress={() => Logout(SessionData,websocket)}/>
             }
  }

  

if(Object.keys(websocket).length > 0 && websocket.constructor === Object){
  let mySessiondata =  {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList }
  let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySessiondata };
  websocket.send(JSON.stringify(res));
}


  useEffect(() => {
    if(websocket.readyState == 3){
          Alert.alert('Error','Voice server not connected');
    }
  },[])

  websocket.onmessage = function (event) {
    console.log('connected to socket')
    try
    {
      let response = JSON.parse(event.data);
      console.log('in on message')
      console.log(response);
      if('ReqAction' in response && response.ReqAction == "CALL_OFFER")
      {
        setSocketState(2);
        setuuid(response.reqid);
        setCallerNum(response.CallerNum);
        setCampaignId(response.CampaignId);
        setActionTime(response.ActionTime);
        getLeadByNumber(response.CallerNum,response.CampaignId);
      }
      if("action" in response &&  response.action == "CALL_HANGUP")
      {
        console.log('call Hang Up');
      }
      else if('ProgressAction' in response && response.ProgressAction == "ON-CALL")
      {
        setCallingState(1);
      }
      else if('data' in response && response.data == 'AVAILABLE')
      {
        let mySessiondata =  {"EntId": SessionData.EnterpriseId, "SubEntId":SessionData.SubEnterpriseId, "SocketId": "", "AgentId": SessionData.UserId, "AgentExtension" :  SessionData.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList }
        let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySessiondata };
        websocket.send(JSON.stringify(res));
      }
      if(response.Status == "AVAILABLE" && typeof response.SessionDetails === 'object')
      {
        setTotalCalls(response.SessionDetails.TotalCalls);
        setAccepted(response.SessionDetails.Accepted);
        setRejected(response.SessionDetails.Rejected);
        let parts = response.logintime.split(/[- :]/);
        let date = `${parts[2]}/${parts[1]}/${parts[0]}`;
        let time = `${parts[3]}:${parts[4]}`
        setLoginDate(date);
        setLoginTime(time);
        setAvtt(response.SessionDetails.AvTT);
        setMaxtt(response.SessionDetails.MaxTT);
        $('#Timer').html('');
        clearInterval(refreshIntervalId);
        totalSeconds = 0;
      }


    } 
    catch(e){
      console.log(e.message)
    }
  }

console.log(socketState);
switch(socketState){

  case 1:
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
        (<Button title="Break" color={Colors.DANGER_COLOR} onPress={() => Break(SessionData,websocket)}/>):
        (<Button title="Unbreak" color={Colors.DANGER_COLOR} onPress={() => UnBreak(SessionData,websocket)}/>)}
      </View>
      <View style={styles.callingbuttons}>
      <Button title="Logout" color={Colors.DANGER_COLOR} onPress={() => Logout(SessionData,websocket)}/>
      </View>
    </View>
  
    </View>
    </ScrollView>
    )
  break;
  case 2:
    return (
      <View style = {styles.screen}>
    <View style={styles.callDetails}>
    <Text style={styles.callDetailText}>+91 8077140282</Text>
    <Text style={styles.callDetailText}>00:00</Text>
    </View>
    <Image style={styles.logoImage} source={{ uri: 'http://devcc.digialaya.com/common/profilePic/callingperson.png' }}/>
    
    {callingState == 0 && (<View style={styles.buttonView} >
    <View style={styles.callingbuttons} >
    <Button title="Accept" color={Colors.SUCCESS_COLOR} onPress={CallAccepted}/>
    </View>
    <View style={styles.callingbuttons}>
    <Button title="Reject" color={Colors.DANGER_COLOR} onPress={CallRejected}/>
    </View>
    </View> ) }

    { callingState == 1 &&
      (<View style={styles.Dissconnect} >
    <Button title="Dissconnect" color={Colors.DANGER_COLOR} onPress={CallDiscopnnect}/>
    </View>) }
    
    { callingState == 2 &&

    (<View style={styles.Dissconnect} >
    <Button title="Release" color={Colors.DANGER_COLOR} onPress={CallRelease}/>
    </View>)
    }

 
    
    </View>
    )
  break;
  case 3:
  return (
  <ScrollView style = {styles.screen}>
        <View >
        <DropDownPicker
         items={fetchCampaign}
        defaultValue={campaignName}
        containerStyle={{height: 70}}
        style={styles.select}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => changeCampaign({
        campaignName: item.value
        })}
        />

        </View>

        <View >
        <DropDownPicker
         items={fetchStatus}
        defaultValue={StatusName}
        containerStyle={{height: 70}}
        style={styles.select}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => changeStatus({
        StatusName: item.value
        })}
        />

        </View>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="First Name"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={fname}
          onChangeText={text => setFname(text)}
          />
        </View>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Last Name"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={lname}
          onChangeText={text => setLname(text)}
          />
        </View>
        
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Email Id"
          keyboardType='email-address'
          autoCorrect
          required
          style={styles.textInput}
          value={email}
          onChangeText={text => setEmail(text)}
          />
        </View>
        
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Description"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={description}
          onChangeText={text => setDescription(text)}
          />
        </View>
        
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Mobile Number"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={mobile}
          onChangeText={text => setMobile(text)}
          />
        </View>
        
        <View style={styles.addBtn}>
        <Button title="Add Lead" color={Colors.PRIMARY_COLOR} onPress ={addLead}/>
        </View>
    </ScrollView>
  )
  break;
  case 4:
  return(
  <ScrollView style = {styles.screen}>
    <View style={styles.textInputView}>
        <TextInput 
          placeholder="First Name"
          keyboardType='default'
          autoCorrect
          required
          editable = {false}
          style={styles.textInput}
          value={fname}
          onChangeText={text => setFname(text)}
          />
        </View>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Last Name"
          keyboardType='default'
          autoCorrect
          required
          editable = {false}
          style={styles.textInput}
          value={lname}
          onChangeText={text => setLname(text)}
          />
        </View>

        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Email"
          keyboardType='default'
          autoCorrect
          required
          editable = {false}
          style={styles.textInput}
          value={email}
          onChangeText={text => setEmail(text)}
          />
        </View>


        <View >
        <DropDownPicker
         items={fetchStatus}
        defaultValue={StatusName}
        containerStyle={{height: 70}}
        style={styles.select}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => changeStatus({
        StatusName: item.value
        })}
        />

        </View>

        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Remarks"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={remarks}
          onChangeText={text => setRemarks(text)}
          />
        </View>

        
        <View style={styles.addBtn}>
        <Button title="Add Progress" color={Colors.PRIMARY_COLOR} onPress ={addProgress}/>
        </View>
        
    </ScrollView>
  )
  break;
}

};





const styles = StyleSheet.create({

    
    screen: {
        marginTop : "5%",
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
    logoImage: {
        height: 300,
        width: 300,
        borderRadius: 100
    },
    callDetails:{
        alignItems: 'center',
        marginVertical: 10,
    },
    callDetailText:{
        fontSize: 20,
        fontWeight: '100',
        fontFamily: 'open-sans-bold',
    },
    textInput: {
        width: '90%'
    },
    addBtn: {       
        margin: 20,
        width : '90%',
        alignItems: 'center'
    },
    textInputView: {
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        width: '95%',
        marginVertical: 12,
        borderRadius: 10
    },
    select : {
      width : "95%",
      backgroundColor : 'transparent',
      marginVertical : 12,
    },
    Dissconnect:{
      marginVertical : 20,

    },
    headericon:{
      marginRight : 50,
    }

});


export default DashboardScreen;




