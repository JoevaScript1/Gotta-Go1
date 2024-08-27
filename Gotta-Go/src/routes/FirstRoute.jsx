import React, { useState } from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, Modal  } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
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
export default FirstRoute

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
