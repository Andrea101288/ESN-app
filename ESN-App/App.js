import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Login from './src/components/Login';
import SignUp from './src/components/SignUp';
import Firebase from './src/api';
import MainView from './src/components/MainView';
import EventInfo from './src/components/EventInfo';
import Events from './src/components/Events';
import BookedEvents from './src/components/BookedEvents';
import DeleteAccount from './src/components/DeleteAccount';
import ChangePassword from './src/components/ChangePassword';
import RecoveryPassword from './src/components/RecoveryPassword';

import Logout from './src/components/Logout';

import Maps from './src/components/Maps';
import * as firebase from 'firebase';

export default class App extends React.Component {

    constructor(props) {
        super(props)
        Firebase.init()
        this.state = {
            initialView: null,
            userLoaded: false
        }

        this.getInitialView = this.getInitialView.bind(this)
    }

    getInitialView() {
        firebase.auth().onAuthStateChanged((user) => {
            let initialView = user ? 'MainView' : 'Login'
            this.setState({
                userLoaded: true,
                initialView
            })
        })
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

const AppStackNavigator = createStackNavigator({
    Login: Login,
    SignUp: SignUp,
    MainView: MainView,
    Events: Events,
    EventInfo: EventInfo,
    Maps: Maps,
    BookedEvents: BookedEvents,
    DeleteAccount: DeleteAccount,
    ChangePassword: ChangePassword,
    Logout: Logout,
    RecoveryPassword: RecoveryPassword


})


