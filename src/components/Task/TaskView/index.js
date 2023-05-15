import React, {useContext,useEffect,useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import shortid from 'shortid';
import ProgressCircle from 'react-native-progress-circle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './taskViewStyle';
import {
  DatePicker,
  Button,
  Provider,
  WingBlank,
  Modal,
  Toast,
} from '@ant-design/react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import appTheme from '../../../constants/colors';
import {getAllUsers} from '../../../api/getAllUsers';

export function TaskView() {
  const {state, dispatch} = useContext(AuthContext);
  const {selectedTask} = state;
  const [users, setUsers] = useState(null);
  const [checkboxState, setCheckboxState] = React.useState('');
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
  }, []);
  const handleBottomModal = bottomModal => {
    console.log(
      '🚀 ~ file: index.js:32 ~ handleBottomModal ~ bottomModal:',
      bottomModal,
    );
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal},
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        {/* <View style={styles.taskProgressWrapper}>
          <ProgressCircle
            percent={selectedTask?.progress}
            radius={30}
            borderWidth={7}
            color="#6AC67E"
            shadowColor="#f4f4f4"
            bgColor="#fff">
            <Text style={styles.taskProgress}>{selectedTask?.progress}%</Text>
          </ProgressCircle>
        </View> */}
        <Text style={styles.taskTitle}>{selectedTask?.title}</Text>
      </View>
      <Text style={styles.taskTeamText}>Team</Text>
      <View style={styles.taskMembersWrapper}>
        {selectedTask?.users?.map(member => (
          <View>
            <Image
            key={shortid.generate()}
            style={styles.taskMemberPhoto}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />
          <Text style={styles.scheduleText}>{member?.username}</Text>
            </View>
        ))}
        <View>
        {/* <TouchableOpacity onPress={()=>handleBottomModal('')} style={styles.plusBtnContainer}>
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          
        </TouchableOpacity> */}
        <Text style={styles.scheduleText}>add</Text>

        </View>
      </View>
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
              isChecked={selectedTask.isRepeat==='ongoing'}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              text="Ongoing"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('7')}
            />
            <BouncyCheckbox
              size={25}
              fillColor="#3E9AE3"
              isChecked={selectedTask.isRepeat==='completed'}
              unfillColor="#FFFFFF"
              text="completed"
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('30')}
            />
            <BouncyCheckbox
              size={25}
              fillColor="#3E9AE3"
              unfillColor="#FFFFFF"
              text="Is Repeative yearly"
              isChecked={selectedTask.isRepeat==='canceled'}
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={() => setCheckboxState('365')}
            />
          </WingBlank>
      <View style={styles.scheduleWrapper}>
        <View style={styles.scheduleRow}>
          <MaterialCommunityIcons
            name="clock"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.scheduleText}>1:30PM - 2:00PM</Text>
        </View>
        <View style={styles.scheduleRow}>
          <AntDesign
            name="calendar"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.scheduleText}>June 13 2021</Text>
        </View>
      </View>
      <Text style={styles.longText}>
      {selectedTask?.description}
      </Text>
      <Button
            onPress={() => handleBottomModal('')}
            style={styles.btnWrapperErr}>
            <Text style={styles.btnText}>close</Text>
          </Button>
    </View>
  );
}
