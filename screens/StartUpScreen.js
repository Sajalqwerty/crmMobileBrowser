import React from 'react';
import { StyleSheet, Text, View,AsyncStorage } from 'react-native';


const StartUpScreen = props => {

const tryLogin = async () => {
    const userData = await AsyncStorage.getItem('userData');
    console.log(userData);
    if(!userData) {
        props.navigation.navigate('LoginScreen');
        return;
    }
    else{
        props.navigation.navigate('DashboardScreen');
        return;
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




