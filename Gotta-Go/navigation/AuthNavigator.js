import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/routes/LoginScreen'
import GoogleAuth from '../auth/GoogleAuth';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Add other auth-related screens here */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
