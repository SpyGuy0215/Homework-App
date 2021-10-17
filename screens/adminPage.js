import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, FlatList, Center, Fab, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link, Spinner, Badge } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import firebase from 'firebase';
import db from '../config'
import MMKVStorage, {create} from 'react-native-mmkv-storage';

export default class AdminPage extends React.Component {

    constructor() {
        super()
        this.state={
            email: firebase.auth().currentUser.email,
            homeworkName: '',
            homeworkTeacherID: '',
        }
    }

    openSideDrawer = () => {
        this.props.navigation.toggleDrawer()
    }

    addHomework = () => {
 
        db.collection('homework').add({
            title: this.state.homeworkName,
            teacherID: this.state.homeworkTeacherID,
            homeworkDoneFor: []
        })
    }

    render() {
        return(
            <NativeBaseProvider>
                <HStack safeArea>
                    <Button variant='unstyled' onPress={this.openSideDrawer}>
                        <Icon size='sm' mt='01' as={<FontAwesome5 name='bars' color='coolGray.500' />} />
                    </Button>
                    <Heading style={{marginLeft: RFValue(105), marginTop: 9}}>Admin</Heading>
                </HStack>
                <Box flex={1} w='90%' mx='auto'>
                    <VStack space='3'>
                        <Box>
                            <Heading size='sm' style={{marginTop: RFValue(40)}}>Add Homework</Heading>
                            <FormControl>
                                <Input onChangeText={(value) => {
                                    this.setState({homeworkName: value})
                                }} mb='3' mt='2' placeholder='Homework Name' />
                            </FormControl>

                            <FormControl>
                                <Input onChangeText={(value) => {
                                    this.setState({homeworkTeacherID: value})
                                }} placeholder='Teacher ID' />
                            </FormControl>

                            <Button onPress={this.addHomework} mt='5' colorScheme='blue' _text={{color: 'white'}}>
                                Add Homework
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </NativeBaseProvider>
        )
    }
}