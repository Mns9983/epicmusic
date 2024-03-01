import React, {useState} from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native'
import auth from '@react-native-firebase/auth'

export default PhoneAuthScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationId, setVerificationId] = useState('')
  // let phoneNumbern = `+91${phoneNumber}`

  const handleSendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + phoneNumber,
      )
      setVerificationId(confirmation.verificationId)
      ToastAndroid.show('Verification code sent!', ToastAndroid.LONG)
    } catch (error) {
      console.error(error)
      ToastAndroid.show(
        'Failed to send verification code 🥺',
        ToastAndroid.LONG,
      )
    }
  }

  const handleVerifyCode = async code => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, code)
      await auth().signInWithCredential(credential)
      ToastAndroid.show('Phone number verified 🎉', ToastAndroid.SHORT)
      navigation.navigate('Home')
    } catch (error) {
      console.error(error)
      ToastAndroid.show('Failed to verify phone number 🥺', ToastAndroid.LONG)
    }
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <Image source={require('../Assets/signin.png')} style={styles.pic} />
        <Text style={styles.Welcome}>Welcome</Text>
        <Text
          style={{
            fontSize: 15,
            marginLeft: 45,
            color: 'black',
            lineHeight: 25,
            marginBottom: 10,
          }}>
          You will receive a code on your mobile number for verification.
        </Text>
        {/* <Text style={{color: 'black', marginLeft: 45}}>Enter Phone Number:</Text> */}
        <View style={styles.conatiner}>
          <TextInput
            value={phoneNumber}
            placeholder='Enter Phone Number'
            style={{color: '#6d65ff', marginLeft: 15}}
            placeholderTextColor={'#6d65ff'}
            onChangeText={setPhoneNumber}
            keyboardType='phone-pad'
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>SEND CODE</Text>
        </TouchableOpacity>

        <Text style={{color: 'black', marginLeft: 45}}>
          Enter Verification Code:
        </Text>
        <View style={styles.conatiner}>
          <TextInput
            keyboardType='numeric'
            style={{color: '#6d65ff', marginLeft: 15}}
            placeholder='Type code here'
            placeholderTextColor={'#6d65ff'}
            // onChangeText={handleVerifyCode}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onLongPress={() => {
            navigation.navigate('Home')
          }}
          onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>VERIFY CODE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    borderColor: '#6d65ff',
    borderWidth: 1,
  },

  pic: {
    height: Dimensions.get('screen').height * 0.45,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  Welcome: {
    color: '#6d65ff',
    fontSize: 40,
    fontWeight: '800',
    padding: 20,
    marginLeft: 15,
    marginTop: 10,
  },

  button: {
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#6d65ff',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#6d65ff',
    borderWidth: 1,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  },
})
