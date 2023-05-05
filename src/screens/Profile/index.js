import React, {useContext,useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styles from './profileStyle';
import appTheme from '../../constants/colors';
import {AuthContext} from '../../context';
import {TabScreenHeader} from '../../components';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
let Image_Http_URL ={ uri: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png'};
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Profile({navigation}) {
  const {state, dispatch} = useContext(AuthContext);
  const {user} = state;
  const [userData, setuserData] = useState(null)
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };
  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      console.log("🚀 ~ file: index.js:40 ~ getData ~ jsonValue:", jsonValue)
      setuserData(jsonValue)
      return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch(e) {
      // error reading value
    }
  }
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
              <Text style={styles.nameText}>dev user</Text>
              <Text style={styles.designationText}>{user?.designation}</Text>
              <TouchableOpacity onPress={() => handleNavigation('Login')} style={styles.editProfileWrapper}>
                <Text style={styles.editProfileText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
