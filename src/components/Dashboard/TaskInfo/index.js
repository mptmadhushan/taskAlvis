import React, {useContext} from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ProgressBar} from 'react-native-paper';
import shortid from 'shortid';
import styles from './taskInfoStyle';
import appTheme from '../../../constants/colors';
import {AuthContext} from '../../../context';
let Image_Http_URL ={ uri: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png'};

export function TaskInfo({task}) {
  console.log("🚀 askInfo  task:", task)
  const {state, dispatch} = useContext(AuthContext);

  const handleBottomModal = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal: 'TaskView'},
    });

    dispatch({
      type: 'viewTask',
      payload: {selectedTask: task},
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => handleBottomModal()}>
      <View style={styles.container}>
        <AntDesign
          name="checksquareo"
          size={20}
          // color={
          //   task?.progress === 100 ? appTheme.COLOR2 : appTheme.INACTIVE_COLOR
          // }
          style={styles.taskProgressIndicator}
        />
        <View style={styles.taskMiddleColumn}>
          <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
            {task?.title}
          </Text>
          {/* <ProgressBar
            progress={Number(task?.progress)}
            color={task?.progress === 100 ? appTheme.COLOR2 : appTheme.COLOR1}
            style={styles.taskProgressBar}
          /> */}
        </View>
        <View style={styles.teamWrapper}>
          {/* {task?.members?.slice(0, 2)?.map(member => (
            <Image
              key={shortid.generate()}
              style={styles.memberPhoto}
              source={Image_Http_URL}
            />
          ))} */}
        </View>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={25}
          color={appTheme.INACTIVE_COLOR}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
