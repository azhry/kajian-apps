import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView, View, ScrollView, StatusBar, StyleSheet, TextInput } from 'react-native';
import { Button, Form, Input, Item, H2, Container, Content, Label, Root, Text, ListItem, Left, Radio, Toast } from 'native-base';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DialogProgress from 'react-native-dialog-progress';
import { NavigationActions } from 'react-navigation';

const BASE_URL  		= 'http://kajian.synapseclc.co.id/';

export default class Register extends Component {

	constructor( props ) {

		super( props );
		this.state = {
			nama: '',
			alamat: '',
			email: '',
			password: '',
			jenis_kelamin: '',
			nomor_hp: ''
		};
	}

	_register() {

		DialogProgress.show({
			title: 'Loading',
			isCancelable: false
		});

		let formValidation = this._validateForm( this.state );
		if ( formValidation.success ) {
			const { navigate } 	= this.props.navigation;
			let nama 			= this.state.nama;
			let alamat 			= this.state.alamat;
			let email 			= this.state.email;
			let password  		= this.state.password;
			let jenis_kelamin 	= this.state.jenis_kelamin;
			let nomor_hp 		= this.state.nomor_hp;

			fetch(BASE_URL + 'service/register', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: 'nama=' + nama + '&alamat=' + alamat + '&email=' + email + '&password=' + password + '&jenis_kelamin=' + jenis_kelamin + '&nomor_hp=' + nomor_hp
			})
			.then(( response ) => response.json())
			.then(( responseJson ) => {

				DialogProgress.hide();
				if ( responseJson.success ) {

					this.props.navigation.dispatch(NavigationActions.reset({
		    			index: 0,
		    			actions: [
		    				NavigationActions.navigate({ routeName: 'Login' })
		    			]
		    		}));
				}

			})
			.catch(( error ) => {

				DialogProgress.hide();
				Alert.alert( 'Can not connect to server ' + error.toString() );

			});	
		} else {
			DialogProgress.hide();
			Alert.alert( formValidation.message );
		}

		

	}

	_validateForm( formData ) {

		if ( formData.nama == undefined || formData.nama.length <= 0 ) return { success: false, message: 'Nama harus diisi' };
		if ( formData.alamat == undefined || formData.alamat.length <= 0 ) return { success: false, message: 'Alamat harus diisi' };
		if ( formData.email == undefined || formData.email.length <= 0 ) return { success: false, message: 'Email harus diisi' };
		if ( formData.password == undefined || formData.password.length <= 0 ) return { success: false, message: 'Password harus diisi' };
		if ( formData.nomor_hp == undefined || formData.nomor_hp.length <= 0 ) return { success: false, message: 'Nomor HP harus diisi' };

		return { success: true };

	}

	// render() {

	// 	return (
	// 		<Root>
	// 			<StatusBar
	// 				backgroundColor="#1aa3ff"
	// 				barStyle="light-content"
	// 			/>
	// 			<ScrollView>
	// 				<Container style={{ justifyContent: 'center' }}>
	// 					<KeyboardAvoidingView
	// 						behavior='padding' >
	// 						<H2 style={{ textAlign: 'center', opacity: 0.6 }}>Registrasi Akun</H2>
	// 						<Form>
	// 							<Item floatingLabel>
	// 								<Label>Nama</Label>
	// 								<Input
	// 									onChangeText={ ( text ) => this.setState({ nama: text }) } />
	// 							</Item>
	// 							<Item floatingLabel>
	// 								<Label>Alamat</Label>
	// 								<Input multiline={ true } numberOfLines={ 3 } 
	// 									onChangeText={ ( text ) => this.setState({ alamat: text }) } />
	// 							</Item>
	// 							<Item floatingLabel>
	// 								<Label>Email</Label>
	// 								<Input
	// 									onChangeText={ ( text ) => this.setState({ email: text }) } />
	// 							</Item>
	// 							<Item floatingLabel>
	// 								<Label>Password</Label>
	// 								<Input secureTextEntry={ true } 
	// 									onChangeText={ ( text ) => this.setState({ password: text }) } />
	// 							</Item>
	// 							<Item>
	// 								<Label>Jenis Kelamin</Label>
	// 								<RadioForm
	// 									radio_props={[
	// 										{ label: 'Laki-laki', value: 1 },
	// 										{ label: 'Perempuan', value: 0 }
	// 									]}
	// 									formHorizontal={true}
	// 									onPress={( value ) => { this.setState({ jenis_kelamin: value })} } />
	// 							</Item>
	// 							<Item floatingLabel last>
	// 								<Label>Nomor HP</Label>
	// 								<Input
	// 									onChangeText={ ( text ) => this.setState({ nomor_hp: text }) } />
	// 							</Item>
	// 							<Button block primary 
	// 								style={{ marginTop: 15 }}
	// 								onPress={ () => this._register() } >
	// 								<Text>Register</Text>
	// 							</Button>
	// 						</Form>
	// 					</KeyboardAvoidingView>
	// 				</Container>
	// 			</ScrollView>
	// 		</Root>
	// 	);

	// }

	render() {

		return (
			<KeyboardAvoidingView behavior="padding" style={ styles.container }>
				<StatusBar
					backgroundColor="#1aa3ff"
					barStyle="light-content"
				/>
				<View style={ styles.formContainer }>
					<TextInput 
						style={ styles.input }
						underlineColorAndroid="rgba(0, 0, 0, 0)"
						placeholder="Email"
						placeholderTextColor="rgba(255, 255, 255, 0.7)" />
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
	formContainer: {
		padding: 20
	},
	input: {
		height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginBottom: 20,
		color: '#FFF',
		paddingHorizontal: 10
	}
});