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
import shortid from 'shortid';
import styles from './createProjectStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import {getScreenParent} from '../../../utils/NavigationHelper';
import {navigateToNestedRoute} from '../../../navigators/RootNavigation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getAllUsers} from '../../../api/getAllUsers';
import {addTask} from '../../../api/addTask';
import LocationPicker from '../../../components/Task/MapView/index';
import locale from '../../../../node_modules/@ant-design/react-native//es/date-picker/locale/en_US';
// import Notifications from '../../../../src/utils/Notifications';

import {
  DatePicker,
  Button,
  Provider,
  WingBlank,
  Modal,
  Toast,
} from '@ant-design/react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export function CreateProject({}) {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers: []},
  });
  const [dateNoti, setDateNoti] = useState(new Date());
  const [location, setLocation] = useState('');
  const [checkboxState, setCheckboxState] = React.useState(false);

  // const setNotification = () => {
  //   // Notifications.schduleNotification(date);
  //   Notifications.schduleNotification(new Date(Date.now() + 5 * 1000));
  // };
  const chooseMessage = message => {
    console.log('🚀 ~ file: index.js:40 ~ chooseMessage ~ message:', message);
    setLocation(message);
  };

  const handleAddTask = () => {
    console.log(data);
    const payload = {
      title: data.newProject.title,
      description: data.newProject.description,
      date: date,
      location: JSON.stringify(location),
      status: 'ongoing',
      isRepeat:checkboxState,
      userId: 3,
    };
    console.log(payload);
    // setLoading(true);

    addTask(payload)
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
        handleNavigation('BottomStack');
      })
      .catch(error => {
        console.log('error-->', error);

        // showToast(error.responses);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  const showTimepicker = () => {
    showMode('time');
  };
  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };
  const handleLocation = async () => {
    await handleBottomModal('');
    console.log('toggleBottomModal');
    handleNavigation('LocationPicker');
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    hideDatePicker();
  };
  const handleBottomModal = bottomModal => {
    console.log(
      '🚀 ~ file: index.js:32 ~ handleBottomModal ~ bottomModal:',
      bottomModal,
    );
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal},
    });
    handleAddTask();
  };
  const handleSetValue = (field, value) => {
    console.log(
      '🚀 ~ file: index.js:90 ~ handleSetValue ~ field, value:',
      field,
      value,
    );
    let {newProject} = data;
    console.log(
      '🚀 ~ file: index.js:92 ~ handleSetValue ~ newProject:',
      newProject,
    );
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
    getAllUsers()
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          return;
        }
        const {data} = response;
        console.log('res', data);
        setUsers(data);

        // navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error-->', error);
        // showToast(error.responses);
      })
      .finally(() => {});
      getData();
  }, []);
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState('');
  const [userData, setuserData] = useState(null)

  const showPicker = () => {
    setIsPickerShow(true);
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      setuserData(jsonValue)
      return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch(e) {
      // error reading value
    }
  }
  const onChange = value => {
    console.log('🚀 ~ file: index.js:158 ~ onChange ~ value:', value);
    setDate(value);
    setDate(value);
  };
  const onClose1 = () => {
    setVisible(false);
  };
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

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
      <Provider>
        <ScrollView>
          <Text style={styles.boldText}>Create Task</Text>
          <TextInput
            width="200"
            placeholder="Title"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={text => handleSetValue('title', text)}
          />
          <TextInput
            placeholder="Description"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={text => handleSetValue('description', text)}
          />
          <DatePicker
            value={date}
            locale={locale}
            title="Please select"
            mode="datetime"
            defaultDate={new Date()}
            minDate={new Date(2015, 7, 6)}
            maxDate={new Date(2026, 11, 3)}
            onChange={onChange}
            format="YYYY-MM-DD HH-MM">
            <Button width="100%" style={styles.btnWrapper}>
              <Text style={styles.btnText}>Select Date</Text>
            </Button>
          </DatePicker>
          <Button onPress={() => setVisible(true)} style={styles.btnWrapper}>
            <Text style={styles.btnText}>Select Location</Text>
          </Button>
          <Modal
            transparent={false}
            visible={visible1}
            animationType="slide-up"
            onClose={() => onClose1()}>
            <View style={{paddingVertical: 10}}>
              <Button type="primary" onPress={onClose1}>
                Select
              </Button>
              <LocationPicker chooseMessage={chooseMessage} />
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
              text="Is Repeative weekly"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('7')}
            />
            <BouncyCheckbox
              size={25}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              text="Is Repeative monthly"
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
              text="Is Repeative yearly"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('365')}
              isChecked={checkboxState}
            />
          </WingBlank>
          <Button
            onPress={() => handleBottomModal('')}
            style={styles.btnWrapper}>
            <Text style={styles.btnText}>Create Task</Text>
          </Button>

          <View style={styles.teamTextWrapper}>
            <Text style={styles.teamText}>Select Members</Text>
          </View>
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
            <Text style={styles.btnText}>Cancel</Text>
          </Button>

        </ScrollView>
      </Provider>
    </View>
  );
}
