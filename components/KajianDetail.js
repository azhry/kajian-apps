import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Button, Card, CardItem, Content, Container, H3, Header, Left, Right, Text, Title } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default class KajianDetail extends Component {

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
						<Title>Kajian Sunnah</Title>
					</Body>
					<Right></Right>
				</Header>
			)
		};
	};

	constructor( props ) {

		super( props );

		let lat = this.props.navigation.state.params.item.latitude == null ? 0 : parseFloat( this.props.navigation.state.params.item.latitude );
		let lng = this.props.navigation.state.params.item.longitude == null ? 0 : parseFloat( this.props.navigation.state.params.item.longitude );

		this.state = {
			region: {
				latitude: lat,
				longitude: lng,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
		};

	}

	_confirmAttendance() {

	}

	_parseDateTime( datetime ) {
		var datetime = datetime.split( ' ' );
		var month = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];
		var date = datetime[0].split( '-' );
		date = date[2] + ' ' + month[date[1].replace(/^0+/, '')] + ' ' + date[0];
		var time = datetime[1];
		return {
			date: date,
			time: time
		};
	}

	render() {

		const { params } = this.props.navigation.state;

		return (
			<Container>
				<Content>
					<Card>
						<CardItem style={ styles.cardBody }>
							<Text style={{ fontSize: 16 }}>{ params.item.judul_kajian }</Text>
						</CardItem>
						<CardItem cardBody>
							<Image source={{ uri: 'http://placehold.it/350x200' }} style={ styles.cardImage } />
						</CardItem>
						<CardItem>
							<Body style={ styles.cardBody }>
								<Grid>
									<Col style={{ height: 150, padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
										<Text style={{ fontSize: 17 }} >
											<Icon name="md-pin" style={{ fontSize: 23 }} /> Location
										</Text>
										<Text>{ params.item.nama_masjid }</Text>
										<Text>{ params.item.alamat }</Text>
									</Col>
            						<Col style={{ height: 150, borderLeftWidth: 0.5, borderLeftColor: '#d6d7da', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#d6d7da' }}>
            							<Text style={{ fontSize: 17 }} >
            								<Icon name="md-calendar" style={{ fontSize: 23 }} /> Date
            							</Text>
            							<Text>{ this._parseDateTime( params.item.waktu_kajian ).date }</Text>
            							<Text>{ 'Pukul ' + this._parseDateTime( params.item.waktu_kajian ).time }</Text>
            						</Col>
								</Grid>
								<Grid>
									<Col style={{ height: 250 }}>
										<View style={ styles.container }>
											<MapView
												draggable={ false }
												provider={ PROVIDER_GOOGLE }
												style={ styles.map }
												region={ this.state.region }>
												<Marker
													title={ params.item.nama_masjid }
													coordinate={ this.state.region } />
											</MapView>
										</View>
									</Col>
								</Grid>
								<Grid>
									<Col style={{ padding: 10 }}>
										<Text>
											Apakah akan hadir?
										</Text>
									</Col>
            						<Col style={{ padding: 10 }}>
        								<Content>
								          <Grid>
								          	<Col>
								          		<Button success disabled={ false } style={{ width: 75, justifyContent: 'center' }}>
										          	<Text>Ya</Text>
										        </Button>
								          	</Col>
								          	<Col>
								          		<Button danger disabled={ false } style={{ width: 75, justifyContent: 'center' }}>
										          	<Text>Tidak</Text>
										        </Button>
								          	</Col>
								          </Grid>
								        </Content>
            						</Col>
								</Grid>
							</Body>
						</CardItem>
					</Card>
					<Card>
						<CardItem>
							<Body style={ styles.cardBody }>
								<Text>Akan dilaksanakan kajian bertema Sholat Sunnah yang Menyamai Pahala Sholat Wajib. Insya Allah akan dilaksanakan di Masjid Bakti. Jln. Subakti Palembang pada hari Rabu waktu setelah Ba'da Maghrib</Text>
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