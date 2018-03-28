import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Root, Text, Header, Left, Icon, Body, Title, Right, Card, CardItem } from 'native-base';

const BASE_URL = 'http://kajian.synapseclc.co.id/';

export default class Profile extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: (
				<Header>
					<Left>
						<TouchableOpacity onPress={ () => { navigation.goBack() } }>
							<Icon 
								name="md-arrow-back" 
								style={ styles.backButton } />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title>Profil</Title>
					</Body>
					<Right></Right>
				</Header>
			)
		};
	};

	constructor( props ) {

		super( props );
		this.state = {
			user: props.navigation.getParam( 'userData' )
		};

	}

	render() {

		return (
			<Root>
				<Card>
					<CardItem cardBody>
						<Body style={ styles.cardBody }>
							<Text style={{ fontWeight: 'bold', fontSize: 26 }} >{ this.state.user.nama }
							</Text>
							<Text style={{ fontSize: 14 }} >{ this.state.user.email }
							</Text>
							<Text style={{ fontSize: 16 }}>{ this.state.user.no_hp }
							</Text>
						</Body>
					</CardItem>
				</Card>
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
	cardBody: {
		opacity: 0.6,
		padding: 12
	}
});