import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Button, Card, CardItem, Content, Container, Header, Left, Text, Title } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class KajianDetail extends Component {

	static navigationOptions = {
		header: false
	};

	constructor( props ) {

		super( props );
		this.state = {
			region: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
		};

	}

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
								<Grid>
									<Col style={{ height: 250 }}>
										<View style={ styles.container }>
											<MapView
												provider={PROVIDER_GOOGLE}
												style={ styles.map }
												region={this.state.region} />
										</View>
									</Col>
								</Grid>
								<Grid>
									<Col style={{ padding: 10 }}>
										<Text style={{ fontSize: 18 }} >
											Apakah akan hadir?
										</Text>
									</Col>
            						<Col style={{ padding: 10 }}>
        								<Content>
								          <Button light><Text> Light </Text></Button>
								          <Button primary><Text> Primary </Text></Button>
								          <Button success><Text> Success </Text></Button>
								          <Button info><Text> Info </Text></Button>
								          <Button warning><Text> Warning </Text></Button>
								          <Button danger><Text> Danger </Text></Button>
								          <Button dark><Text> Dark </Text></Button>
								        </Content>
            						</Col>
								</Grid>
							</Body>
						</CardItem>
					</Card>
					<Card>
						<CardItem>
							<Body style={ styles.cardBody }>
								<Text style={{ fontSize: 23 }}>Detail</Text>
								<Text>
									Akan dilaksanakan kajian bertema Sholat Sunnah yang Menyamai Pahala Sholat Wajib. Insya Allah akan dilaksanakan di Masjid Bakti. Jln. Subakti Palembang pada hari Rabu waktu setelah Ba'da Maghrib
								</Text>
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
	},
	container: {
	    ...StyleSheet.absoluteFillObject,
	    height: 250,
	    width: 400,
	    justifyContent: 'flex-end',
	    alignItems: 'center',
	},
 	map: {
    	...StyleSheet.absoluteFillObject,
  	}
});