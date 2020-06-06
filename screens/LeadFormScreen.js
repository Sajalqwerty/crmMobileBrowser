import React,{useState} from 'react';
import { StyleSheet, Text, View,TextInput,Button,ScrollView } from 'react-native';
import Colors from '../Constants/Colors';


const LeadFormScreen = props => {

const [fname, setFname] = useState('');
const [lname, setLname] = useState('');
const [email, setEmail] = useState('');
const [description, setDescription] = useState('');
const [mobile, setMobile] = useState('');
const [status, setStatus] = useState('');

return (
    <ScrollView style = {styles.screen}>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="First Name"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={fname}
          onChangeText={text => setFname(text)}
          />
        </View>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Last Name"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={lname}
          onChangeText={text => setLname(text)}
          />
        </View>
        
        <View style={styles.textInputView}>
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
        <TextInput 
          placeholder="Description"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={description}
          onChangeText={text => setDescription(text)}
          />
        </View>
        
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Mobile Number"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={mobile}
          onChangeText={text => setMobile(text)}
          />
        </View>
        <View style={styles.textInputView}>
        <TextInput 
          placeholder="Lead Status"
          keyboardType='default'
          autoCorrect
          required
          style={styles.textInput}
          value={status}
          onChangeText={text => setStatus(text)}
          />
        </View>
        <View style={styles.addBtn}>
        <Button title="Add Lead" color={Colors.PRIMARY_COLOR} />
        </View>
    </ScrollView>
);

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "10%",
        marginHorizontal: 20,
    },
    textInput: {
        width: '90%'
    },
    addBtn: {       
        margin: 20,
        width : '90%',
        alignItems: 'center'
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
});


export default LeadFormScreen;




