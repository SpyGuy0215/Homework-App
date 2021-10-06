import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, Spinner, Pressable, Center, Checkbox, Fab, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link, SectionList, List, FlatList } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import firebase from 'firebase';
import db from '../config'

export default class AddTeacherScreen extends React.Component {
    constructor(){
        super()
        this.state = {
            teachersList: [],
            subjectList: [],
            search: '',
            searchList: [],
            username: '',
            email: firebase.auth().currentUser.email,
            userDocID: '',
            userTeacherList: ['hello'],
            rerendermessage: '',
        }
    }

    getTeacherList = async() => {
        await db.collection('otherInfo').doc('subjectList').get()
        .then(snapshot => {
            console.log(snapshot.data())
            this.setState({
                subjectList: snapshot.data().subjects
            })
            console.log(this.state.subjectList)
        })

        await db.collection('teachers').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.group()
                console.log(doc.data())
                console.groupEnd()
                this.setState({
                    teachersList: [...this.state.teachersList, doc.data()]
                })
            })
        })

        }

        searchForTeacher = () => {
            this.setState({
                searchList: this.state.teachersList
            })

            console.log(this.state.teachersList)

            let tempList = []

            if(this.state.search !== ''){
                tempList = this.state.searchList.filter(this.searchParams)
            }
            else{
                tempList = this.state.teachersList
            }

            console.log(tempList)
            this.setState({
                searchList: tempList
            })
        }

        searchParams = (item) => {
            return item.teacherID.includes(this.state.search.toLowerCase())
        }

        addTeacher = (teacherID) => {

            let tempList = this.state.userTeacherList
            console.log('adding teacher...')

            if(tempList.includes(teacherID)){
                for(var i = 0; i < tempList.length; i++){
                    if(tempList[i] == teacherID){
                        tempList.splice(i, 1)
                    }
                }
            }
            else {
                tempList.push(teacherID)
            }

            db.collection('users').doc(this.state.userDocID).update({
                teachersList: tempList
            })

            this.setState({
                userTeacherList: tempList
            })

            console.log(this.state.userTeacherList)
        }

        getUserInfo = async() => {
            await db.collection('users').where('email', '==', this.state.email).get()
            .then(snapshot => {
                console.log('snapshot')
                snapshot.forEach(doc => {
                    this.setState({
                        username: doc.data().username,
                        userTeacherList: doc.data().teachersList,
                        userDocID: doc.id
                    })
                })
            })
        }

    render() {
        return(
            <NativeBaseProvider>
                <Box flex={1} w='90%' mx='auto' mt='5'>
                    <Input placeholder='Find Teachers' borderRadius='4' py='3'   mb='5' px='1' fontSize='14'
                    InputLeftElement={
                        <Icon size='17' marginRight='2' marginLeft = '1' as={<FontAwesome5 name='search' size={15} color='#000' />} />
                    } onChangeText={(value) => {
                        this.setState({
                            search: value
                        })
                        this.searchForTeacher()
                    }}/>
                    {this.state.userTeacherList[0] == 'hello' ? <Spinner></Spinner> : 
                        <FlatList data={this.state.searchList} renderItem={({item}) => (
                                <BouncyCheckbox
                                fillColor='#3b82f6'
                                text={item.firstName + ' ' + item.lastName}
                                size={40}
                                style={{marginBottom: 10}}
                                textStyle={{textDecorationLine: 'none'}}
                                onPress={() => {this.addTeacher(item.teacherID)}}
                                isChecked={this.state.userTeacherList.indexOf(item.teacherID) < 0 ? false : true}
                                >
                                </BouncyCheckbox>
                        )}>
                            
                        </FlatList>
                        }
                </Box>
            </NativeBaseProvider>
        )
    }

    async componentDidMount(){
        await this.getTeacherList()
        await this.searchForTeacher()
        await this.getUserInfo()
        console.log(this.state.teacherList)
        console.log(this.state.userTeacherList)
    }


}