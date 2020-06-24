import React, { useState} from 'react';
import Colors from '../Constants/Colors';
import { StyleSheet, Text, View, Button, TextInput,Image,Alert,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const LoginScreen = props => {
 const [loader, setLoader] = useState(false); 
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

    const LoginByAjax = (email,password) => {

        if(email == '' || password == ''){
          Alert.alert('Error','Please enter valid emailid and password');
          return false;
        }
        setLoader(true);
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
            setLoader(false);
            if(jsonObject['status'] == 'success'){
                console.log('setting session');
                let session = {
                 'UserId' : jsonObject['data'].Users_Id,
                 'UserName' : jsonObject['data'].Users_Username,
                 'Email' : jsonObject['data'].Users_Email,
                 'Mobile' : jsonObject['data'].Users_Mobile,
                 'EnterpriseId' : jsonObject['data'].Users_EnterpriseId,
                 'SubEnterpriseId' : jsonObject['data'].Users_SubEnterpriseId,
                 'RoleId' : jsonObject['data'].Users_Role,
                 'Role' : jsonObject['data'].AgentsGroup_Role,
                }
                props.setAgentData(session);
                props.navigation('Dashboard');
                return;
            }
            else{
                Alert.alert('Error','Invalid EmailId or Password');
            }
        });
    }

    return(
      <View>
        <View style={styles.screen}>
         <Image style={styles.logoImage} source={require('../assets/DigialayaLogo.png')}/>
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

        {loader ?
        <ActivityIndicator size="large" color={Colors.DANGER_COLOR}></ActivityIndicator> :
        <Button title="Login" color={Colors.PRIMARY_COLOR} onPress={() => {LoginByAjax(email,password)}} />}

        </View>
      </View>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "45%",
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
        height: 60,
        width: "85%",
        marginVertical: 20,
    },
    logoloader: {
        height: 100,
        width: "85%",
        marginTop: 200,
        marginLeft : 20
    },
    loader : {
      position : 'absolute',
      height : 1500,
      width : '100%',
      backgroundColor : '#00000052',
      zIndex : 100000,
    }
});


export default LoginScreen;