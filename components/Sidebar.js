import React, { Component } from 'react';
import { Container, Content, Button, Text } from 'native-base';

export default class Sidebar extends Component {

	render() {

		return (
			<Container>
			    <Content
			      bounces={false}
			      style={{ flex: 1, backgroundColor: '#fff', top: -1 }}
			    >
			      <Button transparent>
			        <Text>Action</Text>
			      </Button>
			    </Content>
			  </Container>
		);

	}

}