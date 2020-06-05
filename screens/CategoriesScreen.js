import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const CategoriesScreen = props => {

return (
    <View style = {styles.screen}><Text>This is CategoriesScreen</Text></View>
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


export default CategoriesScreen;




