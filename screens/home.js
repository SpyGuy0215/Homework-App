import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard, RefreshControl} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, FlatList, Center, Fab, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link, Spinner, Badge, ScrollView } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
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
            refreshing: false,
            homeworkDoneFor: []
        }
    }

    onAddTeacherClick = () => {
        this.props.navigation.navigate('AddTeacher')
    }

    getTeachersList = async() => {
        await db.collection('users').where('email', '==', this.state.email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.data())
                this.setState({
                    teachersList: doc.data().teachersList
                })
            })
        })
        console.log('getTeachersList ended')

        }

    getHomework = async() => {
        this.setState({
            refreshing: true,
        })
        console.log('getting homework')
        console.log(this.state.teachersList.length)
        this.setState({
            userHomeworkList: []
        })
        for(let i = 0; i < this.state.teachersList.length; i++) {
            console.log('i is: ' + i)
            await db.collection('homework').where('teacherID', '==', this.state.teachersList[i]).get()
            .then(snapshot => {
                console.log(this.state.teachersList[i])
                snapshot.forEach(doc => {
                    console.log(doc.data())
                    console.log('adding homework')
                    this.setState({
                        userHomeworkList: [...this.state.userHomeworkList, doc.data()]
                    })
                    }
            )
        })

        console.log(this.state.userHomeworkList)


        console.log('removing already done homework')
        for(let i = 0; i < this.state.userHomeworkList.length; i++) {
            console.log('i is: ' + i)
            if(this.state.userHomeworkList[i].homeworkDoneFor.includes(this.state.username)) {
                console.log('homework already done')
                this.setState({
                    homeworkDoneFor: this.state.homeworkDoneFor.splice(i, 1)
                })
        }}

        console.log('done getting homework')

        this.setState({
            gotHomework: true,
            refreshing: false
        })
    }}
    
            

    getUserInfo = async() => {
        await db.collection('users').where('email', '==', this.state.email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    username: doc.data().username
                })
            })
        })
        console.log(this.state.username)
    }

    openSideDrawer = () => {
        this.props.navigation.toggleDrawer()
    }

    removeHomework = async(item) => {
        let docID = ''
        console.log(item)
        console.log('removing homework')
        await db.collection('homework').where('title', '==', item.title).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                docID = doc.id
                if(doc.data().homeworkDoneFor === undefined) {
                    this.setState({
                        homeworkDoneFor: [this.state.username]
                    })
                }
                    else {
                        this.setState({
                            homeworkDoneFor: doc.data().homeworkDoneFor.push(this.state.username)
                        })
                    }
                }
            )
        })
        await db.collection('homework').doc(docID).update({
            homeworkDoneFor: this.state.homeworkDoneFor
        })
    }

    componentDidMount = async() => {
        await this.getUserInfo()
        await this.getTeachersList()
        console.log('going to this.getHomework()...')
        await this.getHomework()
    }


    render() {
        return(
            <NativeBaseProvider>
                <Box flex={1} w='100%' mx='auto' mt='5'>
                    <HStack>
                        <Button mr='5' variant='unstyled' onPress={this.openSideDrawer}>
                            <Icon size='sm' mt='01' as={<FontAwesome5 name='bars' color='coolGray.500' />} />
                        </Button>
                        <Heading style={{marginLeft: RFValue(57), marginTop: 9}}>Homework</Heading>
                    </HStack>
                        {this.state.gotHomework ? 
                        <ScrollView
                            refreshControl={
                                <RefreshControl 
                                refreshing={this.state.refreshing}
                                onRefresh={this.getHomework}
                                tintColor='#3b82f6'
                                />
                            }
                        >
                            <FlatList 
                                data={this.state.userHomeworkList}
                                style={{marginTop: RFValue(10), width: '100%', marginLeft: 'auto', marginRight: 'auto'}}
                                renderItem={({item}) => (
                                    <>
                                    <Box>
                                        <BouncyCheckbox text={item.title} style={{marginLeft: 20, marginBottom: 10}} size={40} fillColor='#3b82f6' onPress={() => {this.removeHomework(item)}} />
                                    </Box>
                                    </>
                                )}
                            ></FlatList>
                        </ScrollView>
                        : <Spinner color='blue.500' />}
                    <Fab size='lg' colorScheme='blue' onPress={this.onAddTeacherClick} icon={<Icon style={{marginLeft: 3}} as={<FontAwesome5 name='plus'/>}/>} placement='bottom-right' />
                </Box>
            </NativeBaseProvider>
        )
    }
}