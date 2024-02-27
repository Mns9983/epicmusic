import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Alert, Linking, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { getAll } from 'react-native-get-music-files';

const Explore = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    requestMediaAudioPermission();
  }, []);

  useEffect(() => {
    fetchSongs();
  }, []);

  const requestMediaAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        {
          title: 'Epic Music Media Permission',
          message: 'Epic Music needs access to your Media Audio so you can play awesome music.',
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

  const fetchSongs = async () => {
    try {
      const tracks = await getAll({
        id: true,
        artist: true,
        duration: true,
        title: true,
        album: true,
        genre: true,
        cover: true,
        minimumSongDuration: 10000, // Minimum song duration in milliseconds
      });
      setSongs(tracks);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const playSong = async (title) => {
    try {
      const selectedSong = songs.find(song => song.title === title);
      if (selectedSong) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: selectedSong.id,
          url: selectedSong.url,
          title: selectedSong.title,
          artist: selectedSong.artist,
          artwork: selectedSong.cover,
        });
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Internal Songs</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.songContainer} onPress={() => playSong(item.title)}>
            <View>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  songContainer: {
    marginBottom: 10,
    borderWidth: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Explore;
// const setupPlaybackListeners = async () => {
//   try {
//     // Initial setup
//     const initialDuration = await TrackPlayer.getDuration()
//     setDuration(initialDuration)

//     const initialPosition = await TrackPlayer.getPosition()
//     setPosition(initialPosition)

//     // Set up event listener for track changes
//     TrackPlayer.addEventListener('playback-track-changed', async event => {
//       const newTrackDuration = await TrackPlayer.getDuration()
//       setDuration(newTrackDuration)
//     })

//     // Set up event listener for queue end (automatic play of the next song)
//     TrackPlayer.addEventListener('playback-queue-ended', async event => {
//       const newPosition = await TrackPlayer.getPosition()
//       setPosition(newPosition)

//       // Play the next song
//       const nextIndex = (currentTrackIndex + 1) % songs.length
//       setCurrentTrackIndex(nextIndex)
//       await playSongByIndex(nextIndex)
//     })

//     // Set up continuous position updates
//     const intervalId = setInterval(async () => {
//       const currentPosition = await TrackPlayer.getPosition()
//       setPosition(currentPosition)
//     }, 1000)

//     return () => {
//       clearInterval(intervalId)
//     }
//   } catch (error) {
//     console.error('Error setting up playback listeners:', error)
//   }
// }
