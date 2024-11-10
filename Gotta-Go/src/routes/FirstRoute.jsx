import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Map from '../components/Map';
import { logout } from 'C:/Users/jobes/Documents/GitHub/Gotta-Go1/Gotta-Go/lib/supabase';

const FirstRoute = ({ restrooms, region, setRegion, fetchRestrooms, userLocation }) => {
  const [iconType, setIconType] = useState('default'); // Default to classic pin
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Map
        region={region}
        onRegionChangeComplete={setRegion}
        restrooms={restrooms}
        iconType={iconType}
      />

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

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Modal for Icon Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Picker
            selectedValue={iconType}
            onValueChange={(itemValue) => setIconType(itemValue)}
          >
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="Alternative" value="alternative" />
          </Picker>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FirstRoute;
