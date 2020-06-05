import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CallPopupScreen from '../screens/CallPopupScreen';
import DashboardScreen from '../screens/DashboardScreen';

const AppNavigator = createStackNavigator({
    CallPopupScreen : CallPopupScreen,
    // DashboardScreen : DashboardScreen,
    LoginScreen : LoginScreen,
    CategoriesScreen : CategoriesScreen,
});

export default createAppContainer(AppNavigator);



