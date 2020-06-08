import React from 'react';
import { StyleSheet, Text, View,Image,Button,AsyncStorage } from 'react-native';
import Colors from '../Constants/Colors';


const CallPopupScreen = props => {

// AsyncStorage.removeItem('userData');

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




