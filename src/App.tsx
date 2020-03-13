import React, { Ref, ChangeEvent } from 'react';
import logo from './logo.svg';
import home from './home.jpg';
import movie from './movie.png';
import book from './book.png';
import fitness from './fitness.png';
import ministero from './ministero.png';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card, Input, Dimmer, Form, Label, List, Modal, Divider, CardDescription } from 'semantic-ui-react'
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
        <Grid style={{ height: '150vh', marginTop: '30vh' }}>
          <Grid.Row style={{}}>
            <Grid textAlign='center' style={{ height: '100vh', backgroundColor: 'white' }}
            >

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header as='h3' onClick={() => setVisible(false)}><Icon name='arrow down' />Torna alla mappa</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} divided centered >
                  <Grid.Column>
                    <Card centered>
                      <Card.Header textAlign='center'>Oggi siamo in</Card.Header>
                      <Image src={home} wrapped ui={false} />
                      <Card.Content textAlign='center'>{counters[0]}  a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card centered>
                      <Card.Header textAlign='center'>In totale siamo</Card.Header>
                      <Image src={home} wrapped ui={false} />
                      <Card.Content textAlign='center'>{counters[1]} a casa</Card.Content>
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
        <Divider horizontal />
          <Header textAlign='center' color='green'>Stiamo a casa, insieme! <p> </p>
          <Label textAlign='center' color='green' pointing> <Icon name='home' /> Veronika è a casa</Label></Header>
          <Divider horizontal />
          <Dimmer.Dimmable blurring={true} dimmed={active}>
            <CheckinDimmer setActive={setActive} active={active} data={data} zipCode={zipCode} />
            <Segment>
              Facciamo squadra, sosteniamoci, attraverso questa piattaforma. Condividiamo questa esperienza per renderla più leggera: non sei l’unico a fare uno sforzo per il bene di tutti. Facciamo diventare tutta l'italia Verde!
              </Segment>
              {/*<Segment><Icon name='home' /> user.name è a casa a Treviso</Segment>*/}

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
          <Button fluid onClick={() => setVisible(true)}><Icon name='arrow up' /> Clicca e guarda in quanti siamo!</Button>
        </Container>
        <Segment>
        <Divider horizontal />
        <Grid.Row textAlign="center">
        <Header textAlign='center' color='green'>Cosa si può fare? </Header>
        </Grid.Row>
        <Divider horizontal />
        <Grid>
        <Grid.Row columns={4}>
>
                  <Grid.Column>
                  <Card>
                      <Card.Header textAlign='center'>Esercizi Caslinghi</Card.Header>
                      <Image src={fitness} wrapped ui={false} />
                      <Card.Content textAlign='center'> 
                        <Button color='green'> <a href ="https://www.google.it/search?sxsrf=ALeKk00EmlJXKgQ5ZjTkfGFWODnF1Lnu-A%3A1584116257561&ei=IbJrXuzuIYuC1fAPjemkiAY&q=esercizi+da+fare+a+casa&oq=esercizi+da+fare&gs_l=psy-ab.3.0.0i131l4j0j0i131l2j0l3.671448.672907..675570...0.5..0.134.1533.12j4......0....1..gws-wiz.......0i71j35i39j0i131i67j0i67.BqhXKNPyJIM" target="_blank">Fatti ispirare!</a> </Button>
                        </Card.Content>
                   </Card>
                    </Grid.Column>
                    <Grid.Column>
                      <Card>
                      <Card.Header textAlign='center'>Leggi!</Card.Header>
                      <Image src={book} wrapped ui={false} />
                      <Card.Content textAlign='center'> 
                        <Button color='green'> <a href ="https://www.google.com/search?q=libri+da+leggere&oq=libri+da+&aqs=chrome.0.69i59j0j69i57j0l5.1432j0j4&sourceid=chrome&ie=UTF-8" target="_blank">Cercane qualcuna!</a> </Button>
                        </Card.Content>
                    </Card>
                    </Grid.Column>
                    <Grid.Column>
                    <Card>
                      <Card.Header textAlign='center'>Serie TV</Card.Header>
                      <Image src={movie} wrapped ui={false} />
                      <Card.Content textAlign='center'> 
                        <Button color='green'> <a href ="https://www.google.it/search?sxsrf=ALeKk01qWfRDptACJxM_RnQWLmr6CVwHMQ%3A1584116248385&source=hp&ei=GLJrXvWCFYqtrgSy5yQ&q=Serie+TV+da+vedere&oq=Serie+TV+da+vedere&gs_l=psy-ab.3..0i131l5j0i3j0j0i131l2j0.3743.7820..8052...6.0..0.135.1823.19j2......0....1..gws-wiz.....10..35i362i39j35i39.TOE4sBTFtq8&ved=0ahUKEwj17o_y7JfoAhWKlosKHbIzCQAQ4dUDCAg&uact=5" target="_blank">Cercane qualcuna!</a> </Button>
                        </Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header textAlign='center'>Tieniti informato</Card.Header>
                      <Image src={ministero} wrapped ui={false} />
                      <Card.Content textAlign='center'> 
                        <Button color='green'> <a href ="http://www.salute.gov.it/nuovocoronavirus" target="_blank">Leggi le novità!</a> </Button>
                        </Card.Content>
                    </Card>
                  </Grid.Column>
          </Grid.Row>
                </Grid>
          </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default geolocated({})(App);
