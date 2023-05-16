import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import shortid from 'shortid';
import PushNotification from 'react-native-push-notification';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './dashboardStyle';
import {AuthContext} from '../../context';
import {TabScreenHeader, TaskInfo, EmptyListComponent} from '../../components';
import {formatCurrentDate} from '../../utils/DataHelper';
import appTheme from '../../constants/colors';
import {getAllTask} from '../../api/getAllTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Dashboard() {
  const {state, dispatch} = useContext(AuthContext);
  let {tasks} = state;
  const [open, setOpen] = useState(false);
  const [task, setTasks] = useState([]);
  const [value, setValue] = useState(null);
  const [userData, setuserData] = useState(null);
  const [items, setItems] = useState([
    {label: 'All Tasks', value: 'All Tasks'},
    {label: 'Ongoing', value: 'Ongoing'},
    {label: 'Completed', value: 'Completed'},
  ]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      setuserData(JSON.parse(jsonValue));
      console.log(JSON.parse(jsonValue));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  const getTasks = () => {
    let tasksToRender = task;
    if (!value || value === 'All Tasks') {
      console.log(task);
      tasksToRender = task;
    } else if (value === 'Ongoing') {
      tasksToRender = task.filter(task => task.status === 'ongoing') || [];
    } else if (value === 'Completed') {
      tasksToRender = task.filter(task => task.status === 'completed') || [];
    }

    const tasksTo = tasksToRender.filter(element =>
      element?.users.some(subElement => subElement?.id === userData?.id),
    );
    return tasksTo.reverse();
  };
  useEffect(async() => {
    test();
   await getAllTask()
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          return;
        }
        const {data} = response;

        setTasks(data);
        handleCreateTask(data);

        // navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error-->', error);
        // showToast(error.responses);
      })
      .finally(() => {});

  }, []);
  const test = () => {
    getData();
  };
  const handleCreateTask = (data) => {
    task.map(item => console.log('not 📅 ', new Date(item.date)))
   
    // console.log('not 🧮 ', data);
    task.map(item =>
      PushNotification.localNotificationSchedule({
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: item.title, // (optional)
        message: item.description, // (required)
        date: new Date(item.date), // in 60 secs
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      }),
    );
  };

  return (
    <SafeAreaView>
      <TabScreenHeader
        leftComponent={() => (
          <View style={styles.flexRow}>
            <Text style={styles.headerLeftText}>{formatCurrentDate()}</Text>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#000"
            />
          </View>
        )}
        isSearchBtnVisible={false}
        isMoreBtnVisible={false}
        taskData={task}
      />
      <View style={styles.contentBody}>
        <View style={styles.statisticsSection}>
          <Text style={styles.contentTitle}>Today</Text>
          <View style={styles.statisticsContainer}>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.PRIMARY_COLOR},
              ]}>
              <FontAwesome
                name="refresh"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>2</Text>
                <Text style={styles.statisticsTitle}>Ongoing</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR1},
              ]}>
              <Feather
                name="clock"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>1</Text>
                <Text style={styles.statisticsTitle}>Team Tasks</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR2},
              ]}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>1</Text>
                <Text style={styles.statisticsTitle}>Repeating Tasks</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR3},
              ]}>
              <MaterialCommunityIcons
                name="file-remove-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>
                  {task.filter(task => task?.status === 'canceled').length}
                </Text>
                <Text style={styles.statisticsTitle}>Cancelled</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <TouchableOpacity
              style={styles.tasksRow}
              onPress={() => handleCreateTask()}>
              <Text style={styles.tasksLeftText}>Test</Text>
              <View style={styles.plusBtnContainer}>
                <MaterialCommunityIcons name="plus" size={19} color="#fff" />
              </View>
            </TouchableOpacity>
            <DropDownPicker
              placeholder="All Tasks"
              placeholderStyle={{fontSize: 15}}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={{
                width: 130,
              }}
              style={{
                borderColor: 'transparent',
                backgroundColor: 'transparent',
              }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderColor: 'transparent',
              }}
              labelStyle={{
                fontSize: 15,
              }}
            />
          </View>
          <View style={styles.tasksBody}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tasksList}>
                {getTasks()?.map(task => (
                  <TaskInfo task={task} key={shortid.generate()} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// https://stackoverflow.com/questions/65035612/sequelize-adduser-is-not-a-function
