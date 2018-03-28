import React, { Component } from 'react';
import { Alert, Image, TouchableOpacity, View, StatusBar } from 'react-native';
import { Button, Form, Input, Item, H1, Container, Label, Root, Text, Toast, Spinner } from 'native-base';
import { NavigationActions } from 'react-navigation';

let SharedPreferences 	= require( 'react-native-shared-preferences' );
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
		setTimeout(() => {
			this._checkAccessToken();
		}, 2000);

	}

	_showSpinner() {
		this.setState({ spinner: ( <Spinner color='blue' /> ) });
	}

	_checkAccessToken() {

		const { navigate } = this.props.navigation;
		SharedPreferences.getItem('accessToken', ( value ) => {

			this._showSpinner();
			if ( value != undefined && value != null ) {
				fetch(BASE_URL + 'service/check_access_token', {
			        method: 'POST',
			        headers: {
						Accept: 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
			        },
			        body: 'token=' + value
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

			    		SharedPreferences.removeItem( 'accessToken' );
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

		});

	}

	render() {

		return (
			<Root>
				<StatusBar
					backgroundColor="#1aa3ff"
					barStyle="light-content"
				/>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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