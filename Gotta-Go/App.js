import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { supabase } from "./lib/supabase"; // Import Supabase instance
import { Session } from "@supabase/supabase-js";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import fetchRestrooms from "./src/utilities/restrooms";
import FirstRoute from "./src/routes/FirstRoute";
import SecondRoute from "./src/routes/SecondRoute";
import Auth from "./src/componenets/Auth"; // Your Auth component to handle user authentication
import Account from "./src/componenets/Account"; // Your Account component to display user info

export default function App() {
  const layout = useWindowDimensions();
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Map" },
    { key: "second", title: "List View" },
  ]);
  const [restrooms, setRestrooms] = useState([]);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Supabase session management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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

        initRestrooms({
          latitude,
          longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error getting user location:", error.message);
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

  if (!session) {
    return <Auth />; // Render the authentication component if user is not logged in
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : region ? (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
