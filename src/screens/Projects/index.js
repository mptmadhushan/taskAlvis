import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
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

export function Projects({navigation}) {
  const tabs = ['All', 'Ongoing', 'Completed'];

  const {state, dispatch} = useContext(AuthContext);
  const [task, setTasks] = useState([]);
  const [userData, setuserData] = useState(null);

  const {projects} = state;
  useEffect(() => {
    test();
    getAllTask()
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
  const test = () => {
    getData();
  };
  const getTasks = () => {
    let {activeTab} = data;

    let tasksToRender = task;
    if (activeTab === 'All Tasks') {
      console.log(task);
      tasksToRender = task.filter(task => task.status === 'all tasks') || [];
    } else if (activeTab === 'Ongoing') {
      tasksToRender = task.filter(task => task.status === 'ongoing') || [];
    } else if (activeTab === 'Completed') {
      tasksToRender = task.filter(task => task.status === 'completed') || [];
    }
    const tasksTo = tasksToRender.filter(element =>
      element?.users.some(subElement => subElement?.id === userData?.id),
    );
    return tasksTo;
  };
  const [data, setData] = useState({activeTab: 'All'});
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
  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const getProjects = () => {
    let {activeTab} = data;
    let projectsToRender = [];
    if (activeTab === 'All') {
      projectsToRender = projects;
    } else {
      projectsToRender =
        projects?.filter(
          project => project.status === activeTab?.toLowerCase(),
        ) || [];
    }

    return projectsToRender;
  };

  const renderProjectInfo = ({item}) => {
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
        leftComponent={() => <Text style={styles.headerTitle}>Tasks</Text>}
        isSearchBtnVisible={true}
        isMoreBtnVisible={true}
      />
      <View style={styles.projectsBody}>
        <View style={styles.projectsTabs}>
          {tabs?.map(tab => (
            <TouchableOpacity
              style={[
                styles.projectTab,
                isActiveTab(tab) ? styles.activeProjectTab : null,
              ]}
              onPress={() => toggleTab(tab)}
              key={shortid.generate()}>
              <Text
                style={[
                  styles.projectTabText,
                  isActiveTab(tab)
                    ? styles.activeProjectTabText
                    : styles.inActiveProjectTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {task?.length > 0 ? (
          <FlatList
            data={getTasks()}
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
