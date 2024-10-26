import React, { useEffect } from "react";
import { Button, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "663580827100-h1ndo1nohe2i35t5b6fistd07c5tal91.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID_HERE",
    iosClientId:
      "663580827100-qk33legf8u74v48slljjbqhvpja6f004.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@Jobesliani/Gotta-Go",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (token) => {
    await AsyncStorage.setItem("authToken", token);
    navigation.navigate("AppNavigator");
  };

  return (
    <View>
      <Button
        title="Login with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
