import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, FlatList, Center, Fab, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link, Spinner, Badge } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase';
import db from '../config'
import MMKVStorage, {create} from 'react-native-mmkv-storage';


const storage = new MMKVStorage.Loader().withEncryption().initialize()
const useStorage = create(storage)

export default class HomeScreen extends React.Component {
    constructor() {
        super()
        this.state={
            email: firebase.auth().currentUser.email,
            username: '',
            teachersList: [],
            userHomeworkList: [],
            gotHomework: false,
        }
    }

    onAddTeacherClick = () => {
        this.props.navigation.navigate('AddTeacher')
    }

    getTeachersList = async() => {
        await db.collection('otherInfo').doc('subjectList').get()
        .then(snapshot => {
            this.setState({
                subjectList: snapshot.data().subjects
            })
        })

        await db.collection('teachers').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    teachersList: [...this.state.teachersList, doc.data()]
                })
            })
        })
        console.log('getTeachersList ended')

        }

    getHomework = async() => {
        console.log('getting homework')
        console.log(this.state.teachersList.length)
        for(let i = 0; i < this.state.teachersList.length; i++) {
            console.log('i is: ' + i)
            await db.collection('homework').where('teacherID', '==', this.state.teachersList[i].teacherID).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.data())
                    this.setState({
                        userHomeworkList: [...this.state.userHomeworkList, doc.data()]
                    })
                })
            })
        }

        console.log(this.state.userHomeworkList)
        console.log('done getting homework')

        this.setState({
            gotHomework: true
        })
    }

    componentDidMount = async() => {
        await this.getTeachersList()
        console.log('going to this.getHomework()...')
        await this.getHomework()
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
                        {this.state.gotHomework ? 
                        <FlatList 
                            data={this.state.userHomeworkList}
                            style={{marginTop: RFValue(10), width: '100%', marginLeft: 'auto', marginRight: 'auto'}}
                            renderItem={({item}) => (
                                <Box>
                                    <Text>{item.title}</Text>
                                </Box>
                            )}
                        ></FlatList>
                        : <Spinner color='blue.500' />}
                    <Fab size='lg' colorScheme='blue' onPress={this.onAddTeacherClick} icon={<Icon style={{marginLeft: 3}} as={<FontAwesome5 name='plus'/>}/>} placement='bottom-right' />
                </Box>
            </NativeBaseProvider>
        )
    }
}