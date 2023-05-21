import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import shortid from 'shortid';
import styles from './projectsStyle';
import {AuthContext} from '../../context';
import {
  TabScreenHeader,
  ProjectCard,
  EmptyListComponent,
} from '../../components';
import {combineData} from '../../utils/DataHelper';
import {getAllTask} from '../../api/getAllTask';
import appTheme from '../../constants/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MembersTask({navigation}) {
  const tabs = ['All', 'Ongoing', 'Completed'];

  const {state, dispatch} = useContext(AuthContext);
  const {projects} = state;
  const [task, setTasks] = useState([]);
  const [userData, setuserData] = useState(null);
  const [data, setData] = useState({activeTab: 'All'});
  useEffect(async () => {
    await getData();
    await getAllTask()
      .then(response => {
        if (response.error) {
          console.log('error__<', response.error);
          return;
        }
        const {data} = response;
        console.log('res', data);
        setTasks(data);

        // navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error-->', error);
        // showToast(error.responses);
      })
      .finally(() => {});
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      console.log('🚀 ~ file: index.js:55 ~ getData ~ jsonValue:', jsonValue);
      setuserData(JSON.parse(jsonValue));
      return 22;
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const getProjects = async () => {
    const tasksTo = await task.filter(element =>
      element?.users.some(subElement => subElement?.id === userData?.id),
    );
    console.log('🚀 ~ file: index.js:77 ~ getProjects ~ tasksTo:', tasksTo);
    return tasksTo;
  };
  const renderProjectInfo = ({item}) => {
    console.log('🚀 ~ file: index.js:81 ~ renderProjectInfo ~ item:', item);
    return (
      <ProjectCard
        project={item}
        key={shortid.generate()}
        navigation={navigation}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => (
          <Text style={styles.headerTitle}>Friends Task</Text>
        )}
        isSearchBtnVisible={false}
        isMoreBtnVisible={true}
      />

      <View style={styles.projectsBody}>
        {getProjects().length > 0 ? (
          <FlatList
            data={getProjects()}
            keyExtractor={(item, index) => shortid.generate()}
            renderItem={renderProjectInfo}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyListComponent />
        )}
      </View>
    </SafeAreaView>
  );
}
