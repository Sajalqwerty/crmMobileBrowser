import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,TextInput,Button,ScrollView,Alert } from 'react-native';
import Colors from '../Constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';

const ProgressFormScreen = props => {

const [fname, setFname] = useState('');
const [lname, setLname] = useState('');
const [email, setEmail] = useState('');
const [remarks, setRemarks] = useState('');
const [leadId, setLeadId] = useState('');
const [status, setStatus] = useState('');
const [fetchStatus, setFetchStatus] = useState([{label: '-- Select Status --', value: '0'}]);
const StatusName = '0';
const [statusVal,setStatusVal] = useState('');

const AgentSession = props.response.agentdata;


const changeStatus = (status) =>{
 setStatusVal(status.StatusName);
}

const backtocall = () => {
  props.setLeadAdded(true);
  props.navigation('CallPopup');
}

useEffect(()=>{

let LeadData = props.response.leaddata;
console.log(LeadData)

setFname(LeadData.FirstName);
setLname(LeadData.LastName);
setLeadId(LeadData.LeadId);
setEmail(LeadData.Email);
changeStatus({'StatusName' : LeadData.StatusName});

 fetch('http://contactcenter.digialaya.com/WebServices/getCampaignApi/'+AgentSession.UserId+'/'+AgentSession.EnterpriseId+'/'+AgentSession.SubEnterpriseId, {
  method: 'post',
  async : false,
  }).then((response) => {
  return response.json();
  })
  .then((jsonObject) => {
    console.log(jsonObject);

      let statusoption = [{label: '-- Select Status --', value: ''}];
      if(jsonObject['status'] == 'success'){

        let LeadStatus = jsonObject['data']['LeadStatus'];

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



 const addProgress = (AgentSession) => {
      
  fetch('http://contactcenter.digialaya.com/WebServices/addLeadProgressApi', {
    body: JSON.stringify({
        'Lead_LeadStatus' : statusVal,
        'Lead_Id' : leadId,
        'Remarks' : remarks,
        'AgentName' : AgentSession.UserName,
        'Role' : AgentSession.Role,
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
        console.log(jsonObject);
        if(jsonObject['status'] == 'success'){
            Alert.alert('Success','Progress Added Successfully');
            props.navigation('CallPopup');
        }
        else{
          Alert.alert('Error','Please check your form again');
          return false;
        }
    }); 
}

return (
    <ScrollView>
    <View color={Colors.DANGER_COLOR} style={styles.header}><Text style={styles.headertext}>Interaction</Text></View>
    
    <View style = {styles.screen}>

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
          <View style={styles.subbtn}>
            <Button title="Add Progress" color={Colors.PRIMARY_COLOR} onPress ={() => addProgress(AgentSession)}/>
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
        marginTop: "20%",
        marginHorizontal: 10,
    },
    textInput: {
        width: '90%'
    },
    addBtn: {       
        marginRight : 10,
        marginTop : 50,
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
    },
});


export default ProgressFormScreen;




