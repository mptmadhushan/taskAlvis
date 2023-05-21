import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import shortid from 'shortid';
import styles from './projectCardStyle';
import appTheme from '../../../constants/colors';
import {navigateToNestedRoute} from '../../../navigators/RootNavigation';
import {getScreenParent} from '../../../utils/NavigationHelper';
let Image_Http_URL ={ uri: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png'};

export function ProjectCard({isRep,project, navigation}) {
  console.log("🚀 ~ file: index.js:13 ~ ProjectCard ~ project:", project)
  const handleNavigation = (screen, params) => {
    // navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigation('Project', project)}>
      <Text style={styles.projectTitle}>{project?.title}</Text>
      <View style={styles.projectTeamAndProgress}>
        <View>
          <Text style={styles.projectDescription}>{project?.description}</Text>
          <Text style={styles.projectTeamTitle}>Team</Text>
          <View style={styles.projectTeamWrapper}>
            {project?.users?.map(member => (
            <View>
                <Image
                key={shortid.generate()}
                style={styles.projectMemberPhoto}
                source={Image_Http_URL}
              />
              <Text>{member.username}</Text>
              </View>
            ))}
            
          </View>
        </View>
        {/* <ProgressCircle
          percent={project?.progress}
          radius={40}
          borderWidth={8}
          color="#6AC67E"
          shadowColor="#f4f4f4"
          bgColor="#fff">
          <Text style={styles.projectProgress}>{project?.progress}%</Text>
        </ProgressCircle> */}
      </View>
      <View style={styles.rowJustifyBetween}>
        <View style={styles.flexRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          {!isRep?<Text style={styles.projectBottomText}>{project?.createdAt}</Text>:<Text style={styles.projectBottomText}>Every {project?.isRepeat} days</Text>}
        </View>
        {/* <View style={styles.flexRow}>
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.projectBottomText}>{project?.tasks} Tasks</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
}
