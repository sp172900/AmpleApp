import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import firebase from '../database/firebaseDb';
import haversine from 'haversine';

const FoodBanksScreen = props => {

    const haversine = require('haversine');
    const ref = firebase.firestore().collection('ListOfFoodBanks');
    const [loading, setLoading] = useState(true);
    const [foodBanks, setFoodBanks] = useState([]);

    useEffect(() => {
        ref.onSnapshot(querySnapshot => {
            const list = [];
            const start = {
                latitude: props.userLat,
                longitude: props.userLong
            };
            querySnapshot.forEach(doc => {
                const { latitude, longitude } = doc.data();
                const end = {
                    latitude: latitude,
                    longitude: longitude
                };
                let dist = haversine(start, end, { unit: 'mile' }).toFixed(1);
                if (dist <= 50) {
                    list.push({
                        id: doc.id,
                        distance: dist
                    });
                }
            });

            const sortedList = list.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
            setFoodBanks(sortedList);

            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => props.onGoToHome(true)}>
                        <Image style={styles.back} source={require('../images/back.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.title}>Nearby Food Banks</Text>
                </View>
            </View>
            <View style={styles.zipView}>
                <Text style={styles.textZip}>Zip Code: {props.locationOfUser}</Text>
            </View>
            <View style={styles.list}>
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    data={foodBanks}
                    renderItem={itemData =>
                        <View style={styles.listItem}>
                            <Text style={styles.textName}>{itemData.item.id}</Text>
                            <Text style={styles.textData}>{itemData.item.distance} miles away</Text>
                            <TouchableOpacity style={styles.customButton} onPress={() => {
                                props.onGoToInv(true);
                                props.onGoToList(false);
                                props.onName(itemData.item.id);
                            }}>
                                <Text style={styles.buttonText}>VIEW INVENTORY</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E5E5EA'
    },
    topBar: {
        maxWidth: '100%',
        backgroundColor: '#10518f',
        height: 110,
        paddingBottom: 12
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        width: 50,
        borderRadius: 5,
        marginRight: 5,
        marginTop: 50
    },
    title: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 8
    },
    list: {
        marginTop: 20,
        paddingBottom: 180
    },
    listItem: {
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 30,
        marginRight: 25,
        marginLeft: 25,
        paddingTop: 5,
        paddingBottom: 20,
        alignItems: 'center'
    },
    textName: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    textData: {
        fontSize: 16,
        color: '#10518f',
        paddingBottom: 15
    },
    customButton: {
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff8000',
        backgroundColor: '#ff8000'
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        alignItems: 'center'
    },
    textZip: {
        fontSize: 17,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    back: {
        width: 25,
        height: 25,
        tintColor: 'white',
    },
    zipView: {
        backgroundColor: '#ff8000',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 50,
        marginLeft: 210
    }
});

export default FoodBanksScreen;