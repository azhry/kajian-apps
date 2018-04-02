import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView, View, StatusBar, StyleSheet, TextInput, TouchableNativeFeedback, Picker, Image, ScrollView } from 'react-native';
import { Text, Icon } from 'native-base';
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
			password_konfirmasi: '',
			jenis_kelamin: '-1',
			nomor_hp: ''
		};
	}

	_register() {

		DialogProgress.show({
			title: 'Memproses',
			isCancelable: false
		});
		let formValidation = this._validateForm( this.state );
		if ( formValidation.success ) {
			const { navigate } 		= this.props.navigation;
			let nama 				= this.state.nama;
			let alamat 				= this.state.alamat;
			let email 				= this.state.email;
			let password  			= this.state.password;
			let jenis_kelamin 		= this.state.jenis_kelamin;
			let nomor_hp 			= this.state.nomor_hp;
			let password_konfirmasi	= this.state.password_konfirmasi;

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

					Alert.alert( 'Pendaftaran berhasil' );
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
				Alert.alert( 'Can not connect to server' );

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
		if ( formData.password != undefined && formData.password.length < 6 ) return { success: false, message: 'Password harus terdiri dari 6 karakter atau lebih' };
		if ( formData.password_konfirmasi == undefined || formData.password_konfirmasi.length <= 0 ) return { success: false, message: 'Password lagi harus diisi' };
		if ( formData.password != formData.password_konfirmasi ) return { success: false, message: 'Password dan password lagi harus sama' };
		if ( !this._validateEmail( formData.email ) ) return { success: false, message: 'Email tidak valid' };

		return { success: true };

	}

	_validateEmail( text ) {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(reg.test( text ) === false) return false;
		return true;
	}

	render() {

		const { goBack } = this.props.navigation;

		return (
			<ScrollView style={ styles.container }>
				<KeyboardAvoidingView behavior="padding">
					<StatusBar
						backgroundColor="#1aa3ff"
						barStyle="light-content"
					/>
					<View style={ styles.logoContainer }>
						<Image
							style={ styles.logo }
							source={ require( '../assets/image/logoGh.png' ) } />
							<Text style={ styles.title }>Daftar Akun</Text>
					</View>
					<View style={ styles.formContainer }>
						<TextInput 
							style={ styles.input }
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							placeholder="Nama"
							placeholderTextColor="rgba(255, 255, 255, 0.7)"
							returnKeyType="next"
							onChangeText={( text ) => this.setState({ nama: text })}
							autoCorrect={ false } />
						<Picker
							style={ styles.input }
							selectedValue={ this.state.jenis_kelamin }
							onValueChange={(itemValue, itemIndex) => this.setState({  jenis_kelamin: itemValue })}>
							<Picker.Item label="Pilih Jenis Kelamin" value="-1" />
							<Picker.Item label="Laki-laki" value="1" />
							<Picker.Item label="Perempuan" value="0" />
						</Picker>
						<TextInput 
							style={ styles.input }
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							returnKeyType="next"
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={ false }
							blurOnSubmit={ false }
							onSubmitEditing={() => this.passwordInput.focus()}
							onChangeText={( text ) => this.setState({ email: text })}
							placeholder="Email"
							placeholderTextColor="rgba(255, 255, 255, 0.7)" />
						<TextInput
							ref={( input ) => this.passwordInput = input}
							style={ styles.input }
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							secureTextEntry
							returnKeyType="next"
							blurOnSubmit={ false }
							onChangeText={( text ) => this.setState({ password: text })}
							onSubmitEditing={() => this.passwordConfirm.focus()}
							placeholder="Password"
							placeholderTextColor="rgba(255, 255, 255, 0.7)" />
						<TextInput
							ref={( input ) => this.passwordConfirm = input}
							style={ styles.input }
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							secureTextEntry
							returnKeyType="next"
							blurOnSubmit={ false }
							onChangeText={( text ) => this.setState({ password_konfirmasi: text })}
							onSubmitEditing={() => this.alamatInput.focus()}
							placeholder="Password Lagi"
							placeholderTextColor="rgba(255, 255, 255, 0.7)" />
						<TextInput
							ref={( input ) => this.alamatInput = input}
							style={[ styles.input ]}
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							onChangeText={( text ) => this.setState({ alamat: text })}
							blurOnSubmit={ false }
							returnKeyType="next"
							onSubmitEditing={() => this.noHpInput.focus()}
							placeholder="Alamat"
							placeholderTextColor="rgba(255, 255, 255, 0.7)" />
						<TextInput
							ref={( input ) => this.noHpInput = input}
							style={ styles.input }
							underlineColorAndroid="rgba(0, 0, 0, 0)"
							onChangeText={( text ) => this.setState({ nomor_hp: text })}
							onSubmitEditing={() => this._register()}
							returnKeyType="next"
							placeholder="Nomor HP"
							placeholderTextColor="rgba(255, 255, 255, 0.7)" />

						<TouchableNativeFeedback
							onPress={() => this._register()}
							background={TouchableNativeFeedback.SelectableBackground()}>
							<View style={ styles.buttonContainer }>
								<Text style={ styles.buttonText }>DAFTAR</Text>
							</View>
						</TouchableNativeFeedback>

						<TouchableNativeFeedback 
							onPress={() => goBack()}
							backgroundColor={TouchableNativeFeedback.SelectableBackground()}>
							<View style={ styles.goBackContainer }>
								<Text style={ styles.goBackText }><Icon style={ styles.iconArrowBack } name="md-arrow-back" /> Kembali</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
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
	goBackContainer: {
		marginTop: 20
	},
	goBackText: {
		textAlign: 'center',
		color: '#FFF',
		opacity: 0.9
	},
	iconArrowBack: {
		color: '#FFF',
		fontSize: 15
	}
});