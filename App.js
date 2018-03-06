import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Header, Body, Title, Left } from 'native-base';
import BaseTabs from './components/BaseTabs';
import KajianDetail from './components/KajianDetail';

const App = StackNavigator(
  {
    BaseTabs: { 
      screen: BaseTabs,
      navigationOptions: {
        header: (
          <Header hasTabs>
            <Left>
              <Title>Kajian</Title>
            </Left>
          </Header>
        )
      } 
    },
    KajianDetail: { screen: KajianDetail }
  },
  {
    initialRouteName: 'BaseTabs'
  }
);

export default App;