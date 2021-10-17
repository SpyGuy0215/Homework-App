import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import SignInScreen from '../screens/signIn';
import SignUpScreen from '../screens/signUp';
import HomeScreen from '../screens/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AddTeacherScreen from '../screens/addTeacher';
import AdminSignUpScreen from '../screens/adminSignUp';

const Stack = createNativeStackNavigator();

export default class StackNav extends React.Component {
    render() {
        return(
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Sign In" component={SignInScreen}/>
                <Stack.Screen name="Sign Up" component={SignUpScreen}/>
                <Stack.Screen name="Admin Sign Up" component={AdminSignUpScreen}/>
                <Stack.Screen name='Home' component={HomeScreen}/>
                <Stack.Screen name='AddTeacher' component={AddTeacherScreen}/>
            </Stack.Navigator>
        )
    }
}