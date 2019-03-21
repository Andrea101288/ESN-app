import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

let lat, lng, coord;

export default class Maps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    };

    componentDidMount() {
        lat = this.props.navigation.getParam('lat', 'NO-Lat');
        lng = this.props.navigation.getParam('lng', 'NO-Lng');
        coord = {
            latitude: lat,
            longitude: lng
        };
        this.setState({
            loading: false
        });
    }

    render() {
        if (this.state.loading) {
            return <Text>Loading...</Text>
        }
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <Marker
                        coordinate={coord}
                    />
                </MapView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }

});



