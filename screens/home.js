import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, Center, Fab, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase';
import db from '../config'


export default class HomeScreen extends React.Component {

    onAddTeacherClick = () => {
        this.props.navigation.navigate('AddTeacher')
    }

    render() {
        return(
            <NativeBaseProvider>
                <Box flex={1} w='100%' mx='auto' mt='5'>
                    <HStack>
                        <Button mr='5' variant='unstyled'>
                            <Icon size='sm' mt='01' as={<FontAwesome5 name='bars' color='coolGray.500' />} />
                        </Button>
                            <Heading style={{marginLeft: RFValue(57), marginTop: 9}}>Homework</Heading>
                    </HStack>
                    <Fab size='lg' colorScheme='blue' onPress={this.onAddTeacherClick} icon={<Icon style={{marginLeft: 3}} as={<FontAwesome5 name='plus'/>}/>} placement='bottom-right' />
                </Box>
            </NativeBaseProvider>
        )
    }
}