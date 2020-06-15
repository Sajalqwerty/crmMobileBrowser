import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import CallPopupScreen from '../screens/CallPopupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LeadFormScreen from '../screens/LeadFormScreen';
import ProgressFormScreen from '../screens/ProgressFormScreen';
import StartUpScreen from '../screens/StartUpScreen';

const AppNavigator = createStackNavigator({
    StartUpScreen : StartUpScreen,
    CallPopupScreen : CallPopupScreen,
    DashboardScreen : DashboardScreen,
    ProgressFormScreen : ProgressFormScreen,
    LoginScreen : LoginScreen,
    LeadFormScreen : LeadFormScreen,
});

export default createAppContainer(AppNavigator);



