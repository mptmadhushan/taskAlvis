import React,{useState} from 'react';
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
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './signUpStyle';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import { register } from '../../api/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


export function SignUp({navigation}) {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [email, setEmail] = useState('');
  const [viewPass, setViewPass] = useState(false);

  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const handleLogin = () => {
    if(!userName){
      alert('invalid email')
    }if(!password){
      alert('invalid email')
    }if(password==!confpassword){
      alert('Please check your password!')
    }
  
    const payload = {
      username: userName,
      password: password,
      email: email,
    };
    console.log(payload);
    // setLoading(true);
  
    register(payload)
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
        storeData(data)
        console.log('token', data.accessToken);
      })
      .catch(error => {
        console.log('error-->', error);
  
        // showToast(error.responses);
      })
      .finally(() => {
        // setLoading(false);
      });
    }
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@storage_Key', jsonValue)
        handleNavigation('Login')
      } catch (e) {
        console.log("🚀 ~ file: index.js:86 ~ storeData ~ e:", e)
        // saving error
      }
    }
  return (
    <SafeAreaView style={styles.container}>
       <Toast />
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
            placeholderTextColor="gray"
            onChangeText={newText => setUserName(newText)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
          <TextInput
            onChangeText={newText => setEmail(newText)}
            placeholder="Email"
            placeholderTextColor="gray"
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={viewPass}
            onChangeText={newText => setPassword(newText)}
            style={styles.textInput}
          />
            <TouchableOpacity onPress={() => setViewPass(!viewPass)}>
          <Octicons name="eye-closed" size={20} color="gray" /></TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            secureTextEntry={viewPass}
            onChangeText={newText => setConfPassword(newText)}
            style={styles.textInput}
          />
            <TouchableOpacity onPress={() => setViewPass(!viewPass)}>
          <Octicons name="eye-closed" size={20} color="gray" /></TouchableOpacity>
        </View>
        {/* <View style={styles.savePwdRow}>
          <Text style={styles.savePwdText}>Save Password</Text>
          <Switch
            trackColor={{false: appTheme.INACTIVE_COLOR, true: appTheme.COLOR2}}
            thumbColor="#fff"
            value={true}
          />
        </View> */}
        <TouchableOpacity onPress={() => handleLogin()} style={styles.signUpBtnWrapper}>
          <Text style={styles.signUpBtnText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtnWrapper}
          onPress={() => handleNavigation('Login')}>
          <Text style={styles.loginBtnText}>
            Already have an account? LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
