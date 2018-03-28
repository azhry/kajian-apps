import React, { Component } from 'react';
import { Dimensions, Alert, Image, TouchableOpacity, StyleSheet, View, WebView, StatusBar } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Button, Card, CardItem, Content, Container, H3, Header, Left, Right, Root, Text, Title, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';
import { Buffer } from 'buffer';

let SharedPreferences   = require( 'react-native-shared-preferences' );
const BASE_URL = 'http://kajian.synapseclc.co.id/';

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

		this.state = {
			region: {
				latitude: lat,
				longitude: lng,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			},
			src: BASE_URL + 'assets/uploads/jadwal/' + this.props.navigation.state.params.item.thumbnail,
			user_id: '',
			attendance: 2, // no attendance
			attendanceButton: this._rerenderAttendanceButton( 2 ),
			dialogVisible: false
		};

	}

	componentDidMount() {

		SharedPreferences.getItem('accessToken', ( value ) => {
			if ( value != undefined ) {
				let tokens = value.split( '.' );
				let user_id =  new Buffer( tokens[0], 'base64' ).toString( 'ascii' );
				this.setState({ user_id: user_id });
				this._checkAttendance( user_id );
			}
		});

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
				attendanceButton: this._rerenderAttendanceButton( responseJson.attendance )
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
					attendanceButton: this._rerenderAttendanceButton( attendanceType ) 
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
		var time = datetime[1];
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

	onShouldStartLoadWithRequest = (navigator) => {
        if (navigator.url.indexOf('embed') !== -1
        ) {
            return true;
        } else {
            this.videoPlayer.stopLoading(); //Some reference to your WebView to make it stop loading that URL
            return false;
        }    
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
								<Body style={ styles.cardBody }>
									<Grid>
										<Col style={{ height: 150, padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
											<Text style={{ fontSize: 17 }} >
												<Icon name="md-pin" style={{ fontSize: 23 }} /> Location
											</Text>
											<Text>{ params.item.nama_masjid }</Text>
											<Text>{ params.item.alamat }</Text>
										</Col>
	            						<Col style={{ height: 150, borderLeftWidth: 0.5, borderLeftColor: '#d6d7da', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
	            							<Text style={{ fontSize: 17 }} >
	            								<Icon name="md-calendar" style={{ fontSize: 23 }} /> Date
	            							</Text>
	            							<Text>{ this._parseDateTime( params.item.waktu_kajian ).date }</Text>
	            							<Text>{ 'Pukul ' + this._parseDateTime( params.item.waktu_kajian ).time }</Text>
	            						</Col>
									</Grid>
									<Grid>
										<Col style={{ height: 250 }}>
											<View style={ styles.container }>
												<MapView
													draggable={ false }
													provider={ PROVIDER_GOOGLE }
													style={ styles.map }
													region={ this.state.region }>
													<Marker
														title={ params.item.nama_masjid }
														coordinate={ this.state.region } />
												</MapView>
											</View>
										</Col>
									</Grid>
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
												{ this.state.attendanceButton }
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
									<WebView 
				                        ref={(ref) => { this.videoPlayer = ref;}}
				                        scalesPageToFit={true} 
				                        source={{ html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="' + this.props.video_url + '?modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}} 
				                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
				                        onNavigationStateChange ={this.onShouldStartLoadWithRequest} //for Android
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
	    ...StyleSheet.absoluteFillObject,
	    height: 250,
	    width: 400,
	    justifyContent: 'flex-end',
	    alignItems: 'center',
	},
 	map: {
    	...StyleSheet.absoluteFillObject,
  	}
});