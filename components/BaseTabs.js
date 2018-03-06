import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, NetInfo } from 'react-native';
import { Body, Container, Content, Header, Spinner, Tab, Tabs, Text, Toast } from 'native-base';
import KajianCard from './KajianCard';

const BASE_URL  = 'http://192.168.43.144/kajian/';

export default class BaseTabs extends Component {

  constructor( props ) {

    super( props );

    this.state = { 
      data: null,
      connected: false
    };

  }

  componentDidMount() {

    this._fetchAPI();
    NetInfo.isConnected.addEventListener( 'change', this._handleConnectionChange );

  }

  _handleConnectionChange() {

    NetInfo.isConnected.fetch()
      .then(isConnected => {
        this.setState({ connected: isConnected });
        if ( isConnected ) {
          _fetchAPI();
        }
      });

  }

  _fetchAPI() {

    fetch(BASE_URL + 'service', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'param1=param_1&param2=param_2'
      })
      .then(( response ) => response.json())
      .then(( responseJson ) => {
        
        this.setState({ data: responseJson });
        console.log( responseJson );
      
      })
      .catch(( error ) => {
        Toast.show({
          text: 'No internet connection!',
          position: 'bottom',
          buttonText: 'Close'
        });
      });

  }

  render() {

    if ( this.state.data == null ) {

      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Spinner color='blue' />
        </View>
      );
    
    } 
    // else if ( this.state.connected == false ) {

    //   return (
    //     <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
    //       <Text>No internet connection!</Text>
    //     </View>
    //   );

    // } 
    else {

      const { navigate } = this.props.navigation;

      return (
        <Container>
          <Tabs initialPage={0}>
            <Tab heading="Kajian">
              
              <Content>
                <FlatList
                  data={ this.state.data }
                  renderItem={ ({ item }) =>
                    <TouchableOpacity onPress={ () => navigate( 'KajianDetail', { title: item.title } ) }>
                      <KajianCard 
                        title={ item.title } 
                        lecturer={ item.lecturer }
                        imgSrc={ item.imgSrc } />
                    </TouchableOpacity>

                  }
                  keyExtractor={ ( item, index ) => index.toString() }
                />
              </Content>

            </Tab>
            <Tab heading="Playlist">
              
              {/* Playlist implementation here */}

            </Tab>
          </Tabs>
        </Container>
      );

    }
    

  }
}