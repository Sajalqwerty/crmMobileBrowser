import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,TextInput,Button,ScrollView,Alert } from 'react-native';
import Colors from '../Constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';


const LeadFormScreen = props => {

const [campaignList, setCampaignList] = useState([]);
const [fetchCampaign, setFetchCampaign] = useState([{label: '-- Select Campaign --', value: '0'}]);
const [fetchStatus, setFetchStatus] = useState([{label: '-- Select Status --', value: '0'}]);

const [fname, setFname] = useState('');
const [campaign, setCampaign] = useState('');
const [lname, setLname] = useState('');
const [email, setEmail] = useState('');
const [description, setDescription] = useState('');
const [mobile, setMobile] = useState('');
const [status, setStatus] = useState('');
const campaignName = '0';
const StatusName = '0';

const [campaignVal,setCampaignVal] = useState('');
const [statusVal,setStatusVal] = useState('');


const AgentSession = props.response.agentdata;

const changeCampaign = (campaign) => {
 setCampaignVal(campaign.campaignName);
 
}

const changeStatus = (status) =>{
 setStatusVal(status.StatusName);
}

const backtocall = () => {
  props.setLeadAdded(true);
  props.navigation('CallPopup');
}

useEffect(()=>{
 console.log('This is progress screen');
 const response = props.response.response;

  if('ProgressAction' in response && response.ProgressAction == "ON-CALL")
  {
    setMobile(response.AgentExtension);
  }

 fetch('http://contactcenter.digialaya.com/WebServices/getCampaignApi/'+AgentSession.UserId+'/'+AgentSession.EnterpriseId+'/'+AgentSession.SubEnterpriseId, {
  method: 'post',
  async : false,
  }).then((response) => {
  return response.json();
  })
  .then((jsonObject) => {
    console.log(jsonObject);
      let camparr = [];
      let campoption = [{label: '-- Select Campaign --', value: '0'}];
      let statusoption = [{label: '-- Select Status --', value: '0'}];
      if(jsonObject['status'] == 'success'){

        let Campaign = jsonObject['data']['Campaign'];
        let LeadStatus = jsonObject['data']['LeadStatus'];

        if(Campaign.length > 0){
          for(var i=0; i < Campaign.length; i++){
            campoption.push({'label' : Campaign[i].Campaign_Name, 'value' : Campaign[i].Campaign_Id})
          }
          setFetchCampaign(campoption);
          console.log(Campaign);
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
},[])

const addLead = (AgentSession) =>{
  fetch('http://contactcenter.digialaya.com/WebServices/addLeadsApi', {
        body: JSON.stringify({
            'Lead_LeadStatus' : statusVal,
            'Lead_Campaign' : campaignVal,
            'Lead_Description' : description,
            'UserFirst_Name' : fname,
            'UserLast_Name' : lname,
            'User_Email' : email,
            'User_Mobile' : mobile,
            'AgentName' : AgentSession.UserName,
            'EnterpriseId' : AgentSession.EnterpriseId,
            'SubEnterpriseId' : AgentSession.SubEnterpriseId,

        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
            props.setLeadAdded(true);
            if(jsonObject['status'] == 'success'){
               Alert.alert('Success','Lead Added Successfully');
              props.navigation('CallPopup');
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


return (
    <ScrollView>
      <View color={Colors.DANGER_COLOR} style={styles.header}><Text style={styles.headertext}>Interaction</Text></View>
        <View style = {styles.screen}>
        <View>
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
          <View style={styles.subbtn}>
            <Button title="Update" color={Colors.PRIMARY_COLOR} onPress ={() => addLead(AgentSession)}/>
          </View>
          <View style={styles.subbtn}>
            <Button title="Call Control" color={Colors.BACK_COLOR} onPress ={() => backtocall()}/>
          </View>
        </View>

        </View>
    </ScrollView>
);

};

const styles = StyleSheet.create({
  header : {
      width : '100%',
      height : 80,
      backgroundColor : Colors.DANGER_COLOR,
      alignItems: 'center',
    },
    headertext :{
      color : '#fff',
      fontSize : 20,
      marginTop : 35,
    },
    screen: {
        flex: 1,
        marginTop: "3%",
        marginHorizontal: 20,
    },
    textInput: {
        width: '90%'
    },
    addBtn: {       
        margin: 10,
        width : '90%',
        flexDirection: 'row',
    },
    subbtn :{
      width : "50%",
      marginRight : 10,
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


export default LeadFormScreen;




