import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { TabView, SceneMap } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchRestrooms from "./src/utilities/restrooms";
import FirstRoute from "./src/routes/FirstRoute";
import SecondRoute from "./src/routes/SecondRoute";
import SplashScreen from "./src/components/SplashScreen";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: "first", title: "Map" },
    { key: "second", title: "List View" },
  ]);
  const [restrooms, setRestrooms] = useState([]);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const initRestrooms = async (region) => {
    setLoading(true);
    try {
      const restrooms = await fetchRestrooms(region);
      setRestrooms(restrooms);
    } catch (error) {
      console.error("Error fetching restrooms:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Location permission is required to find nearby restrooms."
          );
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
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0421,
        });

        await initRestrooms({
          latitude,
          longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error getting user location:", error.message);
      }
    };

    checkAuthentication();
    getUserLocation();
  }, []);

  const renderScene = SceneMap({
    first: () => (
      <FirstRoute
        restrooms={restrooms}
        region={region}
        setRegion={setRegion}
        fetchRestrooms={initRestrooms}
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

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabViewContainer: {
    flex: 1,
    paddingBottom: 48,
  },
  tabBar: {
    backgroundColor: "#f8f8f8",
  },
  indicator: {
    backgroundColor: "blue",
  },
  tabLabel: {
    color: "black",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    width: 150,
  },
  title: {
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 5,
  },
  refreshButton: {
    position: "absolute",
    bottom: 80,
    right: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
  },
  iconButton: {
    position: "absolute",
    bottom: 20,
    right: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  iconButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 200,
    width: "100%",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  listText: {
    marginLeft: 5,
  },
  mapButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  mapButtonText: {
    color: "white",
    textAlign: "center",
  },
  tabBar: {
    backgroundColor: "#f8f8f8",
  },
  indicator: {
    backgroundColor: "blue",
  },
  tabLabel: {
    color: "black",
  },
});
