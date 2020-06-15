import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,Button,AsyncStorage } from 'react-native';
import Colors from '../Constants/Colors';


const CallPopupScreen = props => {

const [callingState,setCallingState ] = useState(0);
const [callingData,setCallingData ] = useState({CallerNum : ''});
const AgentSession = props.response.agentdata;
const CampaignList = props.response.CampaignList;


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
                props.navigation('ProgressScreen');
                changeStatus({'StatusName' : jsonObject['data'].CustomerLead_Status});
                setLeadId(jsonObject['data'].CustomerLead_Id);
                setFname(jsonObject['data'].CustomerLead_FirstName);
                setLname(jsonObject['data'].CustomerLead_LastName);
                setEmail(jsonObject['data'].CustomerLead_UserEmail);
            }
            else{
                props.navigation('LeadScreen');
            }
        });
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
    getLeadByNumber(callingData.CallerNum,callingData.CampaignId);
    setCallingState(1);
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
    // <Image style={styles.logoImage} source={{ uri: 'http://devcc.digialaya.com/common/profilePic/callingperson.png' }}/>
    // <View style={styles.buttonView} >
    // <View style={styles.callingbuttons} >
    // <Button title="Accept" color={Colors.SUCCESS_COLOR}/>
    // </View>
    // <View style={styles.callingbuttons}>
    // <Button title="Reject" color={Colors.DANGER_COLOR}/>
    // </View>
    // </View>
    // </View>

    <View style = {styles.screen}>
    <View style={styles.callDetails}>
    <Text style={styles.callDetailText}>{callingData.CallerNum}</Text>
    <Text style={styles.callDetailText}>00:00</Text>
    </View>
    <Image style={styles.logoImage} source={{ uri: 'http://devcc.digialaya.com/common/profilePic/callingperson.png' }}/>
    
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
    <Button title="Dissconnect" color={Colors.DANGER_COLOR} onPress={() => CallDiscopnnect(AgentSession)}/>
    </View>) }
    
    { callingState == 2 &&

    (<View style={styles.Dissconnect} >
    <Button title="Release" color={Colors.DANGER_COLOR} onPress={() => CallRelease(AgentSession)}/>
    </View>)
    }
    </View>
);

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "15%",
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
        fontFamily: 'open-sans-bold',
    }
});


export default CallPopupScreen;




