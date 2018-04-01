import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableNativeFeedback, Text, Alert, ActivityIndicator, AsyncStorage } from 'react-native';

const BASE_URL  		= 'http://kajian.synapseclc.co.id/';

export default class LoginForm extends Component {

	constructor( props ) {

		super( props );
		this.state = {
			email: '',
			password: '',
			indicator: (
				<View style={[ styles.indicatorContainer, { opacity: 0 } ]}>
					<ActivityIndicator size="large" color="rgba(255, 255, 255, 0.9)" />
				</View>
			)
		};

	}

	async _login() {

		this.setState({indicator: (
			<View style={[ styles.indicatorContainer, { opacity: 0.9 } ]}>
				<ActivityIndicator size="large" color="rgba(255, 255, 255, 0.9)" />
			</View>
		)});

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
	    		
	    		try {

	    			this._setAsyncStorage( 'accessToken', responseJson.accessToken );
	    			navigate( 'BaseTabs' );

	    		} catch ( error ) {
	    			Alert.alert( '#001. An error occured' );
	    		}
	    	
	    	} else {

	    		Alert.alert( 'Email atau password salah' );

	    	}

	    	this.setState({indicator: (
	    		<View style={[ styles.indicatorContainer, { opacity: 0 } ]}>
					<ActivityIndicator size="large" color="rgba(255, 255, 255, 0.9)" />
				</View>
	    	)});
	    })
	    .catch(( error ) => {
	    	this.setState({indicator: (
	    		<View style={[ styles.indicatorContainer, { opacity: 0 } ]}>
					<ActivityIndicator size="large" color="rgba(255, 255, 255, 0.9)" />
				</View>
	    	)});
        	Alert.alert( 'Can not connect to server' + error.toString() );
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

	render() {

		const { navigate } = this.props.navigation;

		return (
			<View style={ styles.container }>
				<TextInput
					placeholder="Email"
					placeholderTextColor="rgba(255, 255, 255, 0.7)"
					style={ styles.input }
					returnKeyType="next"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={ false }
					onSubmitEditing={() => this.passwordInput.focus()}
					underlineColorAndroid="rgba(0, 0, 0, 0)"
					onChangeText={( text ) => this.setState({ email: text })} />
				<TextInput
					placeholder="Password"
					placeholderTextColor="rgba(255, 255, 255, 0.7)"
					secureTextEntry
					style={ styles.input }
					returnKeyType="go"
					underlineColorAndroid="rgba(0, 0, 0, 0)"
					ref={( input ) => this.passwordInput = input}
					onSubmitEditing={() => this._login()}
					onChangeText={( text ) => this.setState({ password: text })} />

				<TouchableNativeFeedback
					onPress={() => this._login()}
					background={TouchableNativeFeedback.SelectableBackground()}>
					<View style={ styles.buttonContainer }>
						<Text style={ styles.buttonText }>LOGIN</Text>
					</View>
				</TouchableNativeFeedback>

				{ this.state.indicator }

				<TouchableNativeFeedback 
					onPress={() => navigate( 'Register' )}
					backgroundColor={TouchableNativeFeedback.SelectableBackground()}>
					<View style={ styles.registerContainer }>
						<Text style={ styles.registerText }>Belum memiliki akun? Sentuh disini untuk mendaftar</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
		);

	}

}

const styles = StyleSheet.create({
	container: {
		padding: 20
	},
	input: {
		height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginBottom: 20,
		color: '#FFF',
		paddingHorizontal: 10
	},
	buttonContainer: {
		backgroundColor: '#2980B9',
		paddingVertical: 15
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700'
	},
	registerContainer: {
		marginVertical: 40
	},
	registerText: {
		textAlign: 'center',
		color: '#FFF',
		opacity: 0.9
	},
	indicatorContainer: {
		marginTop: 25
	}
});