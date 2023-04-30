import React, {useState, useContext,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import shortid from 'shortid';
import styles from './createProjectStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import {getScreenParent} from '../../../utils/NavigationHelper';
import {navigateToNestedRoute} from '../../../navigators/RootNavigation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {getAllUsers} from '../../../api/getAllUsers';
import {addTask} from '../../../api/addTask';

export function CreateProject({}) {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers: []},
  });
  const [date, setDate] = useState(new Date(1598051730000));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePicker.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };
  const handleAddTask = () => {
  console.log(data)
    const payload = {
      title:data.newProject.title,
      description:data.newProject.description,
      date:"date",
      location:"location",
      "userId": 3
    };
    console.log(payload);
    // setLoading(true);
  
    addTask(payload)
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          // showToast('try again');
          alert('error Please Check')
          return;
        }
        const {data} = response;
        console.log('res', response.data);
  
        console.log('token', data.accessToken);
        handleNavigation('BottomStack')
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
  const handleLocation=async()=>{
    await handleBottomModal('')
    console.log('toggleBottomModal')
    handleNavigation('LocationPicker')

  }
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };
  const handleBottomModal = bottomModal => {
    console.log("🚀 ~ file: index.js:32 ~ handleBottomModal ~ bottomModal:", bottomModal)
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal},
    });
    handleAddTask()
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
    const foundIndex = selectedMembers?.findIndex(
      a => a?.id?.toLowerCase() == member?.id?.toLowerCase(),
    );
    if (foundIndex > -1) {
      value = true;
    }
    return value;
  };
  const [users, setUsers] = useState(null);

  useEffect(() => {
    getAllUsers()
    .then(response => {
      if (response.error) {
        console.log('error__<', response.error);
        return;
      }
      const {data} = response;
      console.log('res', data);
      setUsers(data)

      // navigation.navigate('Home');
    })
    .catch(error => {
      console.log('error-->', error);
      // showToast(error.responses);
    })
    .finally(() => {});
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>Create Task</Text>
      <TextInput
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
                  isSelectedMember(member) ? styles.activeTeamWrapper : null,
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
                    isSelectedMember(member) ? styles.activeMemberName : null,
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
      {/* <TouchableOpacity  onPress={() => handleLocation('')} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Select Location</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity  onPress={() => showDatePicker()} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Pick date</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={()=> handleBottomModal('')} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
