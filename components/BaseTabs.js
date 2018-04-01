import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, Image, WebView, Alert, StatusBar, AsyncStorage } from 'react-native';
import { Body, Container, Content, Drawer, Header, Icon, Left, Right, Root, Spinner, Tab, Tabs, Text, Title, Toast, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Sidebar from './Sidebar';
import KajianCard from './KajianCard';
import VideoCard from './VideoCard';

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
      video: null,
      kajianLoaded: false,
      playlistLoaded: false,
      nextPageToken: null,
      playlistLoadingMore: false
    };


  }


  componentDidMount() {

    this._fetchAPI();
    // this._fetchYoutubeVideoAPI();
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
        
        this.setState({ data: responseJson, kajianLoaded: true });
      
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

    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCun963voz27VxJXrwkbZ0TA&type=video&key=AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA&maxResults=3';
    if ( this.state.nextPageToken != null ) {
      url += '&pageToken=' + this.state.nextPageToken;
    }

    fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(( response ) => response.json())
      .then(( responseJson ) => {
        
        let res = responseJson;
        let video = [];
        if ( this.state.video == null ) {
          video = res.items;
        } else {
          video = this.state.video.concat( res.items );
        }
        this.setState({ video: video, playlistLoaded: true, playlistLoadingMore: false, nextPageToken: responseJson.nextPageToken });
      
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

  async _setAsyncStorage( key, value ) {

    try {
      await AsyncStorage.setItem( key, value );
    } catch ( error ) {
      Alert.alert( '#001. An error occured' );
    }

  }

  async _removeAsyncStorage( key ) {
    try {
      await AsyncStorage.removeItem( key );
    } catch ( error ) {
      Alert.alert( '#001. An error occured' );
    }
  }

  async _renderProfileMenu() {

    try {

      const access_token = await AsyncStorage.getItem( 'accessToken' );
      if ( access_token != null ) {
         this.props.navigation.setParams({
          profileMenu: (
            <Right>
              {/*<TouchableOpacity onPress={ () => this.props.navigation.navigate( 'Profile', { userData: this.props.navigation.getParam( 'userData' ) } ) }>
                              <Icon
                                name="person"
                                size={ 30 }
                                style={{ color: 'white', marginRight: 28 }} />
              </TouchableOpacity>*/}
              <TouchableOpacity onPress={ () => {

                this._removeAsyncStorage( 'accessToken' );
                  this.props.navigation.dispatch( NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login' })
                    ]
                }) );
              } }>
                <Text style={{ color: '#FFF' }}>Logout</Text>
              </TouchableOpacity>
            </Right>
        )});
      } else {
        this.props.navigation.setParams({
          profileMenu: (
            <Right>
              {/*<TouchableOpacity onPress={ () => this.props.navigation.navigate( 'Profile', { userData: this.props.navigation.getParam( 'userData' ) } ) }>
                              <Icon
                                name="person"
                                size={ 30 }
                                style={{ color: 'white', marginRight: 28 }} />
              </TouchableOpacity>*/}
              <TouchableOpacity onPress={ () => {
                this.props.navigation.navigate( 'Login' );
              } }>
                <Text style={{ color: '#FFF' }}>Login</Text>
              </TouchableOpacity>
            </Right>
        )});
      }

    } catch ( error ) {
      Alert.alert( '#001. An error occured' );
    }

  }

  _onChangeTabHandler(ref) {

    if ( ref.ref.ref == 'playlist' ) {
      if ( !this.state.playlistLoaded ) {
        this._fetchYoutubeVideoAPI();
      }
    }

  }

  _renderKajian() {

    const { navigate } = this.props.navigation;

    if ( this.state.kajianLoaded ) {
      return(<FlatList
        data={ this.state.data }
        renderItem={ ({ item }) =>
          <TouchableOpacity onPress={ () => navigate( 'KajianDetail', { item } ) }>
            <KajianCard 
              title={ item.judul_kajian } 
              lecturer={ item.nama_ustad }
              videoUrl={ item.video_url }
              time={ item.waktu_kajian }
              imgSrc={ BASE_URL + 'assets/uploads/jadwal/' + item.thumbnail } />
          </TouchableOpacity>

        }
        keyExtractor={ ( item, index ) => index.toString() }
        getItemLayout={ (data, index) => ({ length: 400, offset: 50 * index, index }) }
      />);
    }

    return(<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner color='blue' />
    </View>);

  }

  _renderPlaylist() {

    if ( this.state.playlistLoaded ) {
      return(<FlatList
        data={ this.state.video }
        renderItem={ ({ item }) =>
          <VideoCard
            title={ item.snippet.title }
            channel={ item.channelTitle }
            id={ item.id.videoId }
            url={ 'https://www.youtube.com/embed/' + item.id.videoId } />
        }
        keyExtractor={ ( item, index ) => index.toString() }
        getItemLayout={ (data, index) => ({ length: 400, offset: 50 * index, index }) }
        ListFooterComponent={() => {
          if ( this.state.playlistLoadingMore ) {
            return (
              <View style={{ flex: 1, padding: 10 }}>
                <Spinner color='blue' size='small' />
              </View>
            );
          } else {
            return (
              <View style={{ flex: 1 }}>
                <Button full info onPress={() => {
                  this.setState({ playlistLoadingMore: true }, () => this._fetchYoutubeVideoAPI());
                }}> 
                  <Text>Load more</Text>
                </Button>
              </View>
            );
          }
        }}
      />);
    }

    return(<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner color='blue' />
    </View>);

  }

  render() {

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
              <Tabs initialPage={0} onChangeTab={( ref ) => this._onChangeTabHandler( ref )}>
                <Tab ref={ 'kajian' } heading="Kajian" tabStyle={{ backgroundColor: '#1aa3ff' }} activeTabStyle={{ backgroundColor: '#1aa3ff' }}>
                  <Content>
                    { this._renderKajian() }
                  </Content>
                </Tab>
                <Tab ref={ 'playlist' } heading="Playlist" tabStyle={{ backgroundColor: '#1aa3ff' }} activeTabStyle={{ backgroundColor: '#1aa3ff' }}>
                  <View>
                    { this._renderPlaylist() }  
                  </View>                  
                </Tab>
              </Tabs>
            </Container>
          </Drawer>
        </Root>
      );
    

  }
}