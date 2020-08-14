import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import FoodBanksScreen from './screens/FoodBanksScreen';
import DonateScreen from './screens/DonateScreen';
import FindResourcesScreen from './screens/FindResourcesScreen';

export default function App() {

  const [option, setOption] = useState('');
  const [location, setLocation] = useState('');
  const [goToHome, setGoToHome] = useState(false);
  const [goToList, setGoToList] = useState(false);
  const [goToInventory, setGoToInventory] = useState(false);
  const [foodBankName, setFoodBankName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState(''); 
  
  const showFoodBanksHandler = (inputLocation, selectedOption) => {
    setLocation(inputLocation);
    setOption(selectedOption);
  };

  const goToHomeHandler = goHome => {
    setGoToHome(goHome);
  };

  const goToInventoryHandler = inventory => {
    setGoToInventory(inventory);
  };

  const goToListingHandler = list => {
    setGoToList(list);
  }; 

  const foodBankNameHandler = name => {
    setFoodBankName(name);
  };

  const latLongHandler = (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  };

  let content = <HomeScreen 
                  onStart={showFoodBanksHandler} 
                  onGoToHome={goToHomeHandler}
                  onLatLong={latLongHandler}
                />;

  if (goToHome) {
    content = <HomeScreen 
                onStart={showFoodBanksHandler} 
                onGoToHome={goToHomeHandler}
                onLatLong={latLongHandler}
              />;
  }
  else if ((option && location && !goToHome && !goToInventory) || goToList) {
    content = <FoodBanksScreen 
                onGoToHome={goToHomeHandler} 
                locationOfUser={location} 
                onGoToInv={goToInventoryHandler}
                onGoToList={goToListingHandler}
                onName={foodBankNameHandler}
                userLat={latitude}
                userLong={longitude}
              />;
  }
  else if (goToInventory && option === 'donate' && !goToList){
    content = <DonateScreen onGoToList={goToListingHandler} name={foodBankName}/>;
  }
  else if (goToInventory && option === 'find' && !goToList){
    content = <FindResourcesScreen onGoToList={goToListingHandler} name={foodBankName}/>;
  }

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor='#10518f' style={styles.bar}/>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  bar: {
    marginBottom: 10
  }
});
