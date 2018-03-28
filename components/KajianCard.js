import React, { Component } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import { Body, Card, CardItem, Icon, Text } from 'native-base';

export default class KajianCard extends Component {

	constructor( props ) {

		super( props );
		this.state = {
			src: this.props.imgSrc
		};
	}

	render() {

		return (
			<Card>
				<CardItem cardBody>
					<Image 
						source={{ uri: this.state.src }} 
						onError={ (e) => { this.setState({ src: 'http://placehold.it/350x200' }) } }
						style={ styles.cardImage } />
				</CardItem>
				<CardItem>
					<Body style={ styles.cardBody }>
						<Text style={ styles.cardTitle }>
							{ this.props.title }
						</Text>
						<Text>
							<Icon name="person" style={ styles.cardIcon } /> { this.props.lecturer }
						</Text>
					</Body>
				</CardItem>
			</Card>
		);

	}

}

const styles = StyleSheet.create({
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	},
	cardBody: {
		opacity: 0.6
	},
	cardTitle: {
		fontWeight: 'bold'
	},
	cardIcon: {
		fontSize: 15
	}
});