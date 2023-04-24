import React, {useState, useContext} from 'react';
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


export function CreateProject({}) {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers: []},
  });
  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };
  const handleLocation=async()=>{
    await handleBottomModal('')
    console.log('toggleBottomModal')
    handleNavigation('LocationPicker')

  }
  const handleBottomModal = bottomModal => {
    console.log("🚀 ~ file: index.js:32 ~ handleBottomModal ~ bottomModal:", bottomModal)
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal},
    });
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
       <TextInput
        placeholder="Date and Time"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('Date and Time', text)}
      />
      <View style={styles.teamTextWrapper}>
        <Text style={styles.teamText}>Select Members</Text>
      </View>
      <View style={styles.teamSection}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.teamWrapper}>
            {members?.map(member => (
              <TouchableOpacity
                key={shortid.generate()}
                style={[
                  styles.memberWrapper,
                  isSelectedMember(member) ? styles.activeTeamWrapper : null,
                ]}
                onPress={() => handleSetValue('selectedMembers', member)}>
                <Image
                  style={styles.memberPhoto}
                  source={{uri: member?.photo}}
                />
                <Text
                  style={[
                    styles.memberName,
                    isSelectedMember(member) ? styles.activeMemberName : null,
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {member?.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity  onPress={() => handleLocation('')} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Select Location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> handleBottomModal('')} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
