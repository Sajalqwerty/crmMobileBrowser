import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,Button,ScrollView } from 'react-native';
import Colors from '../Constants/Colors';


const CallPopupScreen = props => {

const [callingState,setCallingState ] = useState(0);
const [callingData,setCallingData ] = useState({CallerNum : ''});
const AgentSession = props.response.agentdata;
const CampaignList = props.response.CampaignList;


const getLeadByNumber = (MobileNum,CampaignSelected) => {
    console.log('in getLeadByNumber');
    fetch('http://contactcenter.digialaya.com/WebServices/getLeadbyNumberApi', {
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
                props.setLeadData({
                    'StatusName' : jsonObject['data'].CustomerLead_Status,
                    'LeadId' : jsonObject['data'].CustomerLead_Id,
                    'FirstName' : jsonObject['data'].CustomerLead_FirstName,
                    'LastName' : jsonObject['data'].CustomerLead_LastName,
                    'Email' : jsonObject['data'].CustomerLead_UserEmail,
                })
                props.navigation('ProgressScreen');
            }
            else{
                props.navigation('LeadScreen');
            }
        });
    }

 const BackToLead = () =>{

     getLeadByNumber(callingData.CallerNum,callingData.CampaignId);
 }   

setTimeout(function(){

if('ReqAction' in props.response.response && props.response.response.ReqAction == "CALL_OFFER")
{
    setCallingData(props.response.CallProgress);
    console.log('This is calling data');
    console.log(callingData);
}
else if('ProgressAction' in props.response.response && props.response.response.ProgressAction == "ON-CALL")
{
    console.log(props.response.response);
    if(props.response.leadadded == false){
        getLeadByNumber(callingData.CallerNum,callingData.CampaignId);
        setCallingState(1);
    }
    else{
        setCallingState(1);
        setCallingData(props.response.CallProgress);
    }
}
else if('ProgressAction' in props.response.response && props.response.response.ProgressAction == "ON-RELEASE"){
    setCallingState(2);
}
else if('ProgressAction' in props.response.response && props.response.response.ProgressAction == "AVAILABLE"){
    props.navigation('Dashboard');
}
else if('data' in props.response.response && props.response.response.data == "Status changed from TRANSIENT to AVAILABLE"){
    props.navigation('Dashboard');
}
else{
    console.log('this is else after lead submit')
    console.log(props.response.CallProgress)
    setCallingData(props.response.CallProgress);

}

},500)

const CallAccepted = (AgentSession,CampaignList) => {
    let mySession = {"EntId":AgentSession.EnterpriseId,"SubEntId":AgentSession.SubEnterpriseId,"CampaignId":callingData.CampaignId,"CallerNum":callingData.CallerNum,"AgentSocketId":"", "VoiceSocketId":"","reqid": callingData.reqid, "AgentId": AgentSession.UserId, "ReqAction" :"CALL_ACCEPTED", "AgentExtension":AgentSession.Mobile, "ActionTime" : callingData.ActionTime,"Status":"CALL_ACCEPTED", "AgentType":"normal", "SessionDetails" : "", "CampaignsIdLinked" : CampaignList};
    let data = { action: 'CALL_ACCEPTED', FreeAgentReq: mySession, newstatus: 'CALL_ACCEPTED'};
    props.Senddata(data);
}

const CallRejected = (AgentSession,CampaignList) => {
  let mySession = {"EntId":AgentSession.EnterpriseId,"SubEntId":AgentSession.SubEnterpriseId,"CampaignId":callingData.CampaignId,"CallerNum":callingData.CallerNum,"AgentSocketId":"", "VoiceSocketId":"","reqid": callingData.reqid, "AgentId": AgentSession.UserId, "ReqAction" :"CALL_REJECTED", "AgentExtension":AgentSession.Mobile, "ActionTime" : callingData.ActionTime,"Status":"CALL_REJECTED", "AgentType":"normal", "SessionDetails" : "", "CampaignsIdLinked" : CampaignList};
  let data = { action: 'CALL_REJECTED', FreeAgentReq: mySession, newstatus: 'CALL_REJECTED'};
  props.Senddata(data);
}

