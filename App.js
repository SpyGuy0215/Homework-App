import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screens/signIn';
import SignUpScreen from './screens/signUp';
import HomeScreen from './screens/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNav  from './navigators/stackNavigator';
import AdminPage from './screens/adminPage';
import AddTeacherScreen from './screens/addTeacher';
import AdminSignUpScreen from './screens/adminSignUp';

const Drawer = createDrawerNavigator();

LogBox.ignoreAllLogs();

export default class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator swipeEnabled='false' screenOptions={{headerShown: false, swipeEnabled: false}} options={{swipeEnabled: false}}>
          <Drawer.Screen name='Home' component={StackNav}/>
          <Drawer.Screen name='Admin' component={AdminPage}/>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
