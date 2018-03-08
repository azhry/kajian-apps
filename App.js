import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Header, Body, Title, Left, Icon } from 'native-base';
import Gateway from './components/Gateway';
import Login from './components/Login';
import Register from './components/Register';
import BaseTabs from './components/BaseTabs';
import KajianDetail from './components/KajianDetail';

const App = StackNavigator(
  {
  	Gateway: { screen: Gateway },
    BaseTabs: { screen: BaseTabs },
    KajianDetail: { screen: KajianDetail },
    Login: { screen: Login, navigationOptions: { header: false } },
    Register: { screen: Register, navigationOptions: { header: false } }
  },
  {
    initialRouteName: 'Gateway'
  }
);

export default App;