import React from 'react';
import { StyleSheet, Text, View,AsyncStorage } from 'react-native';


const StartUpScreen = props => {

const tryLogin = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if(!userData) {
        props.navigation.navigate('LoginScreen');
        return false;
    }
    else{
        props.navigation.navigate('DashboardScreen');
        return false;
    }
}
tryLogin();

return (
    <View style = {styles.screen}><Text>This is StartUpScreen</Text></View>
);

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "40%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
});


export default StartUpScreen;




