import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, Text, View } from 'react-native';
import home from '../screens/home';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();


function Navigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name="Home" options ={{headerShown:false}}component={home} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default Navigation;