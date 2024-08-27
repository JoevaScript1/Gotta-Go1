import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity,} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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


  export default SecondRoute