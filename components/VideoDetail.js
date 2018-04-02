import React, { Component } from 'react';
import { Dimensions, Alert, Image, TouchableOpacity, StyleSheet, View, WebView, StatusBar, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Body, Button, Card, CardItem, Content, Container, H3, Header, Left, Right, Root, Text, Title, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';
import { Buffer } from 'buffer';
import YouTube from 'react-native-youtube';
import MapViewDirections from 'react-native-maps-directions';

export default class VideoDetail extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: (
				<Header style={{ backgroundColor: '#1aa3ff' }}>
					<StatusBar
			           backgroundColor="#1aa3ff"
			           barStyle="light-content"
			        />
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

		super( props )

	}

	render() {

		return (
			<Card>
				<View style={ styles.titleContainer }>
					<Text>{ this.props.navigation.state.params.item.snippet.title }</Text>
				</View>
				<View style={{ height: 300 }}>
					<YouTube
			            apiKey='AIzaSyDV1CNPBI4qy_Wr5jDjKe0Pb40u9Tn27UA'
			            videoId={ this.props.navigation.state.params.item.id.videoId } // The YouTube video ID
			            play={false}           // control playback of video with true/false
			            hidden={false}        // control visiblity of the entire view
			            playsInline={true}    // control whether the video should play inline
			            style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
			        />
				</View>
			</Card>
		);

	}

}

const styles = StyleSheet.create({
	backButton: {
		fontSize: 25,
		color: 'white',
		marginLeft: 10
	},
	titleContainer: {
		padding: 10,
		opacity: 0.7,
	}
});