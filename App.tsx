import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Button, Dimensions} from 'react-native';
import Video from 'react-native-video'; // https://blog.logrocket.com/adding-videos-react-native-react-native-video/

// https://www.pexels.com/search/videos/gif/
const App = () => {
  const [pause, setPause] = useState(false);
  return (
    <View style={{flex: 1, paddingHorizontal: 5}}>
      <Video
        source={{
          uri: 'https://alphonso-uppy.jmango360.dev/files/vjuz0dfqo7gz0dnzs6xmv7zt/1496953604',
          type: 'm3u8',
        }}
        paused={pause} // make it start
        style={styles.backgroundVideo} // any style you want
        repeat={true} // make it a loop
        // type={'m3u8'} // định dạng này hỗ trợ tốt hơn
        resizeMode={'cover'}
        poster={
          'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/448182425_426022043682243_3046730575109270469_n.jpg?stp=dst-jpg_s600x600&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=GQokLNZ-2S0Q7kNvgFAFuTA&_nc_ht=scontent.fhan2-5.fna&oh=00_AYBqjIc1qKxxyaZqrEllb6W5a-BCLvE3e8Hd91TolRN5xQ&oe=6670427E'
        }
        onError={error => {
          console.log('----', error);
        }}
        pictureInPicture={false}
        playInBackground={false}
        playWhenInactive={false}
        allowsExternalPlayback={false}
        preventsDisplaySleepDuringVideoPlayback={true}
        hideShutterView={true}
      />
      <View style={{height: 10}} />
      <Button
        title={'pause'}
        onPress={() => {
          setPause(pause => !pause);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: ((Dimensions.get('screen').width - 10) / 4) * 3,
    width: '100%',
    marginTop: 10,
    borderRadius: 4,
  },
  button: {
    marginTop: 5,
  },
});

export default App;
