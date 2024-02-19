import React, {useState} from 'react'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import auth from '@react-native-firebase/auth'

export default SignIn = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignin = () => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // User signed in successfully
      console.log('User signed in successfully!', userCredential.user)
      navigation.navigate('Home', {res: JSON.stringify(userCredential)})
       ToastAndroid.show('You are verified 🎉', ToastAndroid.SHORT)
      addData(userCredential)
    })
    .catch(error => {
      // Failed to sign in
      console.error(error)
       ToastAndroid.show('Failed to verify 🥺', ToastAndroid.LONG)
      // Alert.alert(
      //   'Signin Failed',
      //   'Invalid credentials. Please check your email and password.',
      // )
    })
}

  const addData = res => {
    const {uid, email} = res.user
    try {
      const responce = database().ref(`users/${uid}`).push({
        email: email,
        password: password,
      })
      // setData('')
      setEmail('')
      setPassword('')
      console.log(responce)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container}>
        <Image source={require('../Assets/signin.png')} style={styles.pic} />
        <Text style={styles.signup}>Welcome Back</Text>
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
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          <Text style={styles.signupButtonText}>Log in</Text>
        </TouchableOpacity>
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
    fontSize: 18,
  },
})
