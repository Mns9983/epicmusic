import React, {useState} from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'

import SignUp from './Screens/SignUp'
import Home from './Screens/Home'
import SignIn from './Screens/SignIn'
import Welcome from './Screens/Welcome'
import Phone from './Screens/Phone'

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={Welcome} />
        <Stack.Screen name='Signup' component={SignUp} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='SignIn' component={SignIn} />
        <Stack.Screen name='PhoneAuthScreen' component={Phone} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App
