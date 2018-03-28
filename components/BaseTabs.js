import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, Image, WebView, Alert, StatusBar } from 'react-native';
import { Body, Container, Content, Drawer, Header, Icon, Left, Right, Root, Spinner, Tab, Tabs, Text, Title, Toast } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Sidebar from './Sidebar';
import KajianCard from './KajianCard';
import VideoCard from './VideoCard';

let SharedPreferences   = require( 'react-native-shared-preferences' );
const BASE_URL          = 'http://kajian.synapseclc.co.id/';

export default class BaseTabs extends Component {

  static navigationOptions = ({ navigation }) => {

    const {params = {}} = navigation.state;

    return {
      header: () => {
        return (<Header hasTabs style={{ backgroundColor: '#1aa3ff' }}>
          <StatusBar
           backgroundColor="#1aa3ff"
           barStyle="light-content"
         />
          <Left>
            <Image source={ require( '../assets/image/logoGh.png' ) }
              style={{ width: 30, height: 30 }} />
          </Left>
          <Body>
            <Title>Kajian Sunnah</Title>
          </Body>
          
            { params.profileMenu }
          
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
      videoHeight: 299,
      video: null
    };


  }


  componentDidMount() {

    this._fetchAPI();
    this._fetchYoutubeVideoAPI();
    this._renderProfileMenu();

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

  _fetchYoutubeVideoAPI() {

    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCun963voz27VxJXrwkbZ0TA&type=video&key=AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA&maxResults=20', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(( response ) => response.json())
      .then(( responseJson ) => {
        
        let res = responseJson;
        this.setState({ video: res.items });
      
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

  _renderProfileMenu() {


    SharedPreferences.getItem('accessToken', ( value ) => {
      if ( value != undefined ) {
        this.props.navigation.setParams({
          profileMenu: (
            <Right>
              <TouchableOpacity onPress={ () => this.props.navigation.navigate( 'Profile', { userData: this.props.navigation.getParam( 'userData' ) } ) }>
                <Icon
                  name="person"
                  size={ 30 }
                  style={{ color: 'white', marginRight: 28 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => {
                SharedPreferences.removeItem( 'accessToken' );
                  this.props.navigation.dispatch( NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login' })
                    ]
                }) );
              } }>
                <Icon
                  name="md-exit"
                  size={ 30 }
                  style={{ color: 'white' }} />
              </TouchableOpacity>
            </Right>
        )});
      }
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

      return (
        <Root>
          <Drawer
            ref={ (ref) => { this.drawer = ref } }
            content={ <Sidebar navigator={ this.navigator } /> }
            onClose={ () => this.drawer._root.close() }>
            <Container>
              <Content>
                <Tabs initialPage={0}>
                  <Tab heading="Kajian" tabStyle={{ backgroundColor: '#1aa3ff' }} activeTabStyle={{ backgroundColor: '#1aa3ff' }}>
                    <FlatList
                      data={ this.state.data }
                      renderItem={ ({ item }) =>
                        <TouchableOpacity onPress={ () => navigate( 'KajianDetail', { item } ) }>
                          <KajianCard 
                            title={ item.judul_kajian } 
                            lecturer={ item.nama_ustad }
                            videoUrl={ item.video_url }
                            imgSrc={ BASE_URL + 'assets/uploads/jadwal/' + item.thumbnail } />
                        </TouchableOpacity>

                      }
                      keyExtractor={ ( item, index ) => index.toString() }
                      getItemLayout={ (data, index) => ({ length: 400, offset: 50 * index, index }) }
                    />
                  </Tab>
                  <Tab heading="Playlist" tabStyle={{ backgroundColor: '#1aa3ff' }} activeTabStyle={{ backgroundColor: '#1aa3ff' }}>
                    <FlatList
                      data={ this.state.video }
                      renderItem={ ({ item }) =>
                        <VideoCard
                          title={ item.snippet.title }
                          channel={ item.channelTitle }
                          url={ 'https://www.youtube.com/embed/' + item.id.videoId } />
                      }
                      keyExtractor={ ( item, index ) => index.toString() }
                      getItemLayout={ (data, index) => ({ length: 400, offset: 50 * index, index }) }
                    />
                    
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