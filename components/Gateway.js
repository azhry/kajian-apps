import React, { Component } from 'react';
import { Alert, Image, TouchableOpacity, View, StatusBar, AsyncStorage, PermissionsAndroid } from 'react-native';
import { Button, Form, Input, Item, H1, Container, Label, Root, Text, Toast, Spinner } from 'native-base';
import { NavigationActions } from 'react-navigation';

const BASE_URL  		= 'http://kajian.synapseclc.co.id/';

export default class Gateway extends Component {

	static navigationOptions = {
		header: false
	};

	constructor( props ) {

		super( props );
		this.state = {
			spinner: <Text></Text>
		};

	}

	componentDidMount() {

		// show splash screen for 2.0 seconds
		this._requestLocationPermission();
		setTimeout(() => {
			this._checkAccessToken();
		}, 2000);

	}

	_showSpinner() {
		this.setState({ spinner: ( <Spinner color='white' /> ) });
	}

	async _checkAccessToken() {

		const { navigate } = this.props.navigation;
		try {
			
			this._showSpinner();
			const access_token = await AsyncStorage.getItem( 'accessToken' );

			if ( access_token != null ) {

				fetch(BASE_URL + 'service/check_access_token', {
			        method: 'POST',
			        headers: {
						Accept: 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
			        },
			        body: 'token=' + access_token
			    })
			    .then(( response ) => response.json())
			    .then(( responseJson ) => {
			    	if ( responseJson.loggedIn ) {
			    		const resetAction = NavigationActions.reset({
			    			index: 0,
			    			actions: [
			    				NavigationActions.navigate({ routeName: 'BaseTabs', params: { userData: responseJson.user } })
			    			]
			    		});
			    		this.props.navigation.dispatch( resetAction );
			    	
			    	} else {

			    		this._removeAsyncStorage( 'accessToken' );
			    		// SharedPreferences.removeItem( 'accessToken' );
						const resetAction = NavigationActions.reset({
			    			index: 0,
			    			actions: [
			    				NavigationActions.navigate({ routeName: 'BaseTabs' })
			    			]
			    		});
			    		this.props.navigation.dispatch( resetAction );

			    	}
			    })
			    .catch(( error ) => {
		        	
		        	Toast.show({
						text: 'Can not connect to server',
						position: 'bottom',
						buttonText: 'Close',
						duration: 10000 // 10 seconds
			        });

			        const resetAction = NavigationActions.reset({
		    			index: 0,
		    			actions: [
		    				NavigationActions.navigate({ routeName: 'BaseTabs' })
		    			]
		    		});
		    		this.props.navigation.dispatch( resetAction );
		      	
		      	});

			} else {

				const resetAction = NavigationActions.reset({
	    			index: 0,
	    			actions: [
	    				NavigationActions.navigate({ routeName: 'BaseTabs' })
	    			]
	    		});
	    		this.props.navigation.dispatch( resetAction );

			}

		} catch ( error ) {
			Alert.alert( '#001. An error occured' );
		}

	}

	async _requestLocationPermission() {
		try {
			const checkPermission = PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
			if ( checkPermission != PermissionsAndroid.RESULTS.GRANTED ) {

				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
						'title': 'Location Permission',
						'message': 'App needs access to your Location ' +
						'.'
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					navigator.geolocation.getCurrentPosition(( position ) => {

						this._setAsyncStorage( 'currentLatitude', position.coords.latitude + '' );
						this._setAsyncStorage( 'currentLongitude', position.coords.longitude + '' );

					}, ( error ) => {
						Alert.alert( '#003. An error occured' );
					}, 
					{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });

				} else {
					Alert.alert( 'Location permission denied' );
				}

			} else {

				navigator.geolocation.getCurrentPosition(( position ) => {
						
					this._setAsyncStorage( 'currentLatitude', position.coords.latitude + '' );
					this._setAsyncStorage( 'currentLongitude', position.coords.longitude + '' );

				}, ( error ) => {
					Alert.alert( '#003. An error occured' );
				}, 
				{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });

			}
			
		} catch (err) {
			Alert.alert( '#002. An error occured' );
		}
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

	render() {

		return (
			<Root>
				<StatusBar
					backgroundColor="#1aa3ff"
					barStyle="light-content"
				/>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1aa3ff' }}>
					<Image 
						source={require( '../assets/image/logoGh.png' )}
						style={{ width: 170, height: 170 }} />
					<View style={{ height: 20 }}>
						{ this.state.spinner }
					</View>
				</View>
			</Root>
		);

	}

}