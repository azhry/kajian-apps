import React, { Component } from 'react';
import { Alert, Image, StyleSheet, WebView, View } from 'react-native';
import { Body, Card, CardItem, Icon, Text, Left, Thumbnail } from 'native-base';

export default class VideoCard extends Component {

	constructor( props ) {

		super( props );
		this.state = {

		};

	}

	onShouldStartLoadWithRequest = (navigator) => {
        if (navigator.url.indexOf('embed') !== -1) {
            return true;
        } else {
            this.videoPlayer.stopLoading(); //Some reference to your WebView to make it stop loading that URL
            return false;
        }    
    }

	render() {

		return (
			<Card>
				<CardItem>
					<Left>
						<Thumbnail source={{uri: 'https://yt3.ggpht.com/-l3EbgsGaiTY/AAAAAAAAAAI/AAAAAAAAAAA/Di5na3ExTjg/s288-mo-c-c0xffffffff-rj-k-no/photo.jpg'}} />
						<Body>
							<Text>{ this.props.title }</Text>
							<Text note>{ this.props.channel }</Text>
						</Body>
					</Left>
				</CardItem>
				<CardItem cardBody>
					<View style={{ height: 300 }}>
						<Image source={{ uri: 'https://img.youtube.com/vi/' + this.props.id + '/0.jpg' }} style={{ alignSelf: 'stretch', height: 300 }} />
						<Text style={{ opacity: 0 }}>This is placeholder text to display youtube video</Text>
                    </View>
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