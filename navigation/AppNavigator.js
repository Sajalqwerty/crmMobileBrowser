import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CallPopupScreen from '../screens/CallPopupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LeadFormScreen from '../screens/LeadFormScreen';
import ProgressFormScreen from '../screens/ProgressFormScreen';
import StartUpScreen from '../screens/StartUpScreen';

const AppNavigator = createStackNavigator({
    DashboardScreen : DashboardScreen,
    LeadFormScreen : LeadFormScreen,
    StartUpScreen : StartUpScreen,
    LoginScreen : LoginScreen,
    ProgressFormScreen : ProgressFormScreen,
    CallPopupScreen : CallPopupScreen,
    CategoriesScreen : CategoriesScreen,
});

export default createAppContainer(AppNavigator);