const CallDiscopnnect = (AgentSession) => {
  let mySession = { "reqid": callingData.reqid, "AgentId":AgentSession.UserId, "AgentExtension":AgentSession.Mobile, "CallerNum":callingData.CallerNum, "CampaignId":callingData.CampaignId,"ProgressAction": "CALL_DISCONNECT", "ActionTime": callingData.ActionTime};
  let data = { action: 'CALL_DISCONNECT', 'CallProgress': mySession };
  props.Senddata(data);
}

const CallRelease = (AgentSession) => {
  let mySession = { "reqid": callingData.reqid, "AgentId":AgentSession.UserId, "AgentExtension":AgentSession.UserId, "CallerNum":callingData.CallerNum, "CampaignId":callingData.CampaignId,"ProgressAction": "CALL_RELEASED", "ActionTime": callingData.ActionTime};
  let res = {'action':'CALL_RELEASED', 'CallProgress': mySession };
  props.Senddata(res);
}

return (
    // <View style = {styles.screen}>
    // <View style={styles.callDetails}>
    // <Text style={styles.callDetailText}>+91 8077140282</Text>
    // <Text style={styles.callDetailText}>00:00</Text>
    // </View>
    // <Image style={styles.logoImage} source={{ uri: 'http://contactcenter.digialaya.com/common/profilePic/callingperson.png' }}/>
    // <View style={styles.buttonView} >
    // <View style={styles.callingbuttons} >
    // <Button title="Accept" color={Colors.SUCCESS_COLOR}/>
    // </View>
    // <View style={styles.callingbuttons}>
    // <Button title="Reject" color={Colors.DANGER_COLOR}/>
    // </View>
    // </View>
    // </View>
    <ScrollView>
    <View color={Colors.DANGER_COLOR} style={styles.header}><Text style={styles.headertext}>New Call</Text></View>
    <View style = {styles.screen}>
    <View style={styles.callDetails}>
    <Text style={styles.callDetailText}>{callingData.CallerNum}</Text>
    </View>
    <Image style={styles.logoImage} source={require('../assets/callingperson.png')}/>
    
    {callingState == 0 && (<View style={styles.buttonView} >
    <View style={styles.callingbuttons} >
    <Button title="Accept" color={Colors.SUCCESS_COLOR} onPress={() => CallAccepted(AgentSession,CampaignList)}/>
    </View>
    <View style={styles.callingbuttons}>
    <Button title="Reject" color={Colors.DANGER_COLOR} onPress={() => CallRejected(AgentSession,CampaignList)}/>
    </View>
    </View> ) }

    { callingState == 1 &&
      (<View style={styles.Dissconnect} >
        <View style={styles.subbtn}>
            <Button title="Disconnect" color={Colors.DANGER_COLOR} onPress={() => CallDiscopnnect(AgentSession)}/>
        </View>
        <View style={styles.subbtn}>
            <Button title="Update Interaction" color={Colors.BACK_COLOR} onPress={() => BackToLead(AgentSession)}/>
        </View>
    </View>) }
    
    { callingState == 2 &&

    (<View style={styles.Release} >
    <Button title="Release" style={styles.Releasebtn} color={Colors.DANGER_COLOR} onPress={() => CallRelease(AgentSession)}/>
    </View>)
    }
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
        marginTop: "30%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
    logoImage: {
        height: 300,
        width: 300,
        borderRadius: 100
    },
    buttonView: {
        flexDirection : "row",
        width: "90%",
        marginTop: 20,
    },
    callingbuttons :{
        width : "45%",
        marginHorizontal: 10,
        alignSelf: 'stretch'
    },
    callDetails:{
        alignItems: 'center',
        marginVertical: 10,
    },
    callDetailText:{
        fontSize: 20,
        fontWeight: '100',
    },
    Dissconnect:{
      marginVertical : 20,
      width : '110%',
      flexDirection : 'row',
    },
    Release:{
      marginVertical : 20,
      width : '50%',
    },
    subbtn :{
        flex : 1,
        width : '50%',
        marginRight : 10
    }
});


export default CallPopupScreen;




