import React from 'react';
import * as firebase from 'firebase';
import {ListItem} from 'react-native-elements';
import {Text, StyleSheet, View} from 'react-native';
import {Icon, Header, Container, Left} from 'native-base'

let bookedEvents = [];

export default class BookedEvents extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            notEvents: true
        }

        this.onEventPressed = this.onEventPressed.bind(this);
        this.onIconPressed = this.onIconPressed.bind(this)


    };


    componentDidMount() {
        bookedEvents = [];
        const { currentUser } = firebase.auth();
        let email = currentUser.providerData[0].email;
        let rootRef = firebase.database().ref();
        let ref = rootRef.child('users/');
        ref.once('value').then(snapshot => {
            snapshot.forEach(user => {
                if(user.val().email === email) {
                    if (user.val().events) {
                        this.setState({
                            notEvents: false
                        });
                        let us = ref.child(user.key + '/events');
                        us.once('value').then(snapshot => {
                            snapshot.forEach(bEvent => {
                                rootRef = firebase.database().ref();
                                ref = rootRef.child('/events/'+bEvent.val());
                                ref.once('value').then(event => {
                                    bookedEvents.push(event.val());
                                    this.setState({
                                        loading: false
                                    })
                                })

                            })
                        })
                    }
                }

            })
        });

    }

    onEventPressed(name) {
        this.props.screenProps.rootNavigation.navigate('EventInfo',
            {
                nameEvent: name,
            });
    }

    onIconPressed() {
        this.props.navigation.openDrawer();
    }


    render() {
        if (this.state.loading && this.state.notEvents) {
            return (
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Icon name="ios-menu" onPress={this.onIconPressed}
                                  style = {styles.icon}
                            />
                        </Left>
                    </Header>
                    <Text>You haven't booked any event.</Text>
                </Container>
            );
        }
        if(this.state.notEvents) {
            return (
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Icon name="ios-menu" onPress={this.onIconPressed}
                                  style = {styles.icon}
                            />
                        </Left>
                    </Header>
                    <Text>Loading...</Text>
                </Container>
            );        }
        else
        {
            return (
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Icon name="ios-menu" onPress={this.onIconPressed}
                                  style={styles.icon}
                            />
                        </Left>
                    </Header>

                    {
                        bookedEvents.map((e) => (
                            <ListItem
                                key={e.name}
                                title={e.name}
                                subtitle={e.date}
                                onPress={() => this.onEventPressed(e.name)}
                            />
                        ))
                    }
                </Container>
            );
        }
    }
}


const styles = StyleSheet.create({
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

    }


});