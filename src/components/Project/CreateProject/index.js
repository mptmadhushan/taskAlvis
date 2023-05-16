import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import shortid from 'shortid';
import styles from './createProjectStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import {getScreenParent} from '../../../utils/NavigationHelper';
import {navigateToNestedRoute} from '../../../navigators/RootNavigation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getAllUsers} from '../../../api/getAllUsers';
import {addTask} from '../../../api/addTask';
import {addUserTask} from '../../../api/addTaskUser';
import LocationPicker from '../../../components/Task/MapView/index';
import locale from '../../../../node_modules/@ant-design/react-native//es/date-picker/locale/en_US';
// import Notifications from '../../../../src/utils/Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DatePicker,
  Button,
  Provider,
  WingBlank,
  Modal,
} from '@ant-design/react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export function CreateProject({}) {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers: []},
  });
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [checkboxState, setCheckboxState] = React.useState(false);

  const chooseMessage = message => {
    const reverseGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${message.lat},${message.lng}&sensor=false&key=AIzaSyCwwyOJUiBpHmDwJRrtNh53fpRfaJnHVKQ`;

    // call Reverse Geocoding API - https://www.geoapify.com/reverse-geocoding-api/
    fetch(reverseGeocodingUrl)
      .then(result => result.json())
      .then(featureCollection => {
        setLocationName(featureCollection.plus_code.compound_code);
      });
    setLocation(message);
  };

  const handleAddTask = () => {
    if (location === '') {
      Toast.show({
        type: 'error',
        text1: 'Please select location',
      });
    }
    if (dateNEW === '') {
      Toast.show({
        type: 'error',
        text1: 'Please select date & time',
      });
    }
    if (data.newProject.description === '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter task description',
      });
    }
    if (data.newProject.title === '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter task title',
      });
    } else {
      const payload = {
        title: data.newProject.title,
        description: data.newProject.description,
        date: dateNEW,
        location: JSON.stringify(location),
        status: 'ongoing',
        isRepeat: checkboxState,
        userId: 3,
      };
      console.log('payload',payload);
      // setLoading(true);

      addTask(payload)
        .then(response => {
          if (response.error) {
            console.log('error__<', response.error);
            // showToast('try again');
            alert('error Please Check');
            return;
          }
         
          
          const payload = {
            userId: userData.id,
            taskId: response.data.task.id,
          };
          Toast.show({
            type: 'success',
            text1: 'Task added..',
          });
          handleUser(payload);
          getUsersData();
          handleNavigation('BottomStack');
        })
        .catch(error => {
          console.log('error-->', error);

          // showToast(error.responses);
        })
        .finally(() => {
          // setLoading(false);
        });
    }
  };

  const handleUser = payload => {
    addUserTask(payload)
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          // showToast('try again');
          alert('error Please Check');
          return;
        }
        console.log(
          '🚀 ~ file: index.js:120 ~ handleAddTask ~ payload.userData:',
          userData,
        );
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

  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal},
    });
    // handleAddTask();
  };
  const handleSetValue = (field, value) => {
    let {newProject} = data;

    if (field === 'selectedMembers') {
      let {selectedMembers} = newProject;
      const foundIndex = selectedMembers?.findIndex(a => a?.id === value?.id);
      if (foundIndex === -1) {
        selectedMembers.push(value);
      } else {
        selectedMembers = selectedMembers.filter(a => a?.id !== value?.id);
      }
      newProject['selectedMembers'] = selectedMembers;
    } else {
      newProject[field] = value;
    }

    setData(
      combineData(data, {
        newProject,
      }),
    );
  };

  const isSelectedMember = member => {
    let value;
    let {selectedMembers} = data?.newProject;
    const foundIndex = selectedMembers?.findIndex(a => a?.id == member?.id);
    if (foundIndex > -1) {
      value = true;
    }
    return value;
  };
  const [users, setUsers] = useState(null);
  const [visible1, setVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [dateNEW, setDate] = useState('');
  const [userData, setuserData] = useState(null);

  const showPicker = () => {
    setIsPickerShow(true);
  };
  const getUsersData = async () => {
    getAllUsers()
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          return;
        }
        const {data} = response;
        const newArr = data.filter(obj => obj.id !== userData.id);
        console.log('res', data);
        setUsers(newArr);

        // navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error-->', error);
        // showToast(error.responses);
      })
      .finally(() => {});
  };
  const getData = async () => {
    console.log('get user data');
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      setuserData(JSON.parse(jsonValue));

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  const onChange = value => {
    console.log("🚀 ~ file: index.js:239 ~ onChange ~ value:", value)
    // const newDate=value.toLocaleString()
    setDate(value.toString());
  };
  const onClose1 = () => {
    setVisible(false);
  };
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }
  return (
    <View style={styles.container}>
      <Toast position="bottom" bottomOffset={50} />
      <Provider>
        <ScrollView>
          <Text style={styles.boldText}>Create Task</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor="gray"
            style={styles.textInput}
            width={100}
            onChangeText={text => handleSetValue('title', text)}
          />
          <TextInput
            placeholder="Description"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={text => handleSetValue('description', text)}
          />
          <DatePicker
            locale={locale}
            title="Please select"
            mode="datetime"
            minDate={new Date()}
            maxDate={new Date(2029, 11, 3)}
            onChange={onChange}
            format="YYYY-MM-DD HH-MM">
            <Button width="100%" style={styles.btnWrapper}>
              <Text style={styles.btnText}>
                {dateNEW ? `${dateNEW}` : 'Select Date & time'}
              </Text>
            </Button>
          </DatePicker>

          <Button onPress={() => setVisible(true)} style={styles.btnWrapper}>
            <Text style={styles.btnText}>
              {location ? `${locationName}` : 'Select Location'}
            </Text>
          </Button>

          <Modal
            transparent={false}
            visible={visible1}
            animationType="slide-up"
            onClose={() => onClose1()}>
            <View style={{paddingVertical: 10}}>
              <View style={{height: 620}}>
                <LocationPicker chooseMessage={chooseMessage} />
              </View>
              <Button type="primary" onPress={onClose1}>
                Select
              </Button>
            </View>
          </Modal>

          <WingBlank
            style={{
              marginTop: 20,
              marginBottom: 20,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <BouncyCheckbox
              size={25}
              isChecked={checkboxState}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              text="Is Repetitive weekly"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('7')}
            />
            <BouncyCheckbox
              size={25}
              style={{marginTop: 5}}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              text="Is Repetitive monthly"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('30')}
              isChecked={checkboxState}
            />
            <BouncyCheckbox
              size={25}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              style={{marginTop: 5}}
              text="Is Reparative yearly"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('365')}
              isChecked={checkboxState}
            />
          </WingBlank>
          <Button onPress={() => handleAddTask()} style={styles.btnWrapper}>
            <Text style={styles.btnText}>Create Task</Text>
          </Button>

          {users && (
            <View style={styles.teamTextWrapper}>
              <Text style={styles.teamText}>Select Members</Text>
            </View>
          )}
          <View style={styles.teamSection}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.teamWrapper}>
                {users?.map(member => (
                  <TouchableOpacity
                    key={shortid.generate()}
                    style={[
                      styles.memberWrapper,
                      isSelectedMember(member)
                        ? styles.activeTeamWrapper
                        : null,
                    ]}
                    onPress={() => handleSetValue('selectedMembers', member)}>
                    <Image
                      style={styles.memberPhoto}
                      source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                      }}
                    />
                    <Text
                      style={[
                        styles.memberName,
                        isSelectedMember(member)
                          ? styles.activeMemberName
                          : null,
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {member?.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <Button
            onPress={() => handleBottomModal('')}
            style={styles.btnWrapperErr}>
            <Text style={styles.btnText}>close</Text>
          </Button>
        </ScrollView>
      </Provider>
    </View>
  );
}
