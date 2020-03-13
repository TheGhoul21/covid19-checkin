import React, { Ref, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card, Input, Dimmer, Form, Label, List, Modal } from 'semantic-ui-react'
import { geolocated, GeolocatedProps } from "react-geolocated";
import CheckinDimmer from './CheckinDimmer';
const comuni = require('./comuni.json');

const regions = comuni.reduce((acc: any, curr: any) => {
  return ({ ...acc, [curr.regione.nome]: { ...acc[curr.regione.nome], [curr.sigla]: 1 } })
}, {})
const axios = require('axios').default;
function App(props: {} & GeolocatedProps) {
  const [visible, setVisible] = React.useState(false);
  const [active, setActive] = React.useState(false);


  const [markers, setMarkers] = React.useState([]);
  React.useEffect(() => {
      axios.get('https://checkin-covid19-stage.herokuapp.com/user').then((resp: any) => {
        setMarkers(resp.data);
      })
    
  }, [])
  const [countersPerRegion, setCountersPerRegion] = React.useState<{[key:string]:number}>({});

  React.useEffect(() => {
    setCountersPerRegion(markers.reduce((acc:any, curr) => {
      Object.keys(regions).map(regionName => {
        if(regions[regionName][curr['province']]) {
          acc[regionName] = acc[regionName] ? acc[regionName]+1 : 1;
        }
      })
      return acc;

    }, {}));

  }, [markers]);

  const [zipCode, setZipCode] = React.useState('');
  const [data, setData] = React.useState<{ nome: String, sigla: String, cap: Array<String> }>({ nome: '', sigla: '', cap: [] });
  const [currentProvinces, setCurrentProvinces] = React.useState<{ [key: string]: number }>({});
  const d = new Date();
  const todayAtMidnight = d.setHours(0, 0, 0, 0);

  const [modalOpen, setModalOpen] = React.useState(false);

  const [counters, setCounters] = React.useState([0, 0]);

  React.useEffect(() => {

    setCounters([markers.filter((item) => {
      return item['createdAt'] > todayAtMidnight
    }).length, markers.length])
  }, [markers])

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
                      <Card.Content>{counters[0]} sono a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header>Totale</Card.Header>
                      <Image src='https://semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
                      <Card.Content>{counters[1]} sono a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>Regioni</Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List>

                    {Object.keys(regions).sort().map(regionName => <List.Item onClick={() => {
                      setCurrentProvinces(regions[regionName])
                    }}><List.Content >{countersPerRegion[regionName] ? `(${countersPerRegion[regionName]}) ` : ''}{regionName}</List.Content></List.Item>)}

                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row></Grid>
      </Sidebar>
      <Sidebar.Pusher>
        <Container style={{ width: '100vw', height: '100vh', overflow: 'none' }} >

          <Header textAlign='center'>Siamo a casa, insieme!</Header>

          <Dimmer.Dimmable blurring={true} dimmed={active}>
            <CheckinDimmer setActive={setActive} active={active} data={data} zipCode={zipCode} />
            {/* <Segment><Icon name='home' /> Caterina è a casa a Treviso</Segment> */}
            <Segment>
              Facciamo squadra, sosteniamoci, attraverso questa piattaforma. Condividiamo questa esperienza per renderla più leggera: non sei l’unico a fare uno sforzo per il bene di tutti.
              </Segment>
            <Segment>

              <Form onSubmit={() => {
                // setActive(true)

                const data = comuni.filter((data: { nome: String, cap: Array<String>, sigla: String }) => {
                  return (data.cap.indexOf(zipCode) != -1)
                })
                const hasMatch = data.length > 0

                if (hasMatch) {
                  setData(data[0]);
                  setActive(true)
                } else {
                  setModalOpen(true);
                }

                return false;
              }}>
                <Form.Input icon='searchengin' iconPosition='left' placeholder='Cerca CAP e fai check-in' fluid

                  onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                    setZipCode(evt.target.value)

                  }}
                />

                <Modal open={modalOpen} onClose={() => setModalOpen(false)} basic>
                  <Modal.Content>
                    <h3>Errore: Nessun CAP trovato</h3>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='red' onClick={() => setModalOpen(false)} inverted>
                      <Icon name='checkmark' /> Chiudi
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Form>
            </Segment>
            <Map markers={markers} currentProvinces={currentProvinces} />
          </Dimmer.Dimmable>
          <Button fluid onClick={() => setVisible(true)}>Guarda feed</Button>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>

  );
}

export default geolocated({})(App);
