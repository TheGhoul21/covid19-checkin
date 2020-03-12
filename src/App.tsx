import React, { Ref, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card, Input, Dimmer, Form } from 'semantic-ui-react'
import { geolocated, GeolocatedProps } from "react-geolocated";
import CheckinDimmer from './CheckinDimmer';
const comuni = require('./comuni.json');
const axios = require('axios').default;
function App(props: {} & GeolocatedProps) {
  const [visible, setVisible] = React.useState(false);
  const [active, setActive] = React.useState(false);


  const [markers, setMarkers] = React.useState([]);
  const [markerInterval, setMarkerInterval] = React.useState<any>();
  React.useEffect(() => {
    setMarkerInterval(setInterval(() => {
      axios.get('https://checkin-covid19-stage.herokuapp.com/user', {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      }).then((data:any) => {
        console.log(data);
      })
    }, 5000));
    return ()=> {
      clearInterval(markerInterval)
    }
  }, [])

  const [zipCode, setZipCode] = React.useState('');
  const [data, setData] = React.useState<{nome:String, sigla:String, cap:Array<String>}>({nome:'', sigla:'', cap:[]});

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
        <Grid style={{ height: '100vh', marginTop: '30vh' }}>
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
                  <Grid.Row>Basilicata</Grid.Row>
                  <Grid.Row>Calabria</Grid.Row>
                  <Grid.Row>Campania</Grid.Row>
                  <Grid.Row>Emilia-Romagna</Grid.Row>
                  <Grid.Row>Friuli-Venezia Giulia</Grid.Row>
                  <Grid.Row>Lazio</Grid.Row>
                  <Grid.Row>Liguria</Grid.Row>
                  <Grid.Row>Lomnardia</Grid.Row>
                  <Grid.Row>Marche</Grid.Row>
                  <Grid.Row>Molise</Grid.Row>
                  <Grid.Row>Piemonte</Grid.Row>
                  <Grid.Row>Puglia</Grid.Row>
                  <Grid.Row>Sardegna</Grid.Row>
                  <Grid.Row>Sicilia</Grid.Row>
                  <Grid.Row>Toscana</Grid.Row>
                  <Grid.Row>Trentino-Alto Adige</Grid.Row>
                  <Grid.Row>Valle d'Aosta</Grid.Row>
                  <Grid.Row>Veneto</Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row></Grid>
      </Sidebar>
      <Sidebar.Pusher>
        <Container style={{ width: '100vw', height: '100vh', overflow: 'none' }} >
          <Header textAlign='center'>Siamo a casa, insieme!</Header>

          <Dimmer.Dimmable  blurring={true} dimmed={active}>
            <CheckinDimmer setActive={setActive} active={active} data={data} zipCode={zipCode} />
            <Segment><Icon name='home' /> Caterina è a casa a Treviso</Segment>
            <Segment>
              <Form onSubmit={() => {
                // setActive(true)

                comuni.map((data:{nome:String, cap:Array<String>, sigla:String}) => {
                  if(data.cap.indexOf(zipCode) != -1) {
                    setActive(true);
                    setData(data)
                  }
                })
              }}>
                <Form.Input icon='searchengin' iconPosition='left' placeholder='Cerca CAP e fai check-in' fluid

                  onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                    setZipCode(evt.target.value)

                  }}
                />
              </Form>
            </Segment>
            <Map />
          </Dimmer.Dimmable>
          <Button fluid onClick={() => setVisible(true)}>Guarda feed</Button>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>

  );
}

export default geolocated({})(App);
