import React, {useState} from 'react'
import {
  View,
  TextInput,
  Button,
    ToastAndroid,
  StyleSheet,
  Alert,Dimensions,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

export default Signup = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const addData = res => {
  console.log('enter in data upload')
  const {uid, email} = res.user
  try {
    const response = database().ref(`users/${uid}`).push({
      email: email,
      password: password,
    })
    // setData('')
    setEmail('')
    setPassword('')

    console.log(response)
  } catch (err) {
    console.log(err)
  }
}

const handleSignup = () => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      // User signed up successfully
      console.log('User signed up successfully!', res.user)
      navigation.navigate('Home', {res: JSON.stringify(res)})
      ToastAndroid.show('You are verified 🎉', ToastAndroid.SHORT)
      console.log(JSON.stringify(res))
      addData(res)
    })
    .catch(error => {
      // Failed to sign up
      console.error(error)
      ToastAndroid.show('Failed to verify 🥺', ToastAndroid.LONG)
    })
}

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container}>
        <Image source={require('../Assets/signin.png')} style={styles.pic} />
        <Text style={styles.signup}>Create Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Enter your Email Address'
            placeholderTextColor={'black'}
            onChangeText={text => setEmail(text)}
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Password'
            placeholderTextColor={'black'}
            onChangeText={text => setPassword(text)}
            value={password}
            // secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <View
          style={{flexDirection: 'row', alignSelf: 'center', marginTop: 15}}>
          <Text>Already have an account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={{color: 'red'}}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
   height: Dimensions.get('window').height
  },

  pic: {
    height: 400,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  signup: {
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
  button: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#6d65ff',
    height: '6%',
    justifyContent: 'center',
    borderRadius: 15,
  },

  signupButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
  },
})
