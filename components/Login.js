import React, { Component } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Button, Form, Input, Item, H1, Container, Label, Root, Text, Toast } from 'native-base';

let SharedPreferences 	= require( 'react-native-shared-preferences' );
const BASE_URL  		= 'http://kajian.synapseclc.co.id/';

export default class Login extends Component {

	constructor( props ) {

		super( props );
		this.state = {
			email: '',
			password: ''
		};
		this._checkAccessToken();

	}

	_checkAccessToken() {

		const { navigate } = this.props.navigation;
		SharedPreferences.getItem('accessToken', ( value ) => {
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
			    		
			    		navigate( 'BaseTabs' );
			    	
			    	} else {

			    		// SharedPreferences.removeItem( 'accessToken' );
						Toast.show({
							text: 'Your access token is expired. Please login again',
							position: 'bottom',
							buttonText: 'Close',
							duration: 10000 // 10 seconds
				        });

			    	}
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
		});

	}

	_login() {

		const { navigate } = this.props.navigation;

		let email 		= this.state.email;
		let password 	= this.state.password;
		fetch(BASE_URL + 'service/login', {
	        method: 'POST',
	        headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
	        },
	        body: 'email=' + email + '&password=' + password
	    })
	    .then(( response ) => response.json())
	    .then(( responseJson ) => {
	    	if ( responseJson.loggedIn ) {
	    		
	    		SharedPreferences.setItem( 'accessToken', responseJson.accessToken );
	    		navigate( 'BaseTabs' );
	    	
	    	} else {

	    		Alert.alert( 'Email atau password salah' );

	    	}
	    })
	    .catch(( error ) => {
        	Toast.show({
				text: 'Can not connect to server' + error.toString(),
				position: 'bottom',
				buttonText: 'Close',
				duration: 10000 // 10 seconds
	        });
      	});
	}


	render() {

		const { navigate } = this.props.navigation;

		return (
			<Root>
				<Container style={{ justifyContent: 'center' }}>
					<H1 style={{ textAlign: 'center', opacity: 0.6 }}>Aplikasi Kajian Sunnah</H1>
					<Form>
						<Item floatingLabel>
							<Label>Email</Label>
							<Input
								onChangeText={( text ) => this.setState({ email: text })} />
						</Item>
						<Item floatingLabel last>
							<Label>Password</Label>
							<Input 
								secureTextEntry={ true } 
								onChangeText={( text ) => this.setState({ password: text })} />
						</Item>
						<Button block primary
							style={{ marginTop: 15 }}
							onPress={ () => this._login() }>
							<Text>Login</Text>
						</Button>
					</Form>
					<TouchableOpacity onPress={ () => navigate( 'Register' ) } >
						<Text 
							style={{ textAlign: 'center', opacity: 0.6, marginTop: 18, color: '#0275d8' }}>
							Belum memiliki akun? Sentuh disini untuk mendaftar
						</Text>
					</TouchableOpacity>
				</Container>
			</Root>
		);

	}

}