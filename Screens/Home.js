import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Music from './Music';
import Explore from './Explore';
import Me from './Me';
import Premium from './Premium';

export default Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      barStyle={styles.BottomTab}
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          borderRadius: 50,
          height: (Dimensions.get('screen').height / 812) * 50,
          marginBottom: (Dimensions.get('screen').height / 812) * 15,
          width: (Dimensions.get('screen').width / 380) * 350,
          marginLeft: (Dimensions.get('screen').width / 380) * 15,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#d6ccf7',
        tabBarItemStyle: {
          height: (Dimensions.get('screen').height / 812) * 40,
          width: (Dimensions.get('screen').width / 380) * 90,
          alignSelf: 'center',
          borderRadius: 40,
          marginLeft: (Dimensions.get('screen').width / 380) * 5,
          marginRight: (Dimensions.get('screen').width / 380) * 5,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Music"
        component={Music}
        options={{
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text></Text>
            ) : (
              <Text style={styles.MusicText}>Music</Text>
            ),
          tabBarIcon: ({focused}) => (
            focused ?(
              <Image
                source={require('../Assets/play.png')}
                style={{height: 25, width: 25,alignSelf:'center',marginTop:20}}
                resizeMode="contain"
              /> ) :(
                <Image
                source={require('../Assets/play.png')}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
              )
          
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text></Text>
            ) : (
              <Text style={styles.MusicText}>Explore</Text>
            ),
          tabBarIcon: ({focused}) => (
           focused ? (
              <Image
                source={require('../Assets/headphone.png')}
                style={{height: 25, width:25,alignSelf:'center',marginTop:20}}
                resizeMode="contain"
              /> ): (
              <Image
              source={require('../Assets/headphone.png')}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            /> )
           
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        initialParams={{ selectedSongs: [] }}
        options={{
          tabBarLabel: ({focused}) =>
            focused ? <Text></Text> : <Text style={styles.MusicText}>Me</Text>,
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                source={require('../Assets/user.png')}
                style={{height: 25, width: 25,alignSelf:'center',marginTop:20}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../Assets/user.png')}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            ),
        }}
      />
      {/* <Tab.Screen name='Premium' component={Premium}
    
    options={{
      tabBarLabel :({focused})=>(focused ? <Text></Text>:<Text style={styles.MusicText}>Premuim</Text> ),
      tabBarIcon: () => (
        <View>
            <Image source={require('../Assets/diamond.png')} style={{height:30,width:30}} resizeMode='contain'/>

        </View>
    ),
     }}
     /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  BottomTab: {
    backgroundColor: 'white',
    width: (Dimensions.get('screen').width / 350) * 330,
    borderRadius: 22,
    marginLeft: (Dimensions.get('screen').width / 350) * 10,
    marginBottom: (Dimensions.get('screen').height / 700) * 10,
    overflow: 'hidden',
  },
  MusicText: {
    fontSize:11,
    color: 'black',
    fontWeight: '600',
  },
});
