import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
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
const MusicCard2 = ({title, artist, cover}) => (
  <View style={styles.card2}>
    <Image source={{uri: cover}} style={styles.cover2} />
    <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
      <Text style={styles.title2}>{title}</Text>
      <Text style={styles.artist2}>{artist}</Text>
    </View>
  </View>
)
const MusicCard3 = ({title, artist, cover}) => (
  <View style={styles.card}>
    <Image source={{uri: cover}} style={styles.cover} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.artist}>{artist}</Text>
  </View>
)
const ExtraView = () => (
  <View style={styles.extraView}>
    <Text style={styles.extraText}>Additional Content</Text>
  </View>
)

export default Music = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showExtraView, setShowExtraView] = useState(false)

  useEffect(() => {
    setupPlaybackListeners()
    setupTrackPlayer()
  }, [])

  const playSong = async index => {
    setCurrentTrackIndex(index)
    await TrackPlayer.skip(index)
    await TrackPlayer.play()
  }

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

  const setupPlaybackListeners = async () => {
    const trackDuration = await TrackPlayer.getDuration()
    setDuration(trackDuration)

    const intervalId = setInterval(async () => {
      const currentPosition = await TrackPlayer.getPosition()
      setPosition(currentPosition)
    }, 1000)

    return () => clearInterval(intervalId)
  }

  const togglePlayPause = async () => {
    setupPlaybackListeners()
    if (isPlaying) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }
    setIsPlaying(!isPlaying)
  }

  const goToNextTrack = async () => {
    setupPlaybackListeners()
    // if (currentTrackIndex.length < SongList.length-1) {
    const nextIndex = (currentTrackIndex + 1) % SongList.length
    setCurrentTrackIndex(nextIndex)
    await TrackPlayer.skipToNext()
    // }
  }

  const goToPreviousTrack = async () => {
    setupPlaybackListeners()
    // if (currentTrackIndex > 0) {
    const previousIndex =
      (currentTrackIndex - 1 + SongList.length) % SongList.length
    setCurrentTrackIndex(previousIndex)
    await TrackPlayer.skipToPrevious()
  }
  // }

  const onSliderValueChange = async value => {
    setupPlaybackListeners()
    await TrackPlayer.seekTo(value)
  }

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`
  }

  const padWithZero = number => (number < 10 ? `0${number}` : `${number}`)

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.y
    const scrollThreshold = 500

    setShowExtraView(scrollPosition > scrollThreshold)
  }

  return (
    <View style={{flex: 1}}>
      {showExtraView && (
        <View style={styles.extraView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              // marginTop:10
            }}>
            <MusicCard2
              title={SongList[currentTrackIndex].title}
              artist={SongList[currentTrackIndex].artist}
              cover={SongList[currentTrackIndex].artwork}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '45%',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={goToPreviousTrack}>
                <Image
                  source={require('../Assets/previous.png')}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                {isPlaying ? (
                  <Image
                    source={require('../Assets/pause2.png')}
                    style={{height: 40, width: 40}}
                    resizeMode='center'
                  />
                ) : (
                  <Image
                    source={require('../Assets/play3.png')}
                    style={{height: 40, width: 40}}
                    resizeMode='center'
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={goToNextTrack}>
                <Image
                  source={require('../Assets/next.png')}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sliderContainer2}>
            <Slider
              value={position}
              minimumValue={0}
              maximumValue={duration}
              step={1}
              onValueChange={onSliderValueChange}
              style={styles.slider2}
              thumbTintColor='#6d65ff'
              minimumTrackTintColor='#6d65ff'
              maximumTrackTintColor='white'
              trackStyle={{color: 'black', height: 2}}
              thumbStyle={{color: 'black', height: 13, width: 13}}
            />
          </View>
        </View>
      )}
      <ScrollView
        style={{flex: 1}}
        onScroll={handleScroll}
        scrollEventThrottle={50}>
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
              trackStyle={{color: 'black', height: 10}}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.sliderLabel}>{formatTime(position)}</Text>
              <Text style={styles.sliderLabel}> {formatTime(duration)}</Text>
            </View>
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
        <View style={styles.container3}>
          {SongList.map((song, index) => (
            <TouchableOpacity
       key={song.id}
              onPress={() => playSong(index)}
              style={styles.list}>
                <View style={{paddingHorizontal:10}}>
                <Image source={{uri: song.artwork}} style={{height:70,width:70,borderRadius:10}} />
                </View>
        
         <View>
         <Text style={styles.songListItemText}>{song.title}</Text>
              <Text style={styles.songListArtistText}>{song.artist}</Text>
         </View>
            
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.65,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  card3 :{
    height:40,
    width:40
  },
  cover: {
    width: Dimensions.get('screen').width - 50,
    height: Dimensions.get('screen').width - 50,
    resizeMode: 'contain',
    borderRadius: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black',
  },
  cover2: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
    borderRadius: 10,
    marginRight: 10,
  },
  title2: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  artist2: {
    fontSize: 13,
    color: 'black',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 5,
    width: '100%',
    height: 60,
  },
  sliderContainer: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  sliderContainer2: {
    width: '90%',
    alignSelf: 'center',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  slider2: {
    width: '80%',
    height: 10,
    alignSelf: 'center',
    marginLeft: 40,
  },
  sliderLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
    justifyContent: 'space-between',
  },
  container3: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 30,
    marginBottom:90
    // height: Dimensions.get('screen').height * 0.65,
  },
  extraView: {
    height: 85,
    backgroundColor: '#e2e0ff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    width: '90%',
    zIndex: 1,
    flexDirection: 'column',
    borderRadius: 20,
    alignSelf: 'center',
    padding: 5,
    
  },
  extraText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    marginVertical: 10,
    flexDirection: 'row',
    height: 85,
    backgroundColor: 'white',
    width: '90%',
    alignItems: 'center',
    borderRadius: 15,
  },
  songListItemText :{
    fontWeight:'700'
  },
  songListArtistText :{
   
  }
})
