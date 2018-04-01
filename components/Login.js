import React, { Component } from 'react';
import { Alert, Image, TouchableOpacity, View, StatusBar, KeyboardAvoidingView, StyleSheet, AsyncStorage } from 'react-native';
import { Button, Form, Input, Item, H1, Container, Label, Root, Text, Toast } from 'native-base';
import { NavigationActions } from 'react-navigation';
import LoginForm from './LoginForm';

const BASE_URL  		= 'http://kajian.synapseclc.co.id/';

export default class Login extends Component {

	constructor( props ) {

		super( props );
		this.state = {
			email: '',
			password: ''
		};

	}

	async _checkAccessToken() {

		const { navigate } = this.props.navigation;

		try {
			const access_token = await AsyncStorage.getItem( 'accessToken' );
			if ( access_token != null ) {

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
			    		
			    		this.props.navigation.dispatch(NavigationActions.reset({
			    			index: 0,
			    			actions: [
			    				NavigationActions.navigate({ routeName: 'BaseTabs', params: { userData: responseJson.user } })
			    			]
			    		}));
			    	
			    	} else {

			    		this._removeAsyncStorage( 'accessToken' );
			    		Alert.alert( 'Your access token is expired. Please login again' );

			    	}
			    })
			    .catch(( error ) => {
			    	Alert.alert( 'Can not connect to server' );
		      	});

			}
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

		return(
			<KeyboardAvoidingView behavior="padding" style={ styles.container }>
				<StatusBar
					backgroundColor="#1aa3ff"
					barStyle="light-content"
				/>
				<View style={ styles.logoContainer }>
					<Image
						style={ styles.logo }
						source={ require( '../assets/image/logoGh.png' ) } />
						<Text style={ styles.title }>Aplikasi Ghuroba</Text>
				</View>
				<View style={ styles.formContainer }>
					<LoginForm navigation={ this.props.navigation } />
				</View>
			</KeyboardAvoidingView>
		);

	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1aa3ff'
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	logo: {
		width: 100,
		height: 100
	},
	title: {
		color: '#FFF',
		marginTop: 10,
		width: 160,
		textAlign: 'center',
		opacity: 0.9
	}
});