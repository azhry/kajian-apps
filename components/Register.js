import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button, Form, Input, Item, H2, Container, Content, Label, Root, Text, ListItem, Left, Radio } from 'native-base';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

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

		const { navigate } = this.props.navigation;

		navigate( 'Login' );

	}

	render() {

		return (
			<Root>
				<Container style={{ justifyContent: 'center' }}>
					<H2 style={{ textAlign: 'center', opacity: 0.6 }}>Registrasi Akun</H2>
					<Form>
						<Item floatingLabel>
							<Label>Nama</Label>
							<Input/>
						</Item>
						<Item floatingLabel>
							<Label>Alamat</Label>
							<Input multiline={ true } numberOfLines={ 3 } />
						</Item>
						<Item floatingLabel>
							<Label>Email</Label>
							<Input/>
						</Item>
						<Item floatingLabel>
							<Label>Password</Label>
							<Input secureTextEntry={ true } />
						</Item>
						<Item>
							<Label>Jenis Kelamin</Label>
							<RadioForm
								radio_props={[
									{ label: 'Laki-laki', value: 1 },
									{ label: 'Perempuan', value: 0 }
								]}
								formHorizontal={true}
								onPress={( value ) => { this.setState({ value:value })} } />
						</Item>
						<Item floatingLabel last>
							<Label>Nomor HP</Label>
							<Input/>
						</Item>
						<Button block primary 
							style={{ marginTop: 15 }}
							onPress={ () => this._register() } >
							<Text>Register</Text>
						</Button>
					</Form>
				</Container>
			</Root>
		);

	}

}