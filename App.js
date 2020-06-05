import React, { useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView,FlatList } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}


export default function App() {
   const [fontLoading,setFontLoading] = useState(false);
  console.log(fontLoading);
  if(!fontLoading) {
    return (<AppLoading startAsync={fetchFonts} onFinish={() => setFontLoading(true)} />); 
  }
    // return (<View><Text>This is app</Text></View>);
    return (
          <AppNavigator />
        );


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: "40%",
        marginHorizontal: 20,
        alignItems: 'center',
    },
});

