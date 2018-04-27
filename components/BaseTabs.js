import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, Image, WebView, Alert, StatusBar, AsyncStorage, RefreshControl, AppState } from 'react-native';
import { Body, Container, Content, Drawer, Header, Icon, Left, Right, Root, Spinner, Tab, Tabs, Text, Title, Toast, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import FCM, { FCMEvent, NotificationActionType } from 'react-native-fcm';
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
      playlistLoadingMore: false,
      kajianLoadingMore: false,
      kajianPage: 0,
      refreshing: true,
      notificationOn: true
    };

  }

  shouldComponentUpdate( nextProps, nextState ) {

    if ( this.state.notificationOn !== nextState.notificationOn ) {
      return false;
    }
    return true

  }

  async componentWillMount() {
    try {
      let notificationOn = await AsyncStorage.getItem( 'notificationOn' );
      if ( notificationOn == null ) {

        await AsyncStorage.setItem( 'notificationOn', JSON.stringify( true ) );
        this.setState({ notificationOn: true });
        FCM.subscribeToTopic( 'kajian' );
        FCM.setBadgeNumber( 0 );

      } else {

        if ( notificationOn == 'false' ) {
          this.setState({ notificationOn: false });
          FCM.unsubscribeFromTopic( 'kajian' );
        } else {
          this.setState({ notificationOn: true });
          FCM.subscribeToTopic( 'kajian' );
        }

      }
    } catch ( error ) {
      Alert.alert( '#001. An error occured' );
    }
  }


  componentDidMount() {

    this._fetchAPI();
    this._renderProfileMenu();

    FCM.on(FCMEvent.Notification, ( notif ) => {

      if ( notif.opened_from_tray ) {

        let item = notif.data;
        this.props.navigation.navigate( 'KajianDetail', { item } );

      } else {
        FCM.presentLocalNotification({
          id: new Date().valueOf().toString(),                // (optional for instant notification)
          title: 'Ghuroba',             // as FCM payload
          body: 'Kajian terbaru: ' + notif.fcm.body,                       // as FCM payload (required)
          sound: "bell.mp3",                                  // "default" or filename
          priority: "high",                                   // as FCM payload
          tag: 'kajian_terbaru',
          ticker: 'Kajian terbaru: ' + notif.fcm.body,                   // Android only
          auto_cancel: true,                                  // Android only (default true)
          large_icon: "logogh",                           // Android only
          icon: "logogh",                                // as FCM payload, you can relace this with custom icon you put in mipmap
          color: "red",                                       // Android only
          vibrate: 300,                                       // Android only default: 300, no vibration if you pass 0
          wake_screen: true,                                  // Android only, wake up screen when notification arrives
          group: "group",                                     // Android only
          picture: "https://google.png",                      // Android only bigPicture style
          ongoing: false,                                      // Android only
          data: {
            nama_masjid: notif.nama_masjid,
            video_url: notif.video_url,
            thumbnail: notif.thumbnail,
            waktu_kajian: notif.waktu_kajian,
            latitude: notif.latitude,
            longitude: notif.longitude,
            judul_kajian: notif.judul_kajian,
            alamat: notif.alamat,
            id_jadwal: notif.id_jadwal
          },             
          lights: true,                                       // Android only, LED blinking (default false)
          show_in_foreground: true                           // notification when app is in foreground (local & remote)
        });
      }

    });

  }

  _fetchAPI() {

    fetch(BASE_URL + 'service/get_kajian_per_page?start=' + (this.state.kajianPage * 3) + '&limit=3', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(( response ) => response.json())
      .then(( responseJson ) => {
        
        let res = responseJson;
        let kajian = [];
        if ( this.state.data == null ) {
          kajian = res;
        } else {
          kajian = this.state.data.concat( res );
        }
        this.setState({ data: kajian, kajianLoaded: true, kajianLoadingMore: false, kajianPage: this.state.kajianPage + 1, refreshing: false });
      
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

    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCW-4tOwjHOgmxY0PGfqktRQ&type=video&key=AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA&maxResults=3';
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
              { this._renderNotificationIcon() }
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
              { this._renderNotificationIcon() }
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

  _renderNotificationIcon() {

    if ( this.state.notificationOn ) {
      return (
        <TouchableOpacity onPress={ () => this._toggleNotification() }>
          <Icon
            name="notifications"
            size={ 30 }
            style={{ color: 'white', marginRight: 28 }} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={ () => this._toggleNotification() }>
          <Icon
            name="notifications-off"
            size={ 30 }
            style={{ color: 'white', marginRight: 28 }} />
        </TouchableOpacity>
      );
    }

  }

  async _toggleNotification() {

    try {
      let notificationOn = await AsyncStorage.getItem( 'notificationOn' );
      if ( notificationOn == 'true' ) {
        this.setState({ notificationOn: false }, () => {
          this._renderProfileMenu();
          FCM.unsubscribeFromTopic( 'kajian' );
        });
        await AsyncStorage.setItem( 'notificationOn', JSON.stringify( false ) );
      } else {
        this.setState({ notificationOn: true }, () => {
          this._renderProfileMenu();
          FCM.subscribeToTopic( 'kajian' );
        });
        await AsyncStorage.setItem( 'notificationOn', JSON.stringify( true ) );
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
        // refreshControl={
        //   <RefreshControl
        //     refreshing={ this.state.refreshing }
        //     onRefresh={() => {
        //       this.setState({ kajianPage: 0, data: null, kajianLoaded: false }, () => {
        //         this._fetchAPI();
        //         this.setState({ refreshing: false });
        //       });
        //     }}
        //   />
        // }
        ListFooterComponent={() => {
          if ( this.state.kajianLoadingMore ) {
            return (
              <View style={{ flex: 1, padding: 10 }}>
                <Spinner color='blue' size='small' />
              </View>
            );
          } else {
            return (
              <View style={{ flex: 1 }}>
                <Button full info onPress={() => {
                  this.setState({ kajianLoadingMore: true }, () => this._fetchAPI());
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

  _renderPlaylist() {

    const { navigate } = this.props.navigation;

    if ( this.state.playlistLoaded ) {

      if ( this.state.video.length > 0 ) {

        return(
          <View>
            <FlatList
            data={ this.state.video }
            renderItem={ ({ item }) =>
              <TouchableOpacity onPress={ () => navigate( 'VideoDetail', { item } ) }>
                <VideoCard
                  title={ item.snippet.title }
                  channel={ item.channelTitle }
                  id={ item.id.videoId }
                  url={ 'https://www.youtube.com/embed/' + item.id.videoId } />
              </TouchableOpacity>
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
          />
        </View>);

      } 
      
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ alignSelf: 'center' }}>Playlist ini belum memiliki konten</Text>
        </View>
      );

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
                  <View style={{ flex: 1 }}>
                    { this._renderKajian() }
                  </View>
                </Tab>
                <Tab ref={ 'playlist' } heading="Playlist" tabStyle={{ backgroundColor: '#1aa3ff' }} activeTabStyle={{ backgroundColor: '#1aa3ff' }}>
                    { this._renderPlaylist() }  
                </Tab>
              </Tabs>
            </Container>
          </Drawer>
        </Root>
      );
    

  }
}