import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, Image, TouchableHighlight, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { useFonts } from 'expo-font';
import * as Permissions from 'expo-permissions';
import { AppLoading } from 'expo';
import Swiper from 'react-native-swiper/src';

const HomeScreen = props => {

    const [donateColor, setDonateColor] = useState('white');
    const [findColor, setFindColor] = useState('white');
    const [enteredValue, setEnteredValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [isSet, setIsSet] = useState(false);
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');

    let [fontsLoaded] = useFonts({
        'peachyday': require('../assets/fonts/peachyday.ttf'),
    });

    const numberInputHandler = inputText => {
        setEnteredValue(inputText);
    };

    const useMyLocationHandler = myLocation => {
        setEnteredValue(myLocation);
        setSelectedValue(myLocation);
    };

    getLatLong = async () => {
        if (!isSet) {
            let latlong = await Location.geocodeAsync(enteredValue);
            setLat(latlong[0].latitude);
            setLong(latlong[0].longitude);
            setIsSet(true);
        }
    }

    getLocation = async () => {
        let { status } = await Location.requestPermissionsAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('You have not allowed us to access your location!', 'Please enter your zipcode instead.', [{ text: 'Okay', style: 'cancel' }]);
        } else {
            permissionGranted();
        }
    }

    permissionGranted = async () => {
        let location = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync(location.coords);
        const myLocation = geocode[0].postalCode;
        useMyLocationHandler(myLocation);
        if (!isSet) {
            setLat(location["coords"]["latitude"]);
            setLong(location["coords"]["longitude"]);
            setIsSet(true);
        }
    }

    const donateHandler = () => {
        setSelectedOption('donate');
        setDonateColor('#f4d3b3');
        setFindColor('white');
    };

    const findHandler = () => {
        setSelectedOption('find');
        setDonateColor('white');
        setFindColor('#f4d3b3');
    };

    const startHandler = () => {
        if (selectedValue === '' && selectedOption === '') {
            Alert.alert('Your information is incomplete!', 'Please enter a location and select an action.', [{ text: 'Okay', style: 'cancel' }]);
            return;
        }
        else if (selectedOption === '') {
            Alert.alert('Select an Action!', 'Please select whether you would like to donate or find resources.', [{ text: 'Okay', style: 'cancel' }]);
            return;
        }
        else if (isNaN(parseInt(enteredValue)) || enteredValue.length != 5) {
            Alert.alert('Invalid Zip Code!', 'A valid zip code must be entered.', [{ text: 'Okay', style: 'destructive', onPress: () => setEnteredValue('') }]);
            return;
        }
        getLatLong();
        setSelectedValue(enteredValue);
        props.onStart(selectedValue, selectedOption);
        props.onGoToHome(false);
        props.onLatLong(lat, long);
    };
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <Swiper style={styles.wrapper}
                showsButtons={true}
                paginationStyle={{ position: 'absolute', bottom: 30, alignSelf: 'flex-end', justifyContent: 'flex-end', right: 20 }}
                showsPagination
                removeClippedSubviews={false}
                index={0}
                loop={false}
            >
                <View style={styles.slide1}>
                    <ImageBackground
                        style={{
                            flex: 1,
                            backgroundColor: 'white'
                        }}
                        source={require('../images/splash2.png')}
                    >
                        <View style={styles.title}>
                            <Text style={styles.textName}>A M P L E</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.subheading}>Welcome to Ample, an easy way to access information about food banks in your area. Swipe or tap the button to get started.</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.slide2}>
                    <Image style={styles.image} source={require('../images/foodbanks.png')}></Image>
                    <Text style={styles.textMain}>Find Food Banks</Text>
                    <Text style={styles.subheading2}>Enter a zip code or use your phone's location to find nearby food banks.</Text>
                    <Text style={styles.textLook}>Enter Your Zip Code:</Text>
                    <View style={styles.zipcodeInput}>
                        <TextInput
                            style={styles.zipcode}
                            blurOnSubmit
                            keyboardType="numeric"
                            maxLength={5}
                            onChangeText={numberInputHandler}
                            value={enteredValue}
                        />
                        <Text style={styles.orText}>  OR </Text>
                        <TouchableOpacity style={styles.button} onPress={getLocation}>
                            <Text style={styles.buttonText}>Use My Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.textMain2}>Choose An Action:</Text>
                    <TouchableOpacity
                        onPress={donateHandler}
                        style={{
                            backgroundColor: donateColor, borderWidth: 3, borderColor: '#f4d3b3', borderRadius: 10, width: '80%',
                            paddingVertical: 20, paddingHorizontal: 10, marginTop: 50, paddingTop: 45
                        }}
                    >
                        <Image style={styles.iconsmaller} source={require('../images/donate.png')}></Image>
                        <Text style={styles.donate}>Donate Food</Text>
                        <Text></Text>
                        <Text style={styles.desc}>Help provide what food banks need</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={findHandler}
                        style={{
                            backgroundColor: findColor, borderWidth: 3, borderColor: '#f4d3b3', borderRadius: 10, width: '80%',
                            paddingVertical: 20, paddingHorizontal: 10, marginTop: 20, paddingTop: 45
                        }}
                    >
                        <Image style={styles.iconsmaller} source={require('../images/collect.png')}></Image>
                        <Text style={styles.donate}>Collect Food</Text>
                        <Text></Text>
                        <Text style={styles.desc}>See available items at food banks</Text>
                    </TouchableOpacity>
                    <View style={styles.start}>
                        <TouchableOpacity style={styles.customButton} onPress={startHandler}>
                            <Text style={styles.startText}>Get Started</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16 }}>End the food crisis, one donation at a time!</Text>
                    </View>
                </View>
            </Swiper>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
    },
    slide2: {
        flex: 1,
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textName: {
        fontSize: 70,
        color: 'black',
        fontFamily: 'peachyday',
        marginBottom: 35,
    },
    title: {
        marginTop: 140,
        alignItems: 'center',
        justifyContent: 'center'
    },
    findPlaces: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLook: {
        fontSize: 18,
    },
    orText: {
        fontSize: 12,
        color: 'black',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    zipcode: {
        padding: 8,
        marginTop: 10,
        borderColor: '#10518f',
        backgroundColor: 'white',
        color: '#10518f',
        fontSize: 28,
        borderWidth: 1,
        borderRadius: 10,
        width: 190,
        textAlign: 'center'
    },
    selection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionText: {
        fontSize: 20
    },
    button2: {
        padding: 50,
        marginTop: 10,
        borderColor: '#e5e5ea',
        backgroundColor: 'white',
        borderWidth: 1,
        width: 150,
        textAlign: 'center'
    },
    start: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    customButton: {
        borderColor: '#ff8000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#ff8000',
        width: 180,
        height: 60,
        elevation: 5,
        borderRadius: 10,
        marginTop: 20,
    },
    startText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white'
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 190,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ff8000',
        backgroundColor: '#ff8000',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        alignItems: 'center',
    },
    button2Text: {
        fontSize: 20,
        alignItems: 'center',
    },
    button3: {
        width: 140,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 1,
        marginTop: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff8000',
        backgroundColor: '#ff8000',
        alignItems: 'center'
    },
    image: {
        height: '43%',
        width: '100%',
        alignItems: 'center'
    },
    textMain: {
        paddingTop: 20,
        fontSize: 25,
        paddingBottom: 17,
        fontWeight: 'bold',
    },
    textMain2: {
        paddingTop: 100,
        fontSize: 25,
        marginLeft: -50,
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    subheading: {
        textAlign: 'center',
        fontSize: 17,
        width: 250,
        color: '#10518f',
        marginTop: 300
    },
    subheading2: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16,
        marginVertical: -7,
        paddingBottom: 35,
        width: 270,
    },
    iconsmall: {
        height: 70,
        width: 90,
        marginVertical: -30,
        tintColor: '#10518f',
    },
    iconsmaller: {
        height: 80,
        width: 70,
        marginLeft: 10,
        marginVertical: -30,
        tintColor: '#10518f',
    },
    donate: {
        marginLeft: 120,
        marginVertical: -30,
        fontSize: 20,
        marginTop: -40,
        marginBottom: 0,
        fontWeight: 'bold'
    },
    desc: {
        marginLeft: 120,
    },
    food: {
        alignItems: 'center',
    }
});

export default HomeScreen;