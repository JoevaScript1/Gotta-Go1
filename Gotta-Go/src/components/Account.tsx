// src/components/Account.js
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Account({ session }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(session.user.email);
  const [username, setUsername] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch additional profile data (e.g., username) from your Supabase database
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (data) setUsername(data.username);
    } catch (error) {
      Alert.alert("Error loading profile!", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update (e.g., updating the username)
  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", session.user.id);

      if (error) throw error;
      Alert.alert("Profile updated!");
    } catch (error) {
      Alert.alert("Error updating profile!", error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Sign out the user
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error signing out!", error.message);
  };

  // Load profile data when component mounts
  React.useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text>Email: {email}</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />

      <Button
        title={updating ? "Updating..." : "Update Profile"}
        onPress={handleUpdateProfile}
        disabled={updating}
      />

      <Button title="Sign Out" onPress={handleSignOut} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
