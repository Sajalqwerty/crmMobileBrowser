import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Colors from '../Constants/Colors';

const DashboardScreen = props => {

  let websocket = new WebSocket("ws://180.179.210.49:6789/");
  let mySession = {"EntId": 1, "SubEntId":0, "SocketId": "", "AgentId": 1, "AgentExtension" :  '8077140282',"Status": "AVAILABLE", "SessionDetails": { "TotalCalls": 0, "Accepted": 0, "Rejected": 0, "AvTT": 0, "MaxTT": 0 }, "CampaignsIdLinked": [] };
  let data = { action: 'LOGIN', AnAgent: mySession };
  let currentStatus = 'AVAILABLE';
  try{
    console.log('send');
    websocket.send(JSON.stringify(data))
  }
  catch(e){
    console.log('sendnow');
    websocket.onopen = () => websocket.send(JSON.stringify(data));
  }

  websocket.onmessage = function (event) {
    console.log('connected');
  }


return (
    <View style = {styles.screen}>
    <View style={styles.tile}>
    <Text>Total Calls</Text>
    </View>
    <View style={styles.tile}>
    <Text>0</Text>
    </View>
    <View style={styles.tile}>
    <Text>Accepted</Text>
    </View>
    <View style={styles.tile}>
    <Text>0</Text>
    </View>
    <View style={styles.tile}>
    <Text>Rejected</Text>
    </View>
    <View style={styles.tile}>
    <Text>0</Text>
    </View>
    <View style={styles.tile}>
    <Text>Login Time</Text>
    </View>
    <View style={styles.tile}>
    <Text>00/00/0000 00:00</Text>
    </View>
    <View style={styles.tile}>
    <Text>Avtt</Text>
    </View>
    <View style={styles.tile}>
    <Text>0</Text>
    </View>
    <View style={styles.tile}>
    <Text>Maxtt</Text>
    </View>
    <View style={styles.tile}>
    <Text>0</Text>
    </View>
    </View>

    // <View style = {styles.screen}><Text>This is DashboardScreen</Text></View>
);

};

const styles = StyleSheet.create({
    screen: {
        marginHorizontal: 20,
        alignItems: 'center',
    },
    parentitems:{
    },
    tile : {
        backgroundColor : Colors.DANGER_COLOR,
        alignItems: 'center',
        justifyContent : 'center',
        height : 100,
        flex : 1,
    },
    itemstext :{
        color : '#fff',
        fontSize : 30,
    }

});


export default DashboardScreen;




