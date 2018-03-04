import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Card, CardItem, Content, Container, Header, Left, Text, Title } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

export default class KajianDetail extends Component {

	static navigationOptions = {
		header: false
	};

	render() {

		const { params } = this.props.navigation.state;

		return (
			<Container>
				<Header>
					<Left>
						<TouchableOpacity onPress={ () => { this.props.navigation.goBack() } }>
							<Icon 
								name="md-arrow-back" 
								style={ styles.backButton } />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title>Kajian</Title>
					</Body>
				</Header>
				<Content>
					<Card>
						<CardItem cardBody>
							<Image source={{ uri: 'http://placehold.it/350x200' }} style={ styles.cardImage } />
						</CardItem>
						<CardItem>
							<Body style={ styles.cardBody }>
								<Grid>
									<Col style={{ height: 150, padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
										<Text style={{ fontSize: 20 }} >
											<Icon name="md-pin" style={{ fontSize: 23 }} /> Location
										</Text>
									</Col>
            						<Col style={{ height: 150, borderLeftWidth: 0.5, borderLeftColor: '#d6d7da', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
            							<Text style={{ fontSize: 20 }} >
            								<Icon name="md-calendar" style={{ fontSize: 23 }} /> Date
            							</Text>
            						</Col>
								</Grid>
							</Body>
						</CardItem>
					</Card>
				</Content>
			</Container>
		);

	}

}


const styles = StyleSheet.create({
	backButton: {
		fontSize: 25,
		color: 'white',
		marginLeft: 10
	},
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	},
	cardBody: {
		opacity: 0.6
	}
});