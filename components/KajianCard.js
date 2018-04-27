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

	_parseDateTime( datetime ) {
		var datetime = datetime.split( ' ' );
		var month = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];
		var date = datetime[0].split( '-' );
		date = date[2] + ' ' + month[Number( date[1].replace(/^0+/, '') ) - 1] + ' ' + date[0];
		var time = datetime[1].split( ':' );
		time = time[0] + ':' + time[1];
		return {
			date: date,
			time: time
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
						<Text style={ styles.cardSubtitle }>
							<Icon name="md-calendar" style={ styles.cardIcon } />
							{ ' ' + this._parseDateTime( this.props.time ).date + ' Pukul ' + this._parseDateTime( this.props.time ).time }
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
	cardSubtitle: {
		fontSize: 14
	},
	cardIcon: {
		fontSize: 15
	}
});