import React, { Component } from 'react';
import { Dimensions, Alert, Image, TouchableOpacity, StyleSheet, View, WebView, StatusBar, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Button, Card, CardItem, Content, Container, H3, Header, Left, Right, Root, Text, Title, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';
import { Buffer } from 'buffer';
import YouTube from 'react-native-youtube';
import MapViewDirections from 'react-native-maps-directions';

const BASE_URL = 'http://kajian.synapseclc.co.id/';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBti7Fksn7SsHmULginDq1O5qRqX02t6Qg';

export default class KajianDetail extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: (
				<Header style={{ backgroundColor: '#1aa3ff' }}>
					<StatusBar
			           backgroundColor="#1aa3ff"
			           barStyle="light-content"
			        />
					<Left>
						<TouchableOpacity onPress={ () => { navigation.goBack() } }>
							<Icon 
								name="md-arrow-back" 
								style={ styles.backButton } />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title>Kajian Sunnah</Title>
					</Body>
					<Right></Right>
				</Header>
			)
		};
	};

	constructor( props ) {

		super( props );

		let lat = this.props.navigation.state.params.item.latitude == null ? 0 : parseFloat( this.props.navigation.state.params.item.latitude );
		let lng = this.props.navigation.state.params.item.longitude == null ? 0 : parseFloat( this.props.navigation.state.params.item.longitude );

		lat = isNaN( lat ) ? 0 : lat;
		lng = isNaN( lng ) ? 0 : lng;

		this.state = {
			region: {
				latitude: lat,
				longitude: lng,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			},
			currentLocation: {
				latitude: 0,
				longitude: 0
			},
			error: null,
			src: BASE_URL + 'assets/uploads/jadwal/' + this.props.navigation.state.params.item.thumbnail,
			user_id: '',
			attendance: 2, // no attendance
			attendanceButton: this._rerenderAttendanceButton( 2 ),
			dialogVisible: false,
			mapsDialogVisible: false
		};

		this._getCurrentLocation();

	}

	async _getCurrentLocation() {

		try {

			let latitude 	= await AsyncStorage.getItem( 'currentLatitude' );
			let longitude 	= await AsyncStorage.getItem( 'currentLongitude' );
			this.setState({
				currentLocation: {
					latitude: parseFloat( latitude ),
					longitude: parseFloat( longitude )
				}
			}, () => {
				navigator.geolocation.getCurrentPosition(( position ) => {
					this._setAsyncStorage( 'currentLatitude', position.coords.latitude + '' );
					this._setAsyncStorage( 'currentLongitude', position.coords.longitude + '' );
					this.setState({
						currentLocation: {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude
						}
					});

				}, ( error ) => {
					Alert.alert( '#003. An error occured' );
				}, 
				{ enableHighAccuracy: false, timeout: 20000 });
			});

		} catch( error ) {
			Alert.alert( '#001. An error occured' );
		}

	}

	async _setAsyncStorage( key, value ) {

		try {
			await AsyncStorage.setItem( key, value );
		} catch ( error ) {
			Alert.alert( '#001. An error occured' );
		}

	}

	async componentDidMount() {

		try {
			const access_token = await AsyncStorage.getItem( 'accessToken' );
			if ( access_token != null ) {
				let tokens = access_token.split( '.' );
				let user_id =  new Buffer( tokens[0], 'base64' ).toString( 'ascii' );
				this.setState({ user_id: user_id });
				this._checkAttendance( user_id );
			}
		} catch ( error ) {
			Alert.alert( '#001. An error occured' );
		}

	}


	_rerenderAttendanceButton( attendanceType ) {

		if ( attendanceType == 1 || attendanceType == 0 ) {
			
			return (
				<Grid>
		          	<Col>
		          		<Button bordered dark 
		          			onPress={ () => this._confirmAttendance( 2 ) } // absent
		          			style={{ width: 150, justifyContent: 'center' }}>
				          	<Text>Batal</Text>
				        </Button>
		          	</Col>
	          	</Grid>
			);

		} else {
			
			return (
				<Grid>
					<Col>
		          		<Button success 
		          			onPress={ () => this._confirmAttendance( 1 ) }
		          			style={{ width: 75, justifyContent: 'center' }}>
				          	<Text>Ya</Text>
				        </Button>
		          	</Col>
		          	<Col>
		          		<Button danger 
		          			onPress={ () => this._confirmAttendance( 0 ) } // absent
		          			style={{ width: 75, justifyContent: 'center' }}>
				          	<Text>Tidak</Text>
				        </Button>
		          	</Col>
	          	</Grid>
			);

		}
	}

	_checkAttendance( id_user ) {

		fetch(BASE_URL + 'service/check_attendance', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'id_jadwal=' + this.props.navigation.state.params.item.id_jadwal + '&id_user=' + id_user
		})
		.then(( response ) => response.json())
		.then(( responseJson ) => {

			this.setState({
				attendanceType: responseJson.attendance,
				attendanceButton: this._rerenderAttendanceButton( responseJson.attendance ),
				attendance: responseJson.attendance
			});

		})
		.catch(( error ) => {
			Toast.show({
				text: error.toString(),
				position: 'bottom',
				buttonText: 'Close',
				duration: 10000 // 10 seconds
		    });
		});
	
	}

	_confirmAttendance( attendanceType ) {

		if ( this.state.user_id != '' ) {

			fetch(BASE_URL + 'service/set_kehadiran', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: 'attendance=' + attendanceType + '&id_jadwal=' + this.props.navigation.state.params.item.id_jadwal + '&id_user=' + this.state.user_id
			})
			.then(( response ) => response.json())
			.then(( responseJson ) => {

				this.setState({ 
					attendanceType: attendanceType,
					attendanceButton: this._rerenderAttendanceButton( attendanceType ),
					attendance: attendanceType
				});

			})
			.catch(( error ) => {
				Toast.show({
					text: 'Can not connect to server',
					position: 'bottom',
					buttonText: 'Close',
					duration: 10000 // 10 seconds
		        });
			});

		} else {

			this.setState({ dialogVisible: true });

		}
		

	}

	_parseDateTime( datetime ) {
		var datetime = datetime.split( ' ' );
		var month = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];
		var date = datetime[0].split( '-' );
		date = date[2] + ' ' + month[date[1].replace(/^0+/, '')] + ' ' + date[0];
		var time = datetime[1].split( ':' );
		time = time[0] + ':' + time[1];
		return {
			date: date,
			time: time
		};
	}

	_displayAttendanceStatus() {

		if ( this.state.attendanceType == 1 ) {
			return 'Hadir';
		} else if ( this.state.attendanceType == 0 ) {
			return 'Tidak hadir';
		}

		return '';

	}

	_getVideoId( url ) {
		let video_url = url.split( '/' );
		if ( video_url.length >= 4 ) {
			return video_url[4];
		}

		return '';
	}

	onShouldStartLoadWithRequest = (navigator) => {
        if (navigator.url.indexOf('embed') !== -1
        ) {
            return true;
        } else {
            this.videoPlayer.stopLoading(); //Some reference to your WebView to make it stop loading that URL
            return false;
        }    
    }

    _renderMaps() {

    	const { params } = this.props.navigation.state;
    	if ( this.state.mapsDialogVisible ) {
    		return (
    			<View style={ styles.container }>
					<MapView
						draggable={ false }
						provider={ PROVIDER_GOOGLE }
						style={ styles.map }
						region={ this.state.region }
						onRegionChangeComplete={() => {
							this.orgMarker.showCallout();
						}}>
						<Marker
							title={ params.item.nama_masjid }
							coordinate={ this.state.region }
							ref={ marker => this.destMarker = marker } />
						<Marker
							title="Lokasi Anda"
							coordinate={ this.state.currentLocation }
							pinColor={ '#1aa3ff' }
							ref={ marker => this.orgMarker = marker } />
						<MapViewDirections
							origin={ this.state.currentLocation }
							destination={ this.state.region }
							apikey={ GOOGLE_MAPS_API_KEY }
							strokeWidth={ 3 }
							strokeColor="hotpink" />
					</MapView>
				</View>
    		);
    	}

    	return null;
    }


	render() {

		const { params } = this.props.navigation.state;

		return (
			<Root>
				<Container>
					<ConfirmDialog
					    title="Kehadiran"
					    message="Anda harus login terlebih dahulu untuk mengisi kehadiran"
					    visible={ this.state.dialogVisible }
					    onTouchOutside={() => this.setState({ dialogVisible: false })}
					    positiveButton={{
					        title: "YES",
					        onPress: () => {
					        	this.props.navigation.dispatch(NavigationActions.reset({
					    			index: 0,
					    			actions: [
					    				NavigationActions.navigate({ routeName: 'Login' })
					    			]
					    		}));
					        }
					    }}
					    negativeButton={{
					        title: "NO",
					        onPress: () => {
					        	this.setState({ dialogVisible: false });
					        }
					    }}
					/>
					<ConfirmDialog
						style={{ flex: 1, height: 400 }}
					    title="Peta Lokasi"
					    visible={ this.state.mapsDialogVisible }
					    onTouchOutside={() => this.setState({ mapsDialogVisible: false })}
					    positiveButton={{
					        title: "Tutup",
					        onPress: () => {
					        	this.setState({ mapsDialogVisible: false });
					        }
					    }}>
					    <View>
					    	{ this._renderMaps() }
					    </View>
					</ConfirmDialog>
					<Content>
						<Card>
							<CardItem style={ styles.cardBody }>
								<Text style={{ fontSize: 16 }}>{ params.item.judul_kajian }</Text>
							</CardItem>
							<CardItem cardBody>
								<Image 
									source={{ uri: this.state.src }}
									onError={ (e) => { this.setState({ src: 'http://placehold.it/350x200' }) } } 
									style={ styles.cardImage } />
							</CardItem>
							<CardItem>
								<Body>
									<View style={[ styles.cardBody ]}>
										<Text>
											<Icon name="md-calendar" style={{ fontSize: 18 }}/> { 'Tanggal '+ this._parseDateTime( params.item.waktu_kajian ).date }
										</Text>
										<Text>
											<Icon name="md-clock" style={{ fontSize: 16 }}/> { 'Pukul ' + this._parseDateTime( params.item.waktu_kajian ).time }
										</Text>
										<Text>
											<Icon name="md-pin" style={{ fontSize: 18 }}/> { params.item.nama_masjid }
										</Text>
										<Text style={{ fontSize: 14 }}>{ params.item.alamat }</Text>
									</View>
									<Button info small onPress={() => this.setState({ mapsDialogVisible: true })}>
										<Text>Lihat Peta</Text>
									</Button>
								</Body>
							</CardItem>
							<CardItem>
								<Body style={ styles.cardBody }>
									<Grid>
										<Col style={{ padding: 10 }}>
											<Text>
												Apakah akan hadir?
											</Text>
											<Text>
												{ this._displayAttendanceStatus() }
											</Text>
										</Col>
	            						<Col style={{ padding: 10 }}>
	        								<Content>
												{ this._rerenderAttendanceButton( this.state.attendance ) }
									        </Content>
	            						</Col>
									</Grid>
								</Body>
							</CardItem>
						</Card>
						<Card>
							<CardItem>
								<Body style={ styles.cardBody }>
									<Text>{ params.item.deskripsi_kajian }</Text>
								</Body>
							</CardItem>
							<CardItem>
								<View style={{ height: 300 }}>
									<YouTube
							            apiKey='AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA'
							            videoId={ this._getVideoId( params.item.video_url ) } // The YouTube video ID
							            play={false}           // control playback of video with true/false
							            hidden={false}        // control visiblity of the entire view
							            playsInline={true}    // control whether the video should play inline
							            style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
							        />
				                     <Text style={{ opacity: 0 }}>This is just placeholder text to display youtube video on WebView</Text>
								</View>
							</CardItem>
						</Card>
					</Content>
				</Container>
			</Root>
		);

	}

}


const styles = StyleSheet.create({
	backButton: {
		fontSize: 25,
		color: 'white',
		marginLeft: 10
	},
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	},
	cardBody: {
		opacity: 0.6
	},
	container: {
	    height: 250,
	    width: 263,
	    alignItems: 'center',
	    justifyContent: 'center'
	},
 	map: {
    	...StyleSheet.absoluteFillObject,
  	}
});

// <Grid>
// 										<Col style={{ height: 250 }}>
											
// 										</Col>
// 									</Grid>

// AIzaSyCcsdhzlDXAOHihT8kYUqvxBPhXDv4qtm0