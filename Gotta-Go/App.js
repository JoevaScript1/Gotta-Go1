import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, useWindowDimensions, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Picker } from '@react-native-picker/picker';

const FirstRoute = ({ restrooms, region, setRegion, fetchRestrooms, userLocation }) => {
  const [iconType, setIconType] = useState('default'); // Default to classic pin
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegionChange = (newRegion) => {
    const isSignificantChange =
      Math.abs(newRegion.latitude - region.latitude) > 0.5 ||
      Math.abs(newRegion.longitude - region.longitude) > 0.5;

    if (isSignificantChange) {
      setRegion(newRegion);
    }
  };
  const icons = [
    { name: 'map-pin', label: 'Default Pin' },
    { name: 'toilet', label: 'Toilet' },
    // Add more icons here as needed
  ];
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
      >

        {/* Restroom Markers */}
        {restrooms.map((restroom) => (
          <Marker
            key={restroom.id}
            coordinate={{ latitude: restroom.latitude, longitude: restroom.longitude }}
          >
            {/* Conditional Rendering Based on Selected Icon Type */}
            {iconType === 'toilet' ? (
              <FontAwesome5 name="toilet" size={30} color="blue" />
            ) : (
              <FontAwesome5 name="map-pin" size={30} color="red" /> // Default pin icon
            )}

            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.title}>{restroom.name}</Text>
                <View style={styles.infoContainer}>
                  <FontAwesome5 name="map-marker-alt" size={16} color="black" />
                  <Text style={styles.infoText}>{restroom.street}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <FontAwesome5 name="building" size={16} color="black" />
                  <Text style={styles.infoText}>{restroom.city}, {restroom.state}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <FontAwesome5 name="info-circle" size={16} color="black" />
                  <Text style={styles.infoText}>{restroom.comment}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <FontAwesome5 name="wheelchair" size={16} color={restroom.accessible ? 'green' : 'red'} />
                  <Text style={styles.infoText}>{restroom.accessible ? 'Accessible' : 'Not Accessible'}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <FontAwesome5 name="genderless" size={16} color={restroom.unisex ? 'blue' : 'gray'} />
                  <Text style={styles.infoText}>{restroom.unisex ? 'Unisex' : 'Gender-specific'}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => fetchRestrooms(region)}
      >
        <Text style={styles.refreshButtonText}>Refresh Restrooms</Text>
      </TouchableOpacity>

      {/* Icon Selection Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.iconButtonText}>Select Icon</Text>
      </TouchableOpacity>

      {/* Icon Selection Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <Picker
              selectedValue={iconType}
              onValueChange={(itemValue) => setIconType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Default Pin" value="default" />
              <Picker.Item label="Toilet" value="toilet" />
            </Picker>
            {/* Confirm Button */}
            {/* <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SecondRoute = ({ restrooms, onNavigateToMap }) => (
  <View style={styles.listContainer}>
    <FlatList
      data={restrooms}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listTitle}>{item.name}</Text>
          <View style={styles.infoContainer}>
            <FontAwesome name="map-marker" size={16} color="black" />
            <Text style={styles.listText}>{item.street}</Text>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesome name="building" size={16} color="black" />
            <Text style={styles.listText}>{item.city}, {item.state}</Text>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesome name="wheelchair" size={16} color={item.accessible ? 'green' : 'red'} />
            <Text style={styles.listText}>{item.accessible ? 'Accessible' : 'Not Accessible'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesome name="genderless" size={16} color={item.unisex ? 'blue' : 'gray'} />
            <Text style={styles.listText}>{item.unisex ? 'Unisex' : 'Gender-specific'}</Text>
          </View>
          {/* Button to navigate to the map */}
          <TouchableOpacity style={styles.mapButton} onPress={() => onNavigateToMap(item.latitude, item.longitude)}>
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

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
