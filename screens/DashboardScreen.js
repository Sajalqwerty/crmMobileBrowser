import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ScrollView,Button,AsyncStorage,Alert } from 'react-native';
import Colors from '../Constants/Colors';



const DashboardScreen = props => {

  const [totalCalls, setTotalCalls] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [avtt, setAvtt] = useState(0);
  const [maxtt, setMaxtt] = useState(0);
  const [loginDate, setLoginDate] = useState('00/00/0000');
  const [loginTime, setLoginTime] = useState('00:00');
  const [showBreakButton, setShowBreakButton] = useState(true);
  const [SessionData, setSessionData] = useState([]);

  const getSessionData = async () => {

    const userData = await AsyncStorage.getItem('userData');
    console.log('print session data')
    console.log(userData)
    if(userData){
      let data = JSON.parse(userData);

      setSessionData(data);
      
    }
    else{
      console.log('Session Time Out Please Retry App');
    }
  }

  

  const Login = (AgentSession,CampaignList) => {

    let mySession = {"EntId": AgentSession.EnterpriseId, "SubEntId":AgentSession.SubEnterpriseId, "SocketId": "", "AgentId": AgentSession.UserId, "AgentExtension" :  AgentSession.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": CampaignList };
    let data = { action: 'LOGIN', AnAgent: mySession };

    props.Senddata(data);
  }

  const AgentSessionData = (AgentSession,CampaignList) => {
    
    let mySession = {"EntId": AgentSession.EnterpriseId, "SubEntId":AgentSession.SubEnterpriseId, "SocketId": "", "AgentId": AgentSession.UserId, "AgentExtension" :  AgentSession.Mobile,"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": CampaignList };
    let data = { action: 'AGENTSESSIONDATA', AnAgent: mySession };
    props.Senddata(data);
  }


  setTimeout(function(){


  let AgentSession = props.response.agentdata;
  let AgentData = props.response.response;
  let loggedin = props.response.loggedin;
  console.log('printing state')
  console.log(props.response)
  
  // if(loggedin == false && ('data' in AgentData && AgentData.data != 'AVAILABLE')){
    
  //     Login(AgentSession);
  // }
  // if('data' in AgentData && AgentData.data == 'AVAILABLE')
  // {
  //   console.log('checkingh')
  //   AgentSessionData(AgentSession);
  // }
	if('data' in AgentData && AgentData.data == 'Status changed from AVAILABLE to BREAK'){
      setShowBreakButton(false);
  }
  else if('data' in AgentData && AgentData.data == 'Status changed from BREAK to AVAILABLE'){
      setShowBreakButton(true);
  }
  else if('data' in AgentData && AgentData.data == "LOGGED-OUT" && loggedin == true){
        AsyncStorage.removeItem('userData');
        props.navigation('Login');
  }
	else if(AgentData.Status == "AVAILABLE" && typeof AgentData.SessionDetails === 'object')
	{
	    setTotalCalls(AgentData.SessionDetails.TotalCalls);
	    setAccepted(AgentData.SessionDetails.Accepted);
	    setRejected(AgentData.SessionDetails.Rejected);
	    let parts = AgentData.logintime.split(/[- :]/);
	    let date = `${parts[2]}/${parts[1]}/${parts[0]}`;
	    let time = `${parts[3]}:${parts[4]}`
	    setLoginDate(date);
	    setLoginTime(time);
	    setAvtt(AgentData.SessionDetails.AvTT);
	    setMaxtt(AgentData.SessionDetails.MaxTT);
	}
  },500);  

  useEffect(() =>{
      props.setLeadAdded(false);
      let AgentSession = props.response.agentdata;
      fetch('http://devcc.digialaya.com/WebServices/getCampaignApi/'+AgentSession.UserId+'/'+AgentSession.EnterpriseId+'/'+AgentSession.SubEnterpriseId, {
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
          console.log(jsonObject);
            let camparr = [];
            if(jsonObject['status'] == 'success'){

              let Campaign = jsonObject['data']['Campaign'];

              if(Campaign.length > 0){
                for(var i=0; i < Campaign.length; i++){
                  camparr.push(Campaign[i].Campaign_Id);
                }
                props.setCampaign(camparr);

                if(props.response.loggedin == false){

                  Login(AgentSession,camparr);
                }
                
                AgentSessionData(AgentSession,camparr);
              }
            }
            else{
              console.log('validation error');
            }
        });
    },[]) 
    

 const Logout = () => {
    let CampaignList = props.response.CampaignList;
    let AgentSession = props.response.agentdata;
    let mySession = { "SocketId": "", "AgentId": AgentSession.UserId, "Status": "LOGUT", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": CampaignList } ;
    let data = { action: 'LOGOUT', AnAgent: mySession };

    props.Senddata(data);

    setTimeout(function(){
        props.navigation('Login');
    },500)
  }

  const UnBreak = () => {
    let CampaignList = props.response.CampaignList;
    let AgentSession = props.response.agentdata;
    let mySession = { "SocketId": "", "AgentId": AgentSession.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": CampaignList };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'AVAILABLE' };
    let currentStatus = 'AVAILABLE';
    props.Senddata(data);
  }

  const Break = () => {
    let CampaignList = props.response.CampaignList;
    let AgentSession = props.response.agentdata;
    let mySession = { "SocketId": "", "AgentId": AgentSession.UserId, "Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": CampaignList };
    let data = { action: 'STATUSCHANGE', AnAgent: mySession, newstatus: 'BREAK' };
    let currentStatus = 'BREAK';
    props.Senddata(data);
  	
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
        (<Button title="Break" color={Colors.DANGER_COLOR} onPress={() => Break()}/>):
        (<Button title="Unbreak" color={Colors.DANGER_COLOR} onPress={() => UnBreak()}/>)}
      </View>
      <View style={styles.callingbuttons}>
      <Button title="Logout" color={Colors.DANGER_COLOR} onPress={() => Logout()}/>
      </View>
    </View>
  
    </View>
    </ScrollView>
    );


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


export default DashboardScreen;




