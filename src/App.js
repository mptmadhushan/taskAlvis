import React, {useReducer} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import {BottomModalContainer} from './components';
import AppStack from './navigators/Stack';
import initialState from './store/state';
import reducer from './store/reducer';
import {AuthContext} from './context';
import {navigationRef} from './navigators/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}>
      <PaperProvider>
        <MenuProvider>
          <StatusBar barStyle="light-content" />
          <SafeAreaProvider style={styles.areaContainer}>
            <Toast />
            <NavigationContainer ref={navigationRef}>
              <AppStack />
            </NavigationContainer>
            {state?.bottomModal ? <BottomModalContainer /> : null}
          </SafeAreaProvider>
        </MenuProvider>
      </PaperProvider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    flex: 1,
  },
});

export default App;
