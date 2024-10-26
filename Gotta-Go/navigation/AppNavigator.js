import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FirstRoute from '../src/routes/FirstRoute'
import SecondRoute from '../src/routes/SecondRoute';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add other app-related screens here */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
