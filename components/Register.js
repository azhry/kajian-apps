import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView, TouchableOpacity, View, ScrollView } from 'react-native';
import { Button, Form, Input, Item, H2, Container, Content, Label, Root, Text, ListItem, Left, Radio, Toast } from 'native-base';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DialogProgress from 'react-native-dialog-progress';

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
				navigate( 'Login' );
			}

		})
		.catch(( error ) => {

			DialogProgress.hide();
			Alert.alert( 'Can not connect to server ' + error.toString() );

		});

	}

	render() {

		return (
			<Root>
				<ScrollView>
					<Container style={{ justifyContent: 'center' }}>
						<KeyboardAvoidingView
							behavior='padding' >
							<H2 style={{ textAlign: 'center', opacity: 0.6 }}>Registrasi Akun</H2>
							<Form>
								<Item floatingLabel>
									<Label>Nama</Label>
									<Input
										onChangeText={ ( text ) => this.setState({ nama: text }) } />
								</Item>
								<Item floatingLabel>
									<Label>Alamat</Label>
									<Input multiline={ true } numberOfLines={ 3 } 
										onChangeText={ ( text ) => this.setState({ alamat: text }) } />
								</Item>
								<Item floatingLabel>
									<Label>Email</Label>
									<Input
										onChangeText={ ( text ) => this.setState({ email: text }) } />
								</Item>
								<Item floatingLabel>
									<Label>Password</Label>
									<Input secureTextEntry={ true } 
										onChangeText={ ( text ) => this.setState({ password: text }) } />
								</Item>
								<Item>
									<Label>Jenis Kelamin</Label>
									<RadioForm
										radio_props={[
											{ label: 'Laki-laki', value: 1 },
											{ label: 'Perempuan', value: 0 }
										]}
										formHorizontal={true}
										onPress={( value ) => { this.setState({ jenis_kelamin: value })} } />
								</Item>
								<Item floatingLabel last>
									<Label>Nomor HP</Label>
									<Input
										onChangeText={ ( text ) => this.setState({ nomor_hp: text }) } />
								</Item>
								<Button block primary 
									style={{ marginTop: 15 }}
									onPress={ () => this._register() } >
									<Text>Register</Text>
								</Button>
							</Form>
						</KeyboardAvoidingView>
					</Container>
				</ScrollView>
			</Root>
		);

	}

}