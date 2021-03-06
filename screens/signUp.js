import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link, WarningOutlineIcon } from 'native-base';
import firebase from 'firebase';
import db from '../config'


export default class SignUpScreen extends React.Component {
    constructor() {
        super()
        this.state = {
          user: null,
          overlayIsVisible: false,
          show: false,
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          usernameAlreadyExists: false,
          passwordAndConfirmPasswordDoNotMatch: false,
          emailIsBadlyFormattted: false,
          passwordLengthNotMet: false,
          }
        }

      showClick = () => {
        this.setState({
          show: !this.state.show
        })
      }

      onSignUpClick = () =>{
        db.collection('users').where('username', '==', this.state.username).get()
        .then((snapshot) => {
          console.log(snapshot.docs.length)
          if(snapshot.docs.length > 0) {
            this.setState({
              usernameAlreadyExists: true
            })
          } 
          else {
            if(this.state.usernameAlreadyExists) {
              this.setState({
                usernameAlreadyExists: false
              })
            }

          }
      })

      if(this.state.password === this.state.confirmPassword) {
        this.setState({
          passwordAndConfirmPasswordDoNotMatch: false
        })
      }
      else{
          this.setState({
            passwordAndConfirmPasswordDoNotMatch: true
          })
        }

      if(this.state.password.length < 6) {
        this.setState({
          passwordLengthNotMet: true
        })
      }
      else{
        this.setState({
          passwordLengthNotMet: false
        })
      }

      if(this.state.passwordAndConfirmPasswordDoNotMatch === false && this.state.usernameAlreadyExists === false) {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(
          this.setState({
            emailIsBadlyFormattted: false,
          })
        )
        .catch((error) => {
          console.log(error.code)
          if(error.code === 'auth/invalid-email') {
            this.setState({
              emailIsBadlyFormattted: true
            })
            console.log(this.state.emailIsBadlyFormattted)
          }
        })
    }

    console.log(this.state)

    if(this.state.emailIsBadlyFormattted === false && this.state.passwordLengthNotMet === false && this.state.usernameAlreadyExists === false && this.state.passwordAndConfirmPasswordDoNotMatch === false) {
      db.collection('users').add({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        teachersList: []
      })
      this.props.navigation.navigate('Sign In')
    }
  }
    
  
    render() {
        return(
            <NativeBaseProvider>
            <StatusBar style="auto" />
            <Box safeArea flex={1} p='2' py='8' w='90%' mx='auto'>
              <Heading size='lg' fontWeight='600' color='coolGray.800'>
                Sign Up
              </Heading>
              <VStack space='3' mt='5'>
                <FormControl isInvalid={this.state.emailIsBadlyFormattted}>
                  <FormControl.Label
                    _text={{
                      color:'coolGray.800',
                      fontSize: 'xs',
                      fontWeight: 500
                    }}>
                      Email
                    </FormControl.Label>
                    <Input onChangeText={(value) => {this.setState({email: value})}} />
                    {this.state.emailIsBadlyFormattted === true ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>Invalid Email</FormControl.ErrorMessage> : null}
                  </FormControl>
                  <FormControl isInvalid={this.state.usernameAlreadyExists}>
                  <FormControl.Label
                    _text={{
                      color:'coolGray.800',
                      fontSize: 'xs',
                      fontWeight: 500
                    }}>
                      Username
                    </FormControl.Label>
                  <Input onChangeText={(value) => {this.setState({username: value})}} />
                  {this.state.usernameAlreadyExists === true ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>Username is taken</FormControl.ErrorMessage> : null}
                  </FormControl>
                  <FormControl isInvalid={this.state.passwordLengthNotMet}>
                  <FormControl.Label
                    _text={{
                      color:'coolGray.800',
                      fontSize: 'xs',
                      fontWeight: 500
                    }} >
                      Password
                  </FormControl.Label>
                  <Input onChangeText={(value) => {this.setState({password: value})}} type={this.state.show ? 'text' : 'password'} 
                  InputRightElement={
                    <Button onPress={this.showClick} variant='unstyled'>
                      <Icon as={this.state.show ? <FontAwesome5 name='eye-slash' color='coolGray.500' /> : <FontAwesome5 name='eye' color='coolGray.500' />} size={5} pr='6' />
                    </Button>
                  }
                  />
                  {this.state.passwordLengthNotMet === true ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>Password must be at least 6 characters</FormControl.ErrorMessage> : null}
                  </FormControl>
                  <FormControl isInvalid={this.state.passwordAndConfirmPasswordDoNotMatch}>
                  <FormControl.Label
                    _text={{
                      color:'coolGray.800',
                      fontSize: 'xs',
                      fontWeight: 500
                    }} >
                      Confirm Password
                  </FormControl.Label>
                  <Input onChangeText={(value) => {this.setState({confirmPassword: value})}} type={this.state.show ? 'text' : 'password'} 
                  InputRightElement={
                    <Button onPress={this.showClick} variant='unstyled'>
                      <Icon as={this.state.show ? <FontAwesome5 name='eye-slash' color='coolGray.500' /> : <FontAwesome5 name='eye' color='coolGray.500' />} size={5} pr='6' />
                    </Button>
                  }
                  />
                   {this.state.passwordAndConfirmPasswordDoNotMatch === true ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>Does not match password</FormControl.ErrorMessage> : null}
                  </FormControl>
                  <Button onPress={this.onSignUpClick} mt='2' colorScheme='blue' _text={{color: 'white'}}>
                    Sign Up!
                  </Button>
                  <HStack mt='6' justifyContent='center'>
                    <Link _text={{
                      fontWeight: 'medium',
                      fontSize: 'sm',
                      }} onPress={() => {this.props.navigation.navigate('Admin Sign Up')}}>
                      Admin Page 
                    </Link>
                  </HStack>
              </VStack>
            </Box>
          </NativeBaseProvider>
        )
    }
  }
