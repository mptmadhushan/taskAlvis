import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './profileStyle';
import {AuthContext} from '../../context';
import {TabScreenHeader} from '../../components';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
let Image_Http_URL = {
  uri: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png',
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUser} from '../../api/updateUser';

export function Profile({navigation}) {
  const {state, dispatch} = useContext(AuthContext);
  const {user} = state;
  const [userData, setuserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };
  useEffect(() => {
    getData();
  }, []);
  const update = async () => {
    const payload={
      id:userData.id,
      username:userName,
      email:email!==''? email:userData.email,
    }
    updateUser(payload)
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          // showToast('try again');
          Toast.show({
            type: 'error',
            text1: response.error.response.data.message,
          });
          return;
        }
        const {data} = response;
        console.log('res', response.data);

        console.log('token', data.accessToken);
        // storeData(data);
      // handleNavigation('Login');

      })
      .catch(error => {
        console.log('error-->', error.message);
        Toast.show({
          type: 'error',
          text1: 'Please enter task description',
        });
        // showToast(error.responses);
      })
      .finally(() => {
        // setLoading(false);
      });
  }
  const storeData = async value => {
    console.log("🚀 ~ file: index.js:99 ~ storeData ~ value:", value)
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
      handleNavigation('BottomStack');
    } catch (e) {
      // saving error
    }
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      setuserData(JSON.parse(jsonValue));
      console.log(
        '🚀 ~ file: index.js:41 ~ getData ~ JSON.parse(jsonValue):',
        JSON.parse(jsonValue),
      );
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => (
          <View style={styles.leftHeaderWrapper}>
            <TouchableOpacity
              onPress={() => handleBackButton('Members')}
              style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={25} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        )}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.profileDetailsSection}>
            <View style={styles.profileInfoSection}>
              <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsText}>135</Text>
                <Text style={styles.statisticsTitle}>Completed Tasks</Text>
              </View>
              <Image
                style={styles.profilePhoto}
                source={Image_Http_URL}></Image>
              <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsText}>20</Text>
                <Text style={styles.statisticsTitle}>Ongoing Tasks</Text>
              </View>
            </View>
            <View style={styles.profileCenterSection}>
              <Text style={styles.nameText}>{userName?userName:userData?.username}</Text>
              <Text style={styles.designationText}>{userData?.email}</Text>
              <TouchableOpacity
                onPress={() => handleNavigation('Login')}
                style={styles.editProfileWrapper}>
                <Text style={styles.editProfileText}>Log Out</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileCenterSection}>
              <TextInput
                placeholder="Username"
                onChangeText={newText => setUserName(newText)}
                placeholderTextColor="gray"
                style={{
                  width: 299,
                  borderRadius: 10,
                  marginTop: 10,
                  fontSize: 17,
                  flex: 1,
                  color: 'gray',
                  height: 45,
                  borderWidth: 1,
                  color: 'gray',
                }}
              />
              <TextInput
                placeholder="Email"
                onChangeText={newText => setEmail(newText)}
                placeholderTextColor="gray"
                style={{
                  width: 299,
                  borderRadius: 10,
                  marginTop: 10,
                  fontSize: 17,
                  flex: 1,
                  color: 'gray',
                  height: 45,
                  borderWidth: 1,
                  color: 'gray',
                }}
              />
              <TouchableOpacity
                onPress={() => update()}
                style={styles.editProfileWrapper}>
                <Text style={styles.editProfileText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
