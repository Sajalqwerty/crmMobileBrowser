import React, { useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


const GoalItem = props => {
  return (
            <View style={styles.listItem}>
              <Text>{props.title}</Text>
            </View>
          ); 
}

export default GoalItem;

const styles = StyleSheet.create({
  
    listItem: {
      flex : 1,
      height : 40,
      backgroundColor : '#ccc',
      borderColor : 'black',
      borderWidth: 1,
      marginVertical : 10,
    }
});

