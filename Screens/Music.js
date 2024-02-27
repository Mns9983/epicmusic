import React, {useState, useEffect, useRef} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native'
// import {SongList} from '../SongList'
import TrackPlayer from 'react-native-track-player'
import Slider from 'react-native-slider'
import {getAll} from 'react-native-get-music-files'

const MusicCard = ({title, artist, cover}) => (
  <View style={styles.card}>
    {cover ? (
      <Image source={{uri: cover}} style={styles.cover} />
    ) : (
      <Image style={styles.cover} source={require('../Assets/cover1.png')} />
    )}
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.artist}>{artist}</Text>
  </View>
)

const MusicCard2 = ({title, artist, cover}) => (
  <View style={styles.card2}>
    {cover ? (
      <Image source={{uri: cover}} style={styles.cover2} />
    ) : (
      <Image style={styles.cover2} source={require('../Assets/cover1.png')} />
    )}
    <View
      style={{
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '60%',
        height: '100%',
      }}>
      <Text style={styles.title2}>{title}</Text>
      <Text style={styles.artist2}>{artist}</Text>
    </View>
  </View>
)

// const MusicCard3 = ({title, artist, cover}) => (
//   <View style={styles.card}>
//     <Image source={{uri: cover}} style={styles.cover} />
//     <Text style={styles.title}>{title}</Text>
//     <Text style={styles.artist}>{artist}</Text>
//   </View>
// )
// const ExtraView = () => (
//   <View style={styles.extraView}>
//     <Text style={styles.extraText}>Additional Content</Text>
//   </View>
// )

