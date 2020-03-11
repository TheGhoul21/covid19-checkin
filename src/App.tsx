import React, { Ref } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card } from 'semantic-ui-react'
function App() {
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
        <Grid style={{ height:'100vh'}}>
          <Grid.Row style={{ height: '30vh' }}></Grid.Row>
          <Grid.Row>
            <Grid
              textAlign='center' style={{ height: '100vh', backgroundColor: 'white' }}
            >

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header as='h3'>New Content Awaits</Header>
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
        <Container>
          <Map />
          <Button onClick={() => setVisible(true)}>Feed</Button>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>

  );
}

export default App;
