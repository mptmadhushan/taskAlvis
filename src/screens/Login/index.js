import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import styles from './loginStyle';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import {login} from '../../api/authAPI';

export function Login({navigation}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [viewPass, setViewPass] = useState(false);

  const handleBackButton = () => {
    navigation?.goBack();
  };
  //   const handleLogin = () => {
  //   if(!userName){
  //     alert('enter valid username')
  //   }if(!password ){
  //     alert('enter valid password')
  //   }else{
  //     handleNavigation('BottomStack')
  //   }

  // }
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      setuserData(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  const handleLogin = () => {
    if (!userName) {
      alert('invalid email');
    }
    if (!password) {
      alert('invalid email');
    }

    const payload = {
      username: userName,
      password: password,
    };
    console.log(payload);
    // setLoading(true);

    login(payload)
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          // showToast('try again');
          alert('error Please Check');
          return;
        }
        const {data} = response;
        console.log('res', response.data);

        console.log('token', data.accessToken);
        storeData(data);
      })
      .catch(error => {
        console.log('error-->', error);

        // showToast(error.responses);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };
  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
      handleNavigation('BottomStack');
    } catch (e) {
      // saving error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContent}>
        <Text style={styles.largeText}>Welcome Back!</Text>
        <Text style={styles.smallText}>
          Log into your account &amp; manage {'\n'}your tasks
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Username"
            onChangeText={newText => setUserName(newText)}
            placeholderTextColor="gray"
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            onChangeText={newText => setPassword(newText)}
            secureTextEntry={viewPass}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setViewPass(!viewPass)}>
            <Octicons name="eye-closed" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.savePwdRow}>
          <Text style={styles.savePwdText}>Save Password</Text>
          <Switch
            trackColor={{false: appTheme.INACTIVE_COLOR, true: appTheme.COLOR2}}
            thumbColor="#fff"
            value={true}
          />
        </View> */}
        <TouchableOpacity
          style={styles.loginBtnWrapper}
          onPress={() => handleLogin()}>
          <Text style={styles.loginBtnText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpBtnWrapper}
          onPress={() => handleNavigation('SignUp')}>
          <Text style={styles.signUpBtnText}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
