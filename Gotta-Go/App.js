import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, useWindowDimensions, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Picker } from '@react-native-picker/picker';

import FirstRoute from './src/routes/FirstRoute';
import SecondRoute from './src/routes/SecondRoute';


export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Map' },
    { key: 'second', title: 'List View' },
  ]);
  const [restrooms, setRestrooms] = useState([]);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const numberOnPage = 50;
  const page = 1;

  const fetchRestrooms = async (region) => {
    if (!region) return;
    setLoading(true); // Start loading indicator
    const { latitude, longitude } = region;
    try {
      const response = await fetch(
        `https://www.refugerestrooms.org/api/v1/restrooms/by_location?lat=${latitude}&lng=${longitude}&per_page=${numberOnPage}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const data = await response.json();
      setRestrooms(data);
    } catch (error) {
      console.error('Error fetching restrooms:', error.message);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to find nearby restrooms.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0122, // Start zoomed in
          longitudeDelta: 0.0421,
        });

        // Fetch restrooms after getting user location
        fetchRestrooms({
          latitude,
          longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting user location:', error.message);
      }
    };

    getUserLocation();
  }, []);

  const renderScene = SceneMap({
    first: () => (
      <FirstRoute
        restrooms={restrooms}
        region={region}
        setRegion={setRegion}
        fetchRestrooms={fetchRestrooms}
        userLocation={userLocation}
      />
    ),
    second: () => (
      <SecondRoute
        restrooms={restrooms}
        onNavigateToMap={(latitude, longitude) => {
          setIndex(0);
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.922,
            longitudeDelta: 0.421,
          });
        }}
      />
    ),
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {loading ? ( // Show loading indicator while loading
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        region ? (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={styles.indicator}
                labelStyle={styles.tabLabel}
              />
            )}
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    width: 150,
  },
  title: {
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 200,
    width: '100%',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listText: {
    marginLeft: 5,
  },
  mapButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  mapButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#f8f8f8',
  },
  indicator: {
    backgroundColor: 'blue',
  },
  tabLabel: {
    color: 'black',
  },
});
