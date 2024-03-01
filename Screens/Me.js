import {StyleSheet, Text, View, ScrollView, Image, FlatList} from 'react-native'
import React from 'react'
// import {useRoute} from '@react-navigation/native'

export default function Me () {
//   const route = useRoute()
//   const {selectedSongs} = route.params
// console.log(selectedSongs);
  return (
    <View style={styles.parent}>
      <View style={styles.container1}>
        <Text>Me</Text>
      </View>
      {/* <View style={styles.container2}>
        <Text>Me{selectedSongs}</Text>
        <FlatList
          data={selectedSongs}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.artist}</Text>
            </View>
          )}
        />
      </View> */}
      <View style={styles.container3}>
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 100,
            backgroundColor: '#6d65ff',
          }}
          source={require('../Assets/musicicon.png')}
        />
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 30}}>UserName</Text>
          <Text style={{fontSize: 20, fontWeight: '400'}}>Bio</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container1: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    height: 260,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: '#6d65ff',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.01,
    shadowRadius: 10,
    elevation: 15,
  },
  container3: {
    height: 150,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: '#6d65ff',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.01,
    shadowRadius: 10,
    elevation: 15,
    marginBottom: 20,
  },
})
