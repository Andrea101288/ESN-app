import React from 'react';
import {StyleSheet} from 'react-native';
import * as DrawerNavigator from 'react-navigation';

export default class MainView extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {
        const { currentUser } = this.auth
        console.log("ciao")
    }


    render() {
        return (
            <MyApp screenProps={{ rootNavigation: this.props.navigation }}/>
        );
    }
}

const MyApp = DrawerNavigator.createDrawerNavigator({

    Events: {
        screen: Events
    },

    Booked_Events: {
        screen: BookedEvents
    },

    Change_Password: {
        screen: ChangePassword
    },

    Delete_Account: {
        screen: DeleteAccount
    },

    Logout: {
        screen: Logout
    }
})