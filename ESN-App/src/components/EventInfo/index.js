import React from 'react';
import * as firebase from 'firebase';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {MapView} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Stars from 'react-native-stars'



let button, buttonStyle;
export default class EventInfo extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            city: '',
            country: '',
            date: '',
            place: '',
            time: '',
            lat: '',
            lng: '',
            button: '',
            buttonStyle: '',
            loading: true,
            stars: 2.5,
            before: false,
            voted: false,
            press: false,
            average: 0,
            users: 0
        }

        this.onAddressClicked = this.onAddressClicked.bind(this);
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.convertMonth = this.convertMonth.bind(this);
        this.getDate = this.getDate.bind(this);
        this.updateAverage = this.updateAverage.bind(this);
        this.onButtonVoteEventPressed = this.onButtonVoteEventPressed.bind(this);
        this.onButtonVotePressed = this.onButtonVotePressed.bind(this);
    };

    convertMonth(month) {
        if (month === 'January') {
            return '01';
        }
        else if(month === 'February') {
            return '02';
        }
        else if(month === 'March') {
            return '03';
        }
        else if(month === 'April') {
            return '04';
        }
        else if(month === 'May') {
            return '05';
        }
        else if(month === 'June') {
            return '06';
        }
        else if(month === 'July') {
            return '07';
        }
        else if(month === 'August') {
            return '08';
        }
        else if(month === 'September') {
            return '09';
        }
        else if(month === 'October') {
            return '10';
        }
        else if(month === 'November') {
            return '11';
        }
        else {
            return '12';
        }


    }

    getDate(date) {
        let year = date.substring(date.length-4, date.length);
        let day, month;
        let space = false;
        let i = date.length-6;
        while(!space) {
            if (date[i] === ' ') {
                month = date.substring(i+1,date.length-6);
                day = date.substring(i-2,i);
                space = true;
            }
            --i;
        }
        month = this.convertMonth(month);
        let finalDate = day.concat(month);
        finalDate = finalDate.concat(year);
        return finalDate;

    }


    componentDidMount() {
        let name = this.props.navigation.getParam('nameEvent', 'NO-Name');
        const { currentUser } = firebase.auth();
        let rootRef = firebase.database().ref();
        let ref = rootRef.child('events/'+name);
        ref.once('value').then(snapshot => {
            this.setState({
                name: snapshot.val().name,
                address: snapshot.val().address,
                city: snapshot.val().city,
                country: snapshot.val().country,
                date: snapshot.val().date,
                place: snapshot.val().place,
                time: snapshot.val().time
            })
            let currentYear, currentMonth, currentDay;
            let date = new Date().toLocaleDateString();


            if (Platform.OS === 'ios') {
                currentDay = Number(date.substring(0,2));
                currentMonth = Number(date.substring(3,5));
                currentYear = Number(date.substring(6,10));

            }

            else {
                currentYear = date.substring(6,8);
                currentYear = Number(currentYear)+2000;
                currentMonth = Number(date.substring(0,2))
                currentDay = Number(date.substring(3,5));

            }
            let finalDate = this.getDate(this.state.date);
            let year = Number(finalDate.substring(4,8));
            let month = Number(finalDate.substring(2,4));
            let day = Number(finalDate.substring(0,2));
            if (year <= currentYear) {
                if (year < currentYear) {
                    this.setState({
                        before: true
                    });
                }
                else {
                    if (month <= currentMonth) {
                        if (month < currentMonth) {
                            this.setState({
                                before: true
                            });
                        }
                        else {
                            if (day < currentDay) {
                                this.setState({
                                    before: true
                                });
                            }
                        }
                    }
                }
            }
            if (this.state.before) {
                let rootRef2 = firebase.database().ref();
                let ref2 = rootRef2.child('users/');
                let email = currentUser.providerData[0].email;
                ref2.once('value').then(snapshot => {
                    snapshot.forEach(user => {
                        if (user.val().email === email) {
                            if (user.val().votedEvents) {
                                let usF = ref2.child(user.key+'/votedEvents');
                                usF.once('value').then(snap => {
                                    snap.forEach(eve => {
                                        if (eve.val() === this.state.name) {
                                            this.setState({
                                                voted: true
                                            })
                                        }
                                    })

                                })

                            }


                        }
                    })
                });
                    rootRef = firebase.database().ref();
                    ref = rootRef.child('events/'+this.state.name);
                    ref.once('value').then(snapshot => {
                        if (!snapshot.val().averages) {

                            let av = rootRef.child('events/'+this.state.name+'/averages');
                            av.set(0);
                            let usVoted = rootRef.child('events/'+this.state.name+'/votes');
                            usVoted.set(0);
                        }
                        else {
                            this.setState({
                                average: snapshot.val().averages,
                                users: snapshot.val().votes
                            })
                        }
                    });



            }

            Geocoder.init('AIzaSyDDIEZf8ns_KZkfcZUwh0R5n5lErf-rk1c'); // use a valid API key
            Geocoder.from(this.state.address + " " + this.state.city)
                .then(json => {
                    let lat = json.results[0].geometry.location.lat;
                    let lng = json.results[0].geometry.location.lng;
                    this.setState({
                        lat: lat,
                        lng: lng
                    })
                }).catch(error => console.warn(error))
        });
        let email = currentUser.providerData[0].email;
        rootRef = firebase.database().ref();
        ref = rootRef.child('users/');
        let exist = 0;
        ref.once('value').then(snapshot => {
            snapshot.forEach(user => {
                if(user.val().email === email) {
                        if (user.val().events) {
                            let us = ref.child(user.key + '/events');
                            us.once('value').then(snapshot => {
                                snapshot.forEach(event => {
                                    if (event.val() === name) {
                                        ++exist;
                                        button = 'Event booked';
                                        buttonStyle = 'buttonBooked';
                                    }
                                });
                                if (exist === 0) {
                                    button = 'Book the event';
                                    buttonStyle = 'buttonNotBooked';
                                }
                                this.setState({
                                    button: button,
                                    buttonStyle: buttonStyle
                                })
                            })
                        }
                        else {
                            button= 'Book the event';
                            buttonStyle= 'buttonNotBooked';
                            this.setState({
                                button: button,
                                buttonStyle: buttonStyle
                            })
                        }
                }


            })
        });
    }

    onAddressClicked() {
        this.props.navigation.navigate('Maps',
            {
                lat: this.state.lat,
                lng: this.state.lng
            });
    }



    onButtonPressed() {
        const { currentUser } = firebase.auth();
        let email = currentUser.providerData[0].email;
        let rootRef = firebase.database().ref();
        let ref = rootRef.child('users/');
        let exist = 0;
        const name = this.state.name;
        ref.once('value').then(snapshot => {
            snapshot.forEach(user => {
                if(user.val().email === email) {
                    if (user.val().events) {
                        let us = ref.child(user.key+'/events');
                        us.once('value').then(snapshot => {
                            snapshot.forEach(event => {
                                if (event.val() === name) {
                                    ++exist;
                                    let eve = us.child(event.key);
                                    eve.remove();
                                    button = 'Book the event';
                                    buttonStyle = 'buttonNotBooked';
                                }
                            });
                            if (exist === 0) {
                                us.push(name);
                                button = 'Event booked';
                                buttonStyle = 'buttonBooked';
                            }
                            this.setState({
                                button: button,
                                buttonStyle: buttonStyle
                            })
                        })
                    }
                    else {
                        button = 'Event booked';
                        buttonStyle = 'buttonBooked';
                        this.setState({
                            button: button,
                            buttonStyle: buttonStyle,
                        });
                        let us = ref.child(user.key+'/events');
                        us.push(name)
                    }
                }

            })
        });

    }

    updateAverage(val) {
        this.setState({
            stars: val
        })


    }

    onButtonVoteEventPressed() {
        this.setState({
            press: true
        })
    }

    onButtonVotePressed() {
        let rootRef = firebase.database().ref('events/'+this.state.name);

        let usVoted = rootRef.child('/votes');
        let u=0;
        usVoted.once('value').then(snapshot => {
            u = snapshot.val()+1;
            usVoted.set(u);
            let av = rootRef.child('/averages');
            av.once('value').then(aver => {
                let averFinal = (aver.val()+this.state.stars);
                av.set(averFinal);
                this.setState({
                    average: averFinal,
                    users: u

                })
            })
        });
        const { currentUser } = firebase.auth();
        let email = currentUser.providerData[0].email;
        let rootRef2 = firebase.database().ref();
        let ref = rootRef2.child('users/');
        ref.once('value').then(snapshot => {
            snapshot.forEach(user => {
                if (user.val().email === email) {
                        let usF = ref.child(user.key+'/votedEvents');
                        usF.push(this.state.name);
                        this.setState({
                            voted: true
                        })
                }
            })
        });

    }





    render() {

        if (this.state.before && !this.state.voted && !this.state.press) {
            return(
                <View style={styles.container}>
                    <Text>DETAILS:</Text>
                    <Text>Name: {this.state.name}</Text>
                    <Text>Place: {this.state.place}</Text>
                    <Text>Date: {this.state.date}</Text>
                    <Text>Time: {this.state.time}</Text>
                    <Text>Address: {this.state.address}</Text>
                    <Text>City: {this.state.city}</Text>
                    <Text>Country: {this.state.country}</Text>
                    <Text
                        onPress={this.onAddressClicked}
                        style={styles.address}>Look for the address in the map</Text>

                    <TouchableOpacity
                        style={styles.buttonVote}
                        onPress={this.onButtonVoteEventPressed}
                    >
                        <Text style={{color: '#fff', fontSize: 25}}>Vote this event</Text>
                    </TouchableOpacity>
                    <Text>Feedback: {this.state.average/this.state.users}/5 </Text>
                </View>);
        }
        else if (this.state.before && !this.state.voted) {
            return(
                <View style={styles.container}>
                    <Text>DETAILS:</Text>
                    <Text>Name: {this.state.name}</Text>
                    <Text>Place: {this.state.place}</Text>
                    <Text>Date: {this.state.date}</Text>
                    <Text>Time: {this.state.time}</Text>
                    <Text>Address: {this.state.address}</Text>
                    <Text>City: {this.state.city}</Text>
                    <Text>Country: {this.state.country}</Text>
                    <Text
                        onPress={this.onAddressClicked}
                        style={styles.address}>Look for the address in the map</Text>
                    <Stars
                        style={styles.stars}
                        default={2.5}
                        count={5}
                        update={(val)=>{this.setState({stars: val})}}
                        half={true}
                        starSize={50}
                        spacing={10}
                        fullStar={<Icon     name={'star'} size={40} style={[styles.myStarStyle]}/>}
                        emptyStar={<Icon name={'star-outline'} size={40} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                        halfStar={<Icon name={'star-half'} size={40} style={[styles.myStarStyle]}/>}
                    />
                    <Text>{this.state.stars}</Text>
                    <TouchableOpacity
                        style={styles.buttonBooked}
                        onPress={this.onButtonVotePressed}
                    >
                        <Text style={{color: '#fff', fontSize: 25}}>Vote</Text>
                    </TouchableOpacity>
                    <Text>Feedback: {this.state.average/this.state.users}/5 </Text>
                </View>
            );
        }
        else if (this.state.before) {
            return(
                <View style={styles.container}>
                    <Text>DETAILS:</Text>
                    <Text>Name: {this.state.name}</Text>
                    <Text>Place: {this.state.place}</Text>
                    <Text>Date: {this.state.date}</Text>
                    <Text>Time: {this.state.time}</Text>
                    <Text>Address: {this.state.address}</Text>
                    <Text>City: {this.state.city}</Text>
                    <Text>Country: {this.state.country}</Text>
                    <Text
                        onPress={this.onAddressClicked}
                        style={styles.address}>Look for the address in the map</Text>
                    <Text style={styles.voted}>You have voted this event!</Text>
                    <Text>Feedback: {this.state.average/this.state.users}/5 </Text>
                </View>
            );
        }
        else {
            return(
                <View style={styles.container}>
                    <Text>DETAILS:</Text>
                    <Text>Name: {this.state.name}</Text>
                    <Text>Place: {this.state.place}</Text>
                    <Text>Date: {this.state.date}</Text>
                    <Text>Time: {this.state.time}</Text>
                    <Text>Address: {this.state.address}</Text>
                    <Text>City: {this.state.city}</Text>
                    <Text>Country: {this.state.country}</Text>
                    <Text
                        onPress={this.onAddressClicked}
                        style={styles.address}>Look for the address in the map</Text>
                    <TouchableOpacity
                        style={styles[this.state.buttonStyle]}
                        onPress={this.onButtonPressed}
                    >
                        <Text style={{color: '#fff', fontSize: 25}}>{this.state.button}</Text>
                    </TouchableOpacity>
                </View>
            );
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

    address: {
        color: '#212121',
        textDecorationLine: 'underline'
    },

    buttonNotBooked: {
        alignItems: 'center',
        backgroundColor: '#0d47a1',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    },

    buttonBooked: {
        alignItems: 'center',
        backgroundColor: '#0aa114',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    },
    buttonVote: {
        alignItems: 'center',
        backgroundColor: '#cba008',
        marginTop: 15,
        padding: 20,
        borderRadius: 25,
        margin: 40,

    },
    myStarStyle: {
        color: 'yellow',
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,

    },
    myEmptyStarStyle: {
        color: 'white',
    },

    voted: {
        fontSize: 20,
        color: '#a1120a',


    }




});



