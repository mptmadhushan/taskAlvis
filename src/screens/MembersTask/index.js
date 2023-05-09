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

export function MembersTask({navigation}) {
  const tabs = ['All', 'Ongoing', 'Completed'];

  const {state, dispatch} = useContext(AuthContext);
  const {projects} = state;
  const [task, setTasks] = useState([]);
  const [data, setData] = useState({activeTab: 'All'});
  useEffect(() => {
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
  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const getProjects = (test) => {
    console.log("🚀~ getProjects ~ test:", test)
    if(test){
     let projectsToRender=test
      return projectsToRender;
    }else{
    var surname = 1;
    let projectsToRender = task.filter(element =>
      element.users.some(subElement => subElement.id === surname),
    );

    for (var data in projectsToRender) {
      projectsToRender[data].subElements = {id: id};
    }
    return projectsToRender;
}

  };
  const toggleSearchField = (x) => {
    console.log("🚀 toggleSearchField ~ x:", x,task)
    let sam = task.filter((a)=>{if(a.title==x){return a}});
    console.log("🚀 ~ file: index.js:79 ~ toggleSearchField ~ sam:", sam)
    getProjects(sam)
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
        leftComponent={() => (
          <Text style={styles.headerTitle}>Friends Task</Text>
        )}
        isSearchBtnVisible={false}
        isMoreBtnVisible={true}
      />
      {/* <View style={styles.searchInputWrapper}>
        <TextInput
          placeholder="Search"
          style={styles.searchInputField}
          onChange={ (text) => {
            console.log(text.nativeEvent.text)
            toggleSearchField(text.nativeEvent.text)
               }
            }
         
          placeholderTextColor={appTheme.INACTIVE_COLOR}
        />

      </View> */}
      <View style={styles.projectsBody}>
        {/* <View style={styles.projectsTabs}>
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
        </View> */}
        {task?.length > 0 ? (
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
