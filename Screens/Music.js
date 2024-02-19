import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import {SongList} from '../SongList'
import TrackPlayer from 'react-native-track-player'
import Slider from 'react-native-slider'

const MusicCard = ({title, artist, cover}) => (
  <View style={styles.card}>
    <Image source={{uri: cover}} style={styles.cover} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.artist}>{artist}</Text>
  </View>
)

export default Music = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setupTrackPlayer()
    setupPlaybackListeners()
  }, [])

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.add(
      SongList.map(song => ({
        id: song.id,
        url: song.url,
        title: song.title,
        artist: song.artist,
        artwork: song.artwork,
      })),
    )
  }

  useEffect(() => {
    setupPlaybackListeners()
  })
  const setupPlaybackListeners = async () => {
    // Get the duration of the current track
    const trackDuration = await TrackPlayer.getDuration()
    setDuration(trackDuration)

    // Update the position of the slider every second
    const intervalId = setInterval(async () => {
      const currentPosition = await TrackPlayer.getPosition()
      setPosition(currentPosition)
    }, 1000)

    return () => clearInterval(intervalId)
  }

  
//  console.log(position,duration )
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }
    setIsPlaying(!isPlaying)
  }

  const goToNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % SongList.length
    setCurrentTrackIndex(nextIndex)
    await TrackPlayer.skipToNext()
  }

  const goToPreviousTrack = async () => {
    const previousIndex =
      (currentTrackIndex - 1 + SongList.length) % SongList.length
    setCurrentTrackIndex(previousIndex)
    await TrackPlayer.skipToPrevious()
  }

  // const onSliderValueChange = async value => {
  //   await TrackPlayer.seekTo(value)
  // }

  const onSliderValueChange = async value => {
  const currentPosition = value
  setPosition(currentPosition)

  const trackDuration = await TrackPlayer.getDuration()
  setDuration(trackDuration)

  await TrackPlayer.seekTo(value)
}

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`
}

const padWithZero = number => (number < 10 ? `0${number}` : `${number}`)
// console.log(pos,duration)
  return (
    <SafeAreaView style={styles.container}>
      <MusicCard
        title={SongList[currentTrackIndex].title}
        artist={SongList[currentTrackIndex].artist}
        cover={SongList[currentTrackIndex].artwork}
      />
      <View style={styles.sliderContainer}>
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          step={1}
          onValueChange={onSliderValueChange}
          style={styles.slider}
          thumbTintColor='#6d65ff'
          minimumTrackTintColor='#6d65ff'
          maximumTrackTintColor='white'
         trackStyle={{color:'black',height:10}}
          // thumbStyle={{color:'black',height:30,width:30}}
          // thumbTouchSize={{ width: 100, height: 100 }}
        />
        <Text style={styles.sliderLabel}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity onPress={goToPreviousTrack}>
          <Image
            source={require('../Assets/previous.png')}
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          {isPlaying ? (
            <Image
              source={require('../Assets/pause2.png')}
              style={{height: 65, width: 65}}
              resizeMode='center'
            />
          ) : (
            <Image
              source={require('../Assets/play3.png')}
              style={{height: 65, width: 65}}
              resizeMode='center'
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextTrack}>
          <Image
            source={require('../Assets/next.png')}
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').width,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    width: '100%',
  },
   sliderContainer: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
  },
})
