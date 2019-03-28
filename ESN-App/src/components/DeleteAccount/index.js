import React from 'react';
import * as firebase from 'firebase';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Icon, Header, Container, Left} from 'native-base'


export default class DeleteAccount extends React.Component {


    constructor(props) {
        super(props);
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.onIconPressed = this.onIconPressed.bind(this);


    };

    onIconPressed() {
        this.props.navigation.openDrawer();
    }


    onButtonPressed() {
        const { currentUser } = firebase.auth();
        let email = currentUser.providerData[0].email;
        let rootRef = firebase.database().ref();
        let ref = rootRef.child('users/');
        ref.once('value').then(snapshot => {
            snapshot.forEach(user => {
                if(user.val().email === email) {
                    let us = ref.child(user.key);
                    us.remove();
                    firebase.auth().currentUser.delete().then(function() {
                    }).catch(function(error) {
                    })
                    Alert.alert('Done!','Your account has been deleted.', [
                        {text: 'OK', onPress: () => this.props.screenProps.rootNavigation.navigate('Login')},
                    ])
                }
            })
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
                        <Text>Do you want to delete your account?</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.onButtonPressed}
                        >
                            <Text style={{color: '#fff', fontSize: 25}}>Delete</Text>
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
        backgroundColor: '#a1120a',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    }


});