import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Body, Container, Content, Header, Tab, Tabs, Text } from 'native-base';
import KajianCard from './KajianCard';

export default class BaseTabs extends Component {

  constructor( props ) {

    super( props );

    // using dummy data for testing purpose, will add fetch api later
    this.state = { 
      data: [
        {
          title: 'Sholat Sunnah yang Menyamai Pahala Sholat Wajib',
          lecturer: 'Ustadz Mizan Qudsiyah, Lc',
          imgSrc: 'http://placehold.it/350x200'
        }
      ]
    };

  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Tabs initialPage={0}>
          <Tab heading="Kajian">
            
            <Content>
              <FlatList
                data={ this.state.data }
                renderItem={ ({ item }) =>
                  <TouchableOpacity onPress={ () => navigate( 'KajianDetail', { title: item.title } ) }>
                    <KajianCard 
                      title={ item.title } 
                      lecturer={ item.lecturer }
                      imgSrc={ item.imgSrc } />
                  </TouchableOpacity>

                }
                keyExtractor={ ( item, index ) => index.toString() }
              />
            </Content>

          </Tab>
          <Tab heading="Playlist">
            
            {/* Playlist implementation here */}

          </Tab>
        </Tabs>
      </Container>
    );

  }
}