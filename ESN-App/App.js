import {createStackNavigator} from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SignUp from './src/components/SignUp';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            initialView: null,
            userLoaded: false
        }

        this.getInitialView = this.getInitialView.bind(this)
    }

    getInitialView() {
        initialView = 'Login'

        /* firebase.auth().onAuthStateChanged((user) => {
            let initialView = user ? 'MainView' : 'Login'
            this.setState({
                userLoaded: true,
                initialView
            })
        })*/
    }

    render() {
        if (!this.state.userLoaded) {
            return (
                <AppStackNavigator navigation={this.props.navigation}/>
            );
        }
        else {
            return null
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStackNavigator = createStackNavigator({
    //Login: Login,
    SignUp: SignUp,
    //MainView: MainView,
})
