import React from 'react';
import * as firebase from 'firebase';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Icon, Header, Container, Left} from 'native-base'


export default class Logout extends React.Component {


    constructor(props) {
        super(props);
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.onIconPressed = this.onIconPressed.bind(this);


    };

    onIconPressed() {
        this.props.navigation.openDrawer();
    }


    onButtonPressed() {
        firebase.auth().signOut().then(() => {
                this.props.screenProps.rootNavigation.navigate('Login')
        }, (error) => {
            console.log(error)
        });


    }






    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Left>
                        <Icon name="ios-menu" onPress={this.onIconPressed}
                              style={styles.icon}
                        />
                    </Left>
                </Header>
                <View style={styles.container}>
                    <Text>Do you want to logout?</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onButtonPressed}
                    >
                        <Text style={{color: '#fff', fontSize: 25}}>Logout</Text>
                    </TouchableOpacity>
                </View>


            </Container>
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
    icon: {
        position: 'absolute',
        backgroundColor: '#8e8e8e',
        left: 0,
        right: 0,
        bottom: -23

    },
    header: {
        backgroundColor: '#8e8e8e',
        justifyContent: 'flex-start',

    },

    button: {
        alignItems: 'center',
        backgroundColor: '#cba008',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    }


});