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
                      <WebView 
                        ref={(ref) => { this.videoPlayer = ref;}}
                        scalesPageToFit={true} 
                        source={{ html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="' + this.props.url + '?modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}} 
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                        onNavigationStateChange ={this.onShouldStartLoadWithRequest} //for Android
                      />
                      <Text style={{ opacity: 0 }}>This is just placeholder text to display youtube video on WebView</Text>
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