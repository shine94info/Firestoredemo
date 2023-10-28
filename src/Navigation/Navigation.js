import {createStackNavigator} from '@react-navigation/stack';
import FormScreen from '../Form';
import CardData from '../CardData';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="CardData" component={CardData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack;
