import React, { Ref } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card, Input } from 'semantic-ui-react'
import { geolocated, GeolocatedProps } from "react-geolocated";

function App(props:{} & GeolocatedProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Container}
        animation='overlay'
        icon='labeled'
        inverted
        onHide={() => setVisible(false)}
        horizontal
        direction='bottom'
        visible={visible}
        fluid

      >
        <Grid style={{ height:'100vh', marginTop:'30vh'}}>
          <Grid.Row style={{}}>
            <Grid
              textAlign='center' style={{ height: '100vh', backgroundColor: 'white' }}
            >

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header as='h3' onClick={() => setVisible(false)}>Feed</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} divided>
                  <Grid.Column>
                    <Card>
                      <Card.Header>Oggi</Card.Header>
                      <Image src='https://semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
                      <Card.Content>5.000 sono a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header>Totale</Card.Header>
                      <Image src='https://semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
                      <Card.Content>100.000 sono a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>Regioni</Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                  <Grid.Row>Abruzzo</Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row></Grid>
      </Sidebar>
      <Sidebar.Pusher>
        <Container style={{ width:'100vw', height:'100vh', overflow:'none'}} >
          <Header  textAlign='center'>Nome progetto</Header>
          <Segment><Icon name='home'/> Caterina è a casa a Treviso</Segment>
          <Segment> <Input icon='searchengin' iconPosition='left' placeholder='Cerca e fai check-in' fluid /></Segment>
          <Map />
          <Button fluid onClick={() => setVisible(true)}>Guarda feed</Button>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>

  );
}

export default geolocated({})(App);
