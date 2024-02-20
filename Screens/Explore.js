import { View, Text, PermissionsAndroid, Alert, Linking } from 'react-native';
import React, { useEffect } from 'react';

const Explore = () => {
  useEffect(() => {
    requestMediaAudioPermission();
  }, []);

  const requestMediaAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        {
          title: 'Epic Music Media Permission',
          message:
            'Epic Music needs access to your Media Audio ' +
            'so you can play awesome music.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
      } else {
        console.log('Permission denied');
        showPermissionSettingsDialog();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const showPermissionSettingsDialog = () => {
    // Prompt user to go to app settings
    Alert.alert(
      'Permission Denied',
      'To use the Media, you need to grant Media permission. Do you want to go to app settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => openSettings() },
      ],
      { cancelable: false },
    );
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View>
      <Text>Explore</Text>
    </View>
  );
};

export default Explore;
