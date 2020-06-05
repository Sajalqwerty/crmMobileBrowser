import React, { useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const [email, setEmail] = useState('');

const GoalInput = props => {

  return (
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
          />
        <Button title="Login" onPress={props.onLogin.bind(this, email)}/>
        </View>
        
          ); 
}


const styles = StyleSheet.create({
  
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
        width: '90%',
        marginVertical: 12,
        borderRadius: 10
    },
});

