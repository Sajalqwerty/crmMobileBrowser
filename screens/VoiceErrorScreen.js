import React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import Colors from '../Constants/Colors';


const VoiceErrorScreen = props => {

const Reconnect = () => {
    props.Reconnect();
}

return (
    <View style = {styles.screen}>
        <Text style={styles.text}>Voice is not connected !</Text>
        <View style={styles.button}>
            <Button title="Connect" color={Colors.SUCCESS_COLOR} onPress={Reconnect}/>
        </View>
    </View>
);

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "60%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
    text : {
        color : 'red',
        fontSize : 20,
    },
    button : {
        width : "50%",
        marginTop : 20    
    }
});

export default VoiceErrorScreen;

