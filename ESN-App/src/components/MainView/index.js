import React from 'react';
import {StyleSheet} from 'react-native';
import * as DrawerNavigator from 'react-navigation';
/* import Events from '../Events';
import BookedEvents from '../BookedEvents';
import DeleteAccount from '../DeleteAccount';
import ChangePassword from '../ChangePassword'; */
import Logout from '../Logout';

export default class MainView extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        return (
            <MyApp screenProps={{ rootNavigation: this.props.navigation }}/>
        );
    }
}

const MyApp = DrawerNavigator.createDrawerNavigator({

     /* Events: {
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
    }, */

    Logout: {
        screen: Logout
    }
})