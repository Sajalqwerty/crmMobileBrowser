import React, { useState} from 'react';
import Colors from '../Constants/Colors';
import { StyleSheet, Text, View, Button, TextInput,Image,AsyncStorage,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const setSessionData = async(data) => {
    AsyncStorage.setItem('userData',JSON.stringify({
                 'UserId' : data.Users_Id,
                 'UserName' : data.Users_Username,
                 'Email' : data.Users_Email,
                 'Mobile' : data.Users_Mobile,
                 'EnterpriseId' : data.Users_EnterpriseId,
                 'SubEnterpriseId' : data.Users_SubEnterpriseId,
                 'RoleId' : data.Users_Role,
                 'Role' : data.AgentsGroup_Role,
             }));
}

const LoginScreen = props => {
 
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

    const LoginByAjax = (email,password) => {
        console.log('all function');
        
        fetch('http://devcc.digialaya.com/WebServices/getAgentDataApi', {
        body: JSON.stringify({
            'email' : email,
            'password' : password,
        }),
        method: 'post',
        async : false,
        }).then((response) => {
        return response.json();
        })
        .then((jsonObject) => {
            if(jsonObject['status'] == 'success'){
                setSessionData(jsonObject['data']);
                props.navigation.navigate('DashboardScreen');
                return;
            }
            else{
                Alert.alert('Error','Invalid EmailId or Password');
            }
        });
    }

    return(
        <View style={styles.screen}>
        
         <Image style={styles.logoImage} source={{ uri: 'http://devcc.digialaya.com/common/loginSignup/images/DigialayaLogo.png' }}/>
        <View style={styles.textInputView}>
          <Ionicons name='ios-mail' size={22} style={styles.icon} />
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
          <Ionicons name='ios-lock' size={22} style={styles.icon} />
          <TextInput 
          placeholder="Password" 
          secureTextEntry={true} 
          style={styles.textInput}
          value={password}
          onChangeText={text => setPassword(text)}
          />
        </View>
        <Button title="Login" color={Colors.PRIMARY_COLOR} onPress={() => {LoginByAjax(email,password)}} />
        </View>

    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "30%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
    textInput: {
        width: '90%'
    },
    loginBtn: {       
        marginVertical: 20,
        alignItems: 'center'
    },
    icon: {
        marginRight: 10,
        marginTop: 3
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
    logoImage: {
        height: "15%",
        width: "80%",
        marginVertical: 20,
    },
});


export default LoginScreen;