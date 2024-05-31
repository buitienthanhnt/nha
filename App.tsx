/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  ListRenderItem,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RenderHTML from 'react-native-render-html';
import {LogBox} from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  image_path?: string;
  navigation?: any;
  data?: any;
}>;

function Section({
  id,
  title,
  image_path,
  navigation,
  data,
}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      style={styles.sectionContainer}
      onPress={() => {
        navigation.navigation.navigate('Detail', {
          id: id,
          value: data,
        });
      }}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : 'green',
          },
        ]}>
        {title}
      </Text>
      <Image
        source={{uri: image_path}}
        style={{height: 160, width: '100%', borderRadius: 16, marginTop: 10}}
        resizeMode={'cover'}
      />
      <TouchableOpacity
        onPress={() => {
          database().ref(`/newpaper/home/${id}`).remove();
        }}
        style={{
          width: '100%',
          height: 40,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text style={{fontSize: 18, fontWeight: '600', color: 'blue'}}>
          Bỏ qua
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// @ts-ignore
function Home({navigation}): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [fi, setFi] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const onData = database()
      .ref('newpaper/home')
      .orderByKey()
      .on('value', snapshot => {
        if (snapshot.numChildren()) {
          let _data: any = [];
          snapshot.forEach((item: FirebaseDatabaseTypes.DataSnapshot) => {
            const data = item.val();
            if (data.id) {
              _data.push(data);
            } else {
              _data.push(data[Object.keys(data)[0]]);
            }
            return undefined;
          });
          setData(_data.reverse()); // đảo ngược thứ tự data
        }
        console.log('........... change Fi');
        setFi(true);
      });

    return () => database().ref('newpaper/home').off('value', onData);
  }, []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({item, index}) => {
      return (
        <Section
          navigation={{navigation}}
          id={item.id}
          key={index}
          title={item.title}
          image_path={
            item?.image_path ||
            'https://firebasestorage.googleapis.com/v0/b/newpaper-25148.appspot.com/o/demo%2FgBYNm4ke2I.png?alt=media&token=24057320-9c26-46cc-b1be-711c7296cc6b'
          }
          data={item}
        />
      );
    },
    [navigation],
  );

  if (!fi) {
    return (
      <View>
        <Text>Đang tìm kiếm thông tin</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
        data={data}
        style={{paddingHorizontal: 5}}
        renderItem={renderItem}
        initialNumToRender={12}
        extraData={data}
        keyExtractor={(item, index) => index + '_key'}
        ItemSeparatorComponent={() => {
          return <View style={{height: 10}} />;
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 18, fontWeight: '600', color: 'green'}}>
                !! Không có thông tin khả dụng !!
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const Detail: FunctionComponent<any> = ({
  route: {
    params: {value},
  },
}) => {
  return (
    <ScrollView style={{padding: 10, flex: 1}}>
      <Text style={{color: 'green', fontSize: 16, fontWeight: '500'}}>
        {value.title}
      </Text>
      <Image
        source={{uri: value.image_path}}
        style={{width: '100%', height: 180, marginVertical: 10}}
        borderRadius={10}
        resizeMode={'cover'}
      />
      <RenderHTML
        source={{html: value?.conten || ''}}
        contentWidth={Dimensions.get('screen').width - 20}
      />
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`tel:${value.short_conten}`);
        }}
        style={{
          width: '100%',
          height: 40,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: '600', color: 'blue'}}>
          sdt: {value.short_conten}
        </Text>
      </TouchableOpacity>
      <View style={{height: 40}} />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{
            headerTitle: 'Nội dung chi tiết',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
