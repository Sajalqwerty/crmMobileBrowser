import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const DashboardScreen = props => {


return (
    <View style = {styles.screen}><Text>This is DashboardScreen</Text></View>
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


export default DashboardScreen;




