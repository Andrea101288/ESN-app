import React from 'react';
import * as firebase from 'firebase';
import {Text, StyleSheet, View, TouchableOpacity, Alert, TextInput} from 'react-native';


export default class RecoveryPassword extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            email: ''

        }
        this.onButtonPressed = this.onButtonPressed.bind(this);


    };





    onButtonPressed() {
        let auth = firebase.auth();
        auth.sendPasswordResetEmail(this.state.email).then(() => {
            Alert.alert('Done!', 'An email has been sent!', [
                {text: 'OK', onPress: () => this.props.navigation.navigate('Login')}
                ])
        }).catch((error) => {
                Alert.alert('Error!',error.toString())
            })

    }

    render() {
        return (

                <View style={styles.container}>
                    <TextInput  style={styles.inputs}
                                placeholder="Email"
                                onChangeText={(email) => this.setState({email})}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onButtonPressed}

                    >
                        <Text style={{color: '#fff', fontSize: 25}}>Send email</Text>
                    </TouchableOpacity>


                </View>

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

    inputs: {
        height: 40,
        fontSize: 25,
        marginTop: 12,
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