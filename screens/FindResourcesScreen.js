import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TouchableHighlight, Platform, YellowBox } from 'react-native';
import firebase from '../database/firebaseDb';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Accordion from '../components/Accordion';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Each child in a list should have a unique "key" prop.']);

const FindResourcesScreen = props => {

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [lat, setLat] = useState(0.0);
    const [long, setLong] = useState(0.0);

    const ref = firebase.firestore().collection(props.name);
    const info = firebase.firestore().collection('ListOfFoodBanks').doc(props.name);

    info.get().then(function (doc) {
        setAddress(doc.get('address') + ', ' + doc.get('city') + ', ' + doc.get('state') + ' ' + doc.get('zipcode'));
        setPhone(doc.get('phone'));
        const strLat = doc.get('latitude');
        const strLong = doc.get('longitude');
        setLat(parseFloat(strLat));
        setLong(parseFloat(strLong));
    });

    useEffect(() => {
        ref.onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                let dict = {};
                dict['title'] = doc.id;
                dict['data'] = [];

                const ref2 = ref.doc(doc.id).collection('Products Needed');
                ref2.onSnapshot(quSnap => {
                    quSnap.forEach(res => {
                        const { name } = res.data();
                        dict['data'].push({ 'key': name });
                    });
                });
                setInventory(currentInv => [...currentInv, dict]);
            });

            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    const makeCall = () => {
        let phoneNumber = phone;
        if (Platform.OS === 'android') {
            phoneNumber = 'tel:' + phone;
        } else {
            phoneNumber = 'telprompt:' + phone;
        }
        Linking.openURL(phoneNumber);
    };

    const openMap = () => {
        const place = address.replace(/ /gi, '+');
        const url = 'https://www.google.com/maps/place/' + place + '/';
        Linking.openURL(url);
    };

    const renderData = () => {
        const items = [];
        for (let item of inventory) {
            items.push(
                <Accordion title={item.title} data={item.data} />
            );
        }
        return items;
    };

    return (
        <ScrollView>
            <View style={styles.screen}>
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.backButton} onPress={() => props.onGoToList(true)}>
                            <Image style={styles.back} source={require('../images/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.title}>{props.name}</Text>
                    </View>
                </View>
                <View style={styles.need}>
                    <Text style={styles.textItem}>Items Stocked:</Text>
                </View>
                <View style={{ backgroundColor: '#ff8000' }}>
                    {renderData()}
                </View>
                <View style={styles.line}>
                    <View style={{ backgroundColor: '#ff8000' }}>
                        <Text style={styles.textSubheader}>Address and Contact Details</Text>
                    </View>
                    <TouchableHighlight onPress={openMap} underlayColor='#e5e5ea'>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={styles.address} source={require('../images/address.png')}></Image>
                            <Text style={styles.textAddress}>{address}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={makeCall} underlayColor='#e5e5ea'>
                        <View style={{ flexDirection: 'row', marginTop: 50 }}>
                            <Image style={styles.phone} source={require('../images/phone.png')}></Image>
                            <Text style={styles.textPhone}>{phone}</Text>
                        </View>
                    </TouchableHighlight>
                    <View>
                        <MapView
                            style={{ flex: 1, height: 180, paddingTop: 30 }}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: lat,
                                longitude: long,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421
                            }}>
                            <TouchableHighlight>
                                <Marker
                                    coordinate={{ latitude: lat, longitude: long }}
                                    onPress={openMap}
                                >
                                </Marker>
                            </TouchableHighlight>
                        </MapView>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    topBar: {
        maxWidth: '100%',
        backgroundColor: '#10518f',
        height: 110
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        width: 50,
        borderRadius: 5,
        marginRight: 2,
        marginTop: 50
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    textItem: {
        fontSize: 20,
        marginTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
        color: 'white'
    },
    need: {
        paddingLeft: 30,
        backgroundColor: '#ff8000',
    },
    line: {
        borderBottomWidth: 0.5,
        borderColor: 'lightgray'
    },
    address: {
        width: 55,
        height: 55,
        tintColor: '#10518f',
        marginVertical: 10
    },
    phone: {
        width: 25,
        height: 25,
        tintColor: '#10518f',
        marginLeft: 17,
        marginVertical: -50
    },
    textAddress: {
        marginLeft: -3,
        marginTop: 25,
        fontSize: 15
    },
    textPhone: {
        marginLeft: 10,
        marginVertical: -50,
        fontSize: 16
    },
    textSubheader: {
        fontSize: 20,
        marginLeft: 25,
        marginTop: 10,
        marginVertical: 5,
        color: 'white'
    },
    back: {
        width: 25,
        height: 25,
        tintColor: 'white',
        paddingTop: 5
    }
});

export default FindResourcesScreen;