export default Music = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showExtraView, setShowExtraView] = useState(false)
  const [songs, setSongs] = useState([])
  const [useSongList, setUseSongList] = useState(true)
  const [selectedTitle, setSelectedTitle] = useState('')
  const [selectedArtist, setSelectedArtist] = useState('')
  const [selectedCover, setSelectedCover] = useState('')

  useEffect(() => {
    setupPlaybackListeners()
    setupTrackPlayer()
  }, [])

  useEffect(() => {
    requestMediaAudioPermission()
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [])
  const scrollViewRef = useRef(null)

  const requestMediaAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        {
          title: 'Epic Music Media Permission',
          message:
            'Epic Music needs access to your Media Audio so you can play awesome music.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted')
        fetchSongs()
      } else {
        console.log('Permission denied')
        showPermissionSettingsDialog()
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const showPermissionSettingsDialog = () => {
    // Prompt user to go to app settings
    Alert.alert(
      'Permission Denied',
      'To use the Media, you need to grant Media permission. Do you want to go to app settings?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Settings', onPress: () => openSettings()},
      ],
      {cancelable: false},
    )
  }

  const openSettings = () => {
    Linking.openSettings()
  }

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
        minimumSongDuration: 10000,
        limit: 20,
        sortByName: true,
      })
      setSongs(tracks)
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }
  const playSong = async index => {
    try {
      const selectedSong = songs[index]
      if (selectedSong) {
        await TrackPlayer.reset()
        await TrackPlayer.add({
          id: selectedSong.id,
          url: selectedSong.url,
          title: selectedSong.title,
          artist: selectedSong.artist,
          cover: selectedSong.cover,
        })
        await TrackPlayer.play()
        console.log('playing:', index)
        // Update component state with the selected song details
        setIsPlaying(true)
        setSelectedTitle(selectedSong.title)
        setSelectedArtist(selectedSong.artist)
        setSelectedCover(selectedSong.cover)
        setCurrentTrackIndex(index)
        setupPlaybackListeners()
      }
    } catch (error) {
      console.error('Error playing song:', error)
    }
  }

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.add(
      songs.map(song => ({
        id: song.id,
        url: song.url,
        title: song.title,
        artist: song.artist,
        cover: song.cover,
      })),
    )
  }

  const setupPlaybackListeners = async () => {
    try {
      // Initial setup
      const initialDuration = await TrackPlayer.getDuration()
      setDuration(initialDuration)

      const initialPosition = await TrackPlayer.getPosition()
      setPosition(initialPosition)

      // Set up event listener for track changes
      TrackPlayer.addEventListener('playback-track-changed', async event => {
        const newTrackDuration = await TrackPlayer.getDuration()
        setDuration(newTrackDuration)
      })

      // Set up event listener for queue end (automatic play of the next song)
      TrackPlayer.addEventListener('playback-queue-ended', async event => {
        const newPosition = await TrackPlayer.getPosition()
        setPosition(newPosition)

        // Play the next song
        console.log('starting ', currentTrackIndex)
        console.log('starting2', index)
        playSong(currentTrackIndex)
      })

      // Set up continuous position updates
      const intervalId = setInterval(async () => {
        const currentPosition = await TrackPlayer.getPosition()
        setPosition(currentPosition)
      }, 1000)

      return () => {
        clearInterval(intervalId)
      }
    } catch (error) {
      console.error('Error setting up playback listeners:', error)
    }
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
    const nextIndex = (currentTrackIndex + 1) % songs.length
    console.log('Current Track Index:', nextIndex)
    setCurrentTrackIndex(nextIndex)
    await playSong(nextIndex)
  }

  const goToPreviousTrack = async () => {
    const previousIndex = (currentTrackIndex - 1 + songs.length) % songs.length
    console.log('Current Track Index:', previousIndex)
    setCurrentTrackIndex(previousIndex)
    await playSong(previousIndex)
  }

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
          <TouchableOpacity
            onPress={() => {
              scrollViewRef.current.scrollTo({y: 0, animated: true})
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: Dimensions.get('screen').width * 0.5,
              height: '100%',
              alignSelf: 'flex-start',
              // marginTop:10
            }}>
            <MusicCard2
              title={selectedTitle}
              artist={selectedArtist}
              cover={selectedCover}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: Dimensions.get('screen').width * 0.35,
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
          </TouchableOpacity>
          <View style={styles.sliderContainer2}>
            <Text style={styles.sliderLabel2}>{formatTime(position)}</Text>
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
            <Text style={styles.sliderLabel2}> {formatTime(duration)}</Text>
          </View>
        </View>
      )}
      <ScrollView
        style={{flex: 1}}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={50}>
        <SafeAreaView style={styles.container}>
          <MusicCard
            title={selectedTitle}
            artist={selectedArtist}
            cover={selectedCover}
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
          <FlatList
            horizontal={true}
            data={songs}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => playSong(index)}
                style={styles.list2}>
                <View>
                  {item.cover ? (
                    <Image
                      source={{uri: item.cover}}
                      style={{
                        height: 135,
                        width: 135,
                        resizeMode: 'cover',
                        alignSelf: 'center',
                        borderRadius: 15,
                        overflow: 'hidden',
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        height: 135,
                        width: 135,
                        resizeMode: 'cover',
                        alignSelf: 'center',
                        borderRadius: 15,
                        overflow: 'hidden',
                        // opacity: 0.9,
        
                      }}
                      source={require('../Assets/cover1.png')}
                    />
                  )}
                  <View
                    style={{
                      maxWidth: '90%',
                      height: '30%',
                      overflow: 'scroll',
                      alignSelf: 'center',
                      opacity: 1,
                    }}>
                    <Text
                      style={[
                        styles.songListItemText,
                        {},
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
        <FlatList
          style={{paddingBottom: 70}}
          data={songs}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => playSong(index)}
              style={styles.list}>
              <View style={{paddingHorizontal: 10}}>
                {item.cover ? (
                  <Image
                    source={{uri: item.cover}}
                    style={{height: 70, width: 70, borderRadius: 10}}
                  />
                ) : (
                  <Image
                    style={{height: 70, width: 70, borderRadius: 10}}
                    source={require('../Assets/cover1.png')}
                  />
                )}
              </View>

              <View
                style={{maxWidth: '70%', maxHeight: '80%', overflow: 'scroll'}}>
                <Text style={styles.songListItemText}>{item.title}</Text>
                <Text style={styles.songListArtistText}>{item.artist}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    height: Dimensions.get('screen').height * 0.87,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'yellow',
  },
  card3: {
    height: 40,
    width: 40,
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
    marginHorizontal: 10,
  },
  title2: {
    fontSize: 11,
    fontWeight: '500',
    color: 'black',
    maxWidth: '97.5%',
    height: '50%',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  artist: {
    fontSize: 13,
    color: '#666',
  },
  artist2: {
    fontSize: 13,
    color: 'black',
    maxWidth: '100%',
    height: '40%',
    fontWeight: 'bold',
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
    alignSelf: 'start',
    flexDirection: 'row',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  slider2: {
    width: '80%',
    height: 10,
    alignSelf: 'center',
    marginHorizontal: 5,
    // marginLeft: 40,
  },
  sliderLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
    justifyContent: 'space-between',
  },
  sliderLabel2: {
    textAlign: 'center',
    color: 'black',
    fontSize: 9,
  },
  container3: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 30,
    marginBottom: 90,
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
    alignSelf: 'center',
  },
  list2: {
 
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal:10,
    // flexDirection: 'row',
    height: 150,
    width: 150,
    alignItems: 'center',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  songListItemText: {
    fontWeight: '700',
  },
  songListArtistText: {},
})
