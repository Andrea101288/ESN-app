import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity} from 'react-native';
import * as firebase from "firebase";
import DatePicker from 'react-native-datepicker';

let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            date: '',
            email: '',
            email2: '',
            password: '',
            password2: ''
        }
        this.onButtonPressed = this.onButtonPressed.bind(this)
        this.Signup = this.Signup.bind(this)
    };

    async Signup() {
        let data = {'name': this.state.name, 'surname': this.state.surname, 'birth_date': this.state.date, 'email': this.state.email}

        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            await firebase.database().ref('users/').push(data)
            Alert.alert('Welcome!','You have successfully registered', [
                {text: 'OK', onPress: () => this.props.navigation.navigate('Login')},
            ])
        } catch(error) {
            this.setState({
                response: error.toString()
            })
            Alert.alert('Error', this.state.response)

        }
    }

    onButtonPressed() {
        if (this.state.name === '' || this.state.surname === '' || this.state.email === '' || this.state.email2 === '' || this.state.password === '' || this.state.password2 === '') {
            Alert.alert('Error','You must enter all the fields')
        }
        else if (this.state.email !== this.state.email2) {
            Alert.alert('Error','E-mails are not equal')
        }
        else if (this.state.password !== this.state.password2) {
            Alert.alert('Error','Passwords are not equal')
        }
        else {
            this.Signup()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput  style={styles.inputs}
                            placeholder="Name"
                            onChangeText={(name) => this.setState({name})}/>
                <TextInput  style={styles.inputs}
                            placeholder="Surname"
                            onChangeText={(surname) => this.setState({surname})}/>
                <DatePicker
                    style={{width: 300}}
                    date={this.state.date}
                    mode="date"
                    placeholder="Birth date"
                    format="DD-MM-YYYY"
                    minDate="01-11-1940"
                    maxDate="01-11-2000"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                />
                <TextInput  style={styles.inputs}
                            placeholder="E-mail"
                            onChangeText={(email) => this.setState({email})}
                            type = "email"
                />
                <TextInput  style={styles.inputs}
                            placeholder="Confirm e-mail"
                            onChangeText={(email2) => this.setState({email2})}
                            type = "email"
                />
                <TextInput  style={styles.inputs}
                            placeholder="Password"
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                />
                <TextInput  style={styles.inputs}
                            placeholder="Confirm password"
                            onChangeText={(password2) => this.setState({password2})}
                            secureTextEntry={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onButtonPressed}
                >
                    <Text style={{color: '#fff', fontSize: 25}}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 35,
        alignSelf: 'center',
        marginTop: 10,
    },

    inputs: {
        height: 40,
        fontSize: 25,
        marginTop: 12,
        marginLeft: 5,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#0d47a1',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    }

});

