import React from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import bcrypt from 'react-native-bcrypt';
import MainView from "../MainView";

export default class Login extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            response: '',
            auth: false
        }
        this.Login = this.Login.bind(this)
        this.onButtonPressed = this.onButtonPressed.bind(this)
        this.auth = false;
    };

    componentDidMount() {
        this.props.navigation.navigate('Login')
    }

    async Login() {
        try {

            fetch("http://51.15.222.184:8080/login/" , {

                method: 'POST',
                body: JSON.stringify( {
                    email: this.state.email
                })

            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(
                    responseData,
                    "POST Response",
                    "Response body -> " + JSON.stringify(responseData))
                let hash = responseData.hash;
                console.log(hash);
                if (responseData.status == 200) {
                    this.state.auth = bcrypt.compareSync(this.state.password, hash);
                    console.log(this.state.auth);
                    if (this.state.auth) {
                        this.props.navigation.navigate('MainView');
                        console.log("yeah")
                    } else {
                        Alert.alert("Error!", "Wrong password. Try again")
                        this.props.navigation.navigate('Login');
                    }
                }else{
                    Alert.alert("Error!", "Wrong email. Try again")
                    this.props.navigation.navigate('Login');
                }
            }).done();
        } catch(error) {
            this.setState({
                response: error.toString()
            })
            Alert.alert('Error', this.state.response)
        }
    }

    onButtonPressed() {
        this.Login()
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../img/esn.png')}
                        style = {{height:350, width:350}}/>
                <TextInput  style={{height: 50, fontSize: 30}}
                            placeholder="E-mail"
                            onChangeText={(email) => this.setState({email})}/>
                <TextInput  style={{height: 50, fontSize: 30}}
                            placeholder="Password"
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onButtonPressed.bind(this)}
                >
                    <Text style={{color: '#fff', fontSize: 20}}>Sign in</Text>
                </TouchableOpacity>
                <Text
                    onPress={() => this.props.navigation.navigate('RecoveryPassword')}
                    style={styles.signup}> Forgotten password?</Text>
                <Text style ={styles.text}>If you don't have an account,
                    <Text
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        style={styles.signup}> Sign up</Text>
                </Text>
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
    title: {
        fontSize: 40,
    },
    text: {
        color: '#90a4ae',
        marginTop: 30,
        fontSize: 17

    },
    signup: {
        color: '#212121',
        textDecorationLine: 'underline'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#0d47a1',
        marginTop: 15,
        padding: 10,
        borderRadius: 20,
    },
});