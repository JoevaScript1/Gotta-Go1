import React from 'react';
import { View, Button } from 'react-native';
import GoogleAuth from '../../auth/GoogleAuth';

export default function LoginScreen({ navigation }) {
  return (
    <View>
      <GoogleAuth navigation={navigation} />
    </View>
  );
}
