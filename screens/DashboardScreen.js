import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Colors from '../Constants/Colors';

const DashboardScreen = props => {

const dataList = [{'Total Calls' : 1},{'Accepted' : 1}];


const renderItem = () => {dataList.map((value, index) => {
    console.log(value)
     return (
              <View style={styles.items}>
                  <Text  style={styles.itemstext}>{Object.keys(value)[0]}</Text>
              </View>
     );
});
};
return (
    <View style = {styles.screen}>
    <FlatList 
    data={dataList}
    renderItem = {renderItem}
    keyExtractor = {(item, index) => item.toString()}
     />
    </View>

    // <View style = {styles.screen}><Text>This is DashboardScreen</Text></View>
);

};

const styles = StyleSheet.create({
    screen: {
        marginHorizontal: 20,
        alignItems: 'center',
    },
    parentitems:{
    },
    items : {
        backgroundColor : Colors.DANGER_COLOR,
        alignItems: 'center',
        justifyContent : 'center',
        height : 100,
        flex : 1,
    },
    itemstext :{
        color : '#fff',
        fontSize : 30,
    }

});


export default DashboardScreen;




