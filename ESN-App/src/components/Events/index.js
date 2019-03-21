import React from 'react';
import * as firebase from 'firebase';
import {ListItem} from 'react-native-elements';
import {Text, StyleSheet, View} from 'react-native';
import {Icon, Header, Container, Left, Content} from 'native-base'

let events = [];

export default class Events extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            currentUser: null
        }

        this.onEventPressed = this.onEventPressed.bind(this);
        this.onIconPressed = this.onIconPressed.bind(this)


    };

    getEvents() {
        let rootRef = firebase.database().ref();
        let ref = rootRef.child('events');
        ref.orderByChild('date').once('value').then(snapshot => {
            if(snapshot.val()) {
                snapshot.forEach(function (event) {
                    events.push(event.val())
                })
                this.setState({
                    loading: false
                })
            }

        })


    }

    componentDidMount() {
        events=[];
        this.getEvents();

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
        if (this.state.loading) {
            return (
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Icon name="ios-menu" onPress={this.onIconPressed}
                                  style = {styles.icon}
                            />
                        </Left>
                    </Header>
                    <Text>There aren't available events.</Text>
                </Container>
            );
        }
        else {

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
                        events.map((e) => (
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