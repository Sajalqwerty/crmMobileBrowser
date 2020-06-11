import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Alert,AsyncStorage,ScrollView,Button,Image,TextInput } from 'react-native';
import Colors from '../Constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';


const changeCampaign = (campaign) => {
 console.log(campaign);
}

const changeStatus = (status) =>{
 console.log(status);
}


const DashboardScreen = props => {

  const [SessionData, setSessionData] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [campaign, setCampaign] = useState('');
  const [fetchCampaign, setFetchCampaign] = useState([{label: '-- Select Campaign --', value: ''}]);
  const [status, setStatus] = useState('');
  const [fetchStatus, setFetchStatus] = useState([{label: '-- Select Status --', value: ''}]);
  const [showBreakButton, setShowBreakButton] = useState(true);
  const [socketState,setSocketState] = useState(1);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState('');
  const [remarks, setRemarks] = useState('');

  const campaignName = '';
  const StatusName = '';

  const addLead = () =>{
  fetch('http://devcc.digialaya.com/WebServices/addLeadsApi', {
        body: JSON.stringify({
            'Lead_LeadStatus' : StatusName,
            'Lead_Campaign' : campaignName,
            'Lead_Description' : description,
            'UserFirst_Name' : fname,
            'UserLast_Name' : lname,
            'User_Email' : email,
            'User_Mobile' : mobile,
        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
            if(jsonObject['status'] == 'success'){
                
            }
            else{
              console.log('validation error');
            }
        });
    }

    const addProgress = () => {
      fetch('http://devcc.digialaya.com/WebServices/addProgressApi', {
        body: JSON.stringify({
            'Lead_LeadStatus' : StatusName,
            'Lead_Campaign' : campaignName,
            'Lead_Description' : description,
            'UserFirst_Name' : fname,
            'UserLast_Name' : lname,
            'User_Email' : email,
            'User_Mobile' : mobile,
        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
            if(jsonObject['status'] == 'success'){
                
            }
            else{
              console.log('validation error');
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
                  statusoption.push({'label' : LeadStatus[i].LeadStatus_Name, 'value' : LeadStatus[i].LeadStatus_Id})
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
      let socketconnect = new WebSocket("ws://180.179.210.49:6789/");
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
    websocket.send(JSON.stringify(data));
  }

  const UnBreak = (SessionData,websocket) => {
    let mySession = { "SocketId": "", "AgentId": SessionData.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'AVAILABLE' };
    let currentStatus = 'AVAILABLE';
    websocket.send(JSON.stringify(data));
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
      }
      if("action" in response &&  response.action == "CALL_HANGUP")
      {
        console.log('call Hang Up');
      }
      else if('ProgressAction' in response && response.ProgressAction == "ON-CALL")
      {
        console.log('on call');
      }
      else if('ProgressAction' in response && response.ProgressAction == 'AVAILABLE')
      {
        let mySession =  {"EntId": 1, "SubEntId":0, "SocketId": "", "AgentId": 1, "AgentExtension" :  "8077140282","Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": campaignList }

        let res = {'action':'AGENTSESSIONDATA', 'AnAgent': mySession };

         websocket.send(JSON.stringify(res));
      }
      if(response.Status == "AVAILABLE" && typeof response.SessionDetails === 'object')
      {
        console.log('agent session data');
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
    <View style={styles.buttonView} >
    <View style={styles.callingbuttons} >
    <Button title="Accept" color={Colors.SUCCESS_COLOR}/>
    </View>
    <View style={styles.callingbuttons}>
    <Button title="Reject" color={Colors.DANGER_COLOR}/>
    </View>
    </View>
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
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Lead Status"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={status}
          onChangeText={text => setStatus(text)}
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
          placeholder="Email"
          keyboardType='default'
          autoCorrect
          required
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

        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Status"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={status}
          onChangeText={text => setStatus(text)}
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
    }

});


export default DashboardScreen;




