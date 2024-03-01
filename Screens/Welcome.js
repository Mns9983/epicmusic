import {NavigationContainer} from '@react-navigation/native'
import React, {useState} from 'react'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'

export default Welcome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../Assets/signin.png')} style={styles.pic} />
      <Text style={styles.Welcome}>Welcome</Text>
      <Text
        style={{
          fontSize: 15,
          marginLeft: 45,
          color: 'black',
          lineHeight: 25,
          marginBottom: 20,
        }}>
        "If you already have an account , please log in Otherwise, sign up to
        continue."
      </Text>
      <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate('PhoneAuthScreen')}>
        <Text style={styles.LoginButtonText}>Continue with Mobile Number</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signupButtonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text
        onPress={() => {
          navigation.navigate('Home')
        }}
        style={{fontSize: 12, fontWeight: 'bold', alignSelf: 'center'}}>
        Direct Goto Home
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pic: {
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  Welcome: {
    color: '#6d65ff',
    fontSize: 40,
    fontWeight: '800',
    padding: 30,
    marginLeft: 15,
  },

  inputContainer: {
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'red',
    height: 40,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 3,
    borderColor: '#e6e6e6',
    borderRadius: 15,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    fontWeight: '500',
    color: 'black',
  },
  button1: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'white',
    height: '6%',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },

  button2: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#6d65ff',
    height: '6%',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  signupButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  },

  LoginButtonText: {
    alignSelf: 'center',
    color: '#6d65ff',
    fontSize: 18,
  },
})
