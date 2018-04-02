import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Header, Body, Title, Left, Icon } from 'native-base';
import Gateway from './components/Gateway';
import Login from './components/Login';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import BaseTabs from './components/BaseTabs';
import KajianDetail from './components/KajianDetail';
import Profile from './components/Profile';
import VideoDetail from './components/VideoDetail';

const App = StackNavigator(
  {
  	Gateway: { screen: Gateway },
    BaseTabs: { screen: BaseTabs },
    KajianDetail: { screen: KajianDetail },
    VideoDetail: { screen: VideoDetail },
    Profile: { screen: Profile },
    Login: { screen: Login, navigationOptions: { header: false } },
    Register: { screen: Register, navigationOptions: { header: false } }
  },
  {
    initialRouteName: 'Gateway'
  }
);

export default App;

// https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCLA_DiR1FfKNvjuUpBHmylQ&eventType=live&type=video&key=AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA