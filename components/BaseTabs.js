import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, Image, WebView } from 'react-native';
import { Body, Container, Content, Drawer, Header, Icon, Left, Right, Root, Spinner, Tab, Tabs, Text, Title, Toast } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Sidebar from './Sidebar';
import KajianCard from './KajianCard';

let SharedPreferences   = require( 'react-native-shared-preferences' );
const BASE_URL          = 'http://kajian.synapseclc.co.id/';

export default class BaseTabs extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: () => {
        return (<Header hasTabs>
          <Left>
            <Image source={ require( '../assets/image/logoGh.png' ) }
              style={{ width: 30, height: 30 }} />
          </Left>
          <Body>
            <Title>Kajian Sunnah</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={ () => navigation.navigate( 'Profile', { userData: navigation.getParam( 'userData' ) } ) }>
              <Icon
                name="person"
                size={ 30 }
                style={{ color: 'white', marginRight: 28 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => this._logout( navigation ) }>
              <Icon
                name="md-exit"
                size={ 30 }
                style={{ color: 'white' }} />
            </TouchableOpacity>
          </Right>
        </Header>
      );
      }
    }
  };

  constructor( props ) {

    super( props );

    this.state = { 
      data: null,
      connected: false,
      videoHeight: 299
    };

    // console.log( this.props.navigation.getParam( 'userData' ) );

  }


  componentDidMount() {

    this._fetchAPI();

  }

  _fetchAPI() {

    fetch(BASE_URL + 'service/get_kajian', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(( response ) => response.json())
      .then(( responseJson ) => {
        
        this.setState({ data: responseJson });
      
      })
      .catch(( error ) => {
        Toast.show({
          text: 'Can not connect to server',
          position: 'bottom',
          buttonText: 'Close',
          duration: 10000 // 10 seconds
        });
      });

  }

  render() {

    if ( this.state.data == null ) {

      return (
        <Root>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <Spinner color='blue' />
          </View>
        </Root>
      );
    
    } else {

      const { navigate } = this.props.navigation;

      openDrawer = () => {
        this.drawer._root.open();
      };

      _logout = ( nav ) => {

        SharedPreferences.removeItem( 'accessToken' );
        nav.dispatch( NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        }) );

      };

      return (
        <Root>
          <Drawer
            ref={ (ref) => { this.drawer = ref } }
            content={ <Sidebar navigator={ this.navigator } /> }
            onClose={ () => this.drawer._root.close() }>
            <Container>
              <Content>
                <Tabs initialPage={0}>
                  <Tab heading="Kajian">
                    <FlatList
                      data={ this.state.data }
                      renderItem={ ({ item }) =>
                        <TouchableOpacity onPress={ () => navigate( 'KajianDetail', { item } ) }>
                          <KajianCard 
                            title={ item.judul_kajian } 
                            lecturer={ item.nama_ustad }
                            imgSrc={ BASE_URL + 'assets/uploads/jadwal/' + item.thumbnail } />
                        </TouchableOpacity>

                      }
                      keyExtractor={ ( item, index ) => index.toString() }
                    />
                  </Tab>
                  <Tab heading="Live Streaming">
                    <View style={{ height: 300 }}>
                      <WebView
                        style={{flex:1}}
                        javaScriptEnabled={true}
                        source={{uri: 'https://www.youtube.com/embed/wwMDvPCGeE0'}}
                      />
                    </View>
                  </Tab>
                </Tabs>
              </Content>
            </Container>
          </Drawer>
        </Root>
      );

    }
    

  }
}