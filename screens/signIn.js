import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeBaseProvider, extendTheme, Box, Heading, VStack, HStack, FormControl, Input, Button, Icon, Link } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase';
import db from '../config'

const config= {
  useSystemColorMode: false,
  initialColorMode: 'light ',
}

const customTheme = extendTheme({ config })

export default class SignInScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: ' ',
      password: ' ',
      email: '',
      errorExists: false,
    }
  }

  showClick = () => {
    this.setState({
      show: !this.state.show
    })
  }

  onSignInClick = async() => {
    await db.collection('users').where('username', '==', this.state.username).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data())
        this.setState({
          email: doc.data().email
        })
        if(doc.data().password === this.state.password) {
          firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          this.props.navigation.navigate('Home')
        }
      })
    })
  
  }

  render() {
    return (
      <NativeBaseProvider theme={customTheme}>
        <StatusBar style="auto" />
        <Box safeArea flex={1} p='2' py='8' w='90%' mx='auto'>
          <Heading size='lg' fontWeight='600' color='coolGray.800'>
            Sign In
          </Heading>
          <VStack space='3' mt='5'>
            <FormControl>
              <FormControl.Label
                _text={{
                  color:'coolGray.800',
                  fontSize: 'xs',
                  fontWeight: 500
                }}>
                  Username
                </FormControl.Label>
              </FormControl>
              <Input onChangeText={(value) => {this.setState({username: value})}} />
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
              <Button onPress={this.onSignInClick} mt='2' colorScheme='blue' _text={{color: 'white'}}>
                Sign In
              </Button>

              <HStack mt='6' justifyContent='center'>
                <Text fontSize='sm' color='muted.700' fontWeight={400}>Don't have an account? {' '}</Text>
                <Link _text={{
                  fontWeight: 'medium',
                  fontSize: 'sm',
                }} onPress={() => {this.props.navigation.navigate('Sign Up')}}>
                  Sign Up 
                </Link>
              </HStack>
          </VStack>
        </Box>
      </NativeBaseProvider>
      
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: RFValue(70),
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#fff',
        marginLeft: RFValue(90),
        width: RFValue(200),
        height: RFValue(50),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: RFValue(20),
        backgroundColor: '#0466c8'
    },
    text:{
        fontSize: RFValue(20),
    }
})