import React, { Ref, ChangeEvent } from 'react';
import logo from './logo.svg';
import home from './home.jpg';
import movie from './movie.png';
import book from './book.png';
import food from './food.png';
import love from './love.png';
import fitness from './fitness.png';
import ministero from './ministero.png';
import './App.css';
import Map from './Map';
import { Feed, Button, Icon, Container, Sidebar, Segment, Menu, Grid, Header, Image, Card, Input, Dimmer, Form, Label, List, Modal, Divider, CardDescription, Sticky, Rail } from 'semantic-ui-react'
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
      setMarkers(resp.data.sort((a: any, b: any) => {
        if(a.createdAt > b.createdAt) return -1;
        if(a.createdAt < b.createdAt) return 1;
        return 0;
      }));
    })
  }, [])

  const [countersPerRegion, setCountersPerRegion] = React.useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    setCountersPerRegion(markers.reduce((acc: any, curr) => {
      Object.keys(regions).map(regionName => {
        if (regions[regionName][curr['province']]) {
          acc[regionName] = acc[regionName] ? acc[regionName] + 1 : 1;
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
  const [currentName, setCurrentName] = React.useState()
  const [currentCounter, setCurrentCounter] = React.useState(0);

  React.useEffect(() => {
    if(markers.length >0 && currentCounter > markers.length - 1) {
      setCurrentCounter(0)
    } else if (markers.length > 0  && markers[currentCounter]) {
      setCurrentName(markers[currentCounter]['name']);
      setTimeout(() => setCurrentCounter(currentCounter + 1), 1500)
    } 
  }, [currentCounter, markers])

  const [modalOpen, setModalOpen] = React.useState(false);

  const [counters, setCounters] = React.useState([0, 0]);

  React.useEffect(() => {

    setCounters([markers.filter((item) => {
      return item['createdAt'] > todayAtMidnight
    }).length, markers.length])
  }, [markers])

  

  return (<div>
    <Sticky> 
      <Segment inverted style={{ position: "fixed", height: "9vh", zIndex: 99999, top: "95vh", left: 0, width: "100vw" }} vertical> 
      <Label as='a' color='black' image>
      <img src={love} />
      <Label.Detail>Made with love by</Label.Detail>
      <Label.Detail><a href="https://www.linkedin.com/in/luca-simonetti/" target="blank">Luca</a>   and </Label.Detail>
      <Label.Detail><a href="https://www.linkedin.com/in/frastab/" target="blank">Francesco</a></Label.Detail>
    </Label> 
    <a href="https://www.iubenda.com/privacy-policy/74415181" title="Privacy Policy " target="blank">Privacy </a>
            </Segment>
    </Sticky>
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
                      <Card.Header textAlign='center' as='h1'>Oggi siamo in</Card.Header>
                      {/*<Image src={home} wrapped ui={false} /> */}
                      <Card.Content textAlign='center'> {counters[0]} a casa</Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card centered>
                      <Card.Header textAlign='center' as='h1'>In totale siamo</Card.Header>
                      {/*<Image src={home} wrapped ui={false} /> */}
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
          <Header textAlign='center' color='green' as='h1'>Stiamo a casa, insieme! <p> </p>
          {currentName && <Label textAlign='center' color='green' pointing > <Icon name='home' /> {currentName} è a casa</Label>}
          </Header>
          <Divider horizontal />
          <Dimmer.Dimmable blurring={true} dimmed={active}>
            <CheckinDimmer setActive={setActive} active={active} data={data} zipCode={zipCode} />
            <Segment>
              Facciamo squadra, sosteniamoci, attraverso questa piattaforma. Condividiamo questa esperienza per renderla più leggera: <strong> non sei l’unico a fare uno sforzo</strong> per il bene di tutti. Registra ora la tua presenza a casa!
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
            <Header textAlign='center' color='green'>Cosa si può fare a casa? Qualche idea </Header>
          </Grid.Row>
          <Divider horizontal />
          <Card.Group centered>
            <Card>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={fitness}
                />
                <Card.Header>Un pò di allenamento</Card.Header>
                <Card.Meta>Ci si allena anche in casa</Card.Meta>
                <Card.Description>
                  Hai pensato che potresti toranre in forma<strong>chiuso in casa?</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic color='green'>
                  <a href="https://www.youtube.com/playlist?list=PLkbcqe_maYrEoRoVSuo5PO_lM4HX8FYLm" target="blank"> Guarda la playlist</a>
                </Button>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={book}
                />
                <Card.Header>Qualche libro?</Card.Header>
                <Card.Meta>Nutriamo la mente</Card.Meta>
                <Card.Description>
                  Cosa c'è di meglio da fare sul <strong>divano?</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic color='green'>
                  <a href="https://www.open.online/2020/03/11/coronavirus-10-libri-da-leggere-durante-la-quarantena/" target="blank"> Cercane un pò</a>
                </Button>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={movie}
                />
                <Card.Header>Binge watching</Card.Header>
                <Card.Meta>E' ora di guardare serie TV!</Card.Meta>
                <Card.Description>
                  Probabilmente è la prima cosa che hai pensato, e si, <strong>fallo!</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic color='green'>
                  <a href="https://www.google.it/search?sxsrf=ALeKk009Gi4tpoheTdKqKeOn9my1KtQMVA%3A1584125708787&source=hp&ei=DNdrXrrcLa76qwGnlozQAg&q=serie+tv+da+vedere&oq=serie+TV&gs_l=psy-ab.1.0.35i39j0i131l4j0j0i131l4.1378.2283..3045...1.0..0.91.629.8......0....1..gws-wiz.Ved1WWvePrM" target="blank"> Fatti ispirare</a>
                </Button>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={food}
                />
                <Card.Header>Conosci meglio il cibo!</Card.Header>
                <Card.Meta>Una collana di video che ti fanno conoscere meglio il cibo</Card.Meta>
                <Card.Description>
                  Il canale youtube di Breassani sembra davvero interessante
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic color='green'>
                  <a href="https://www.youtube.com/user/dariobressanini/videos" target="blank"> Approfondisci</a>
                </Button>
              </Card.Content>
            </Card>
          </Card.Group>
         </Segment>
         <Segment padded>
         <Container fluid centered>
      <Header as='h2' color="green">Perchè?</Header>
      <p>
       Il Covid-19 ci sta facendo vivere qualcosa di nuovo e di temuto, portando ansia e insicurezza. Questo progetto è stato pensato per lanciare un messaggio: "Non sei solo!". Tutti insieme possiamo contribuire ad alleggerire la tensione per trascorrere più serenamente questo periodo. Le mappe che riguardano il Covid-19, giustamente, ci aggiornano su decessi, nuovi contagi, mortalità; è per questo abbiamo pensato che sarebbe stato bello avere una mappa alternativa che mostri dati che ci aiutino a farci coraggio e ad allietare la complessa situazione che stiamo vivendo: chi sta a casa e come trascorre il proprio tempo. Creiamo un’unica grande casa virtuale! Facendo check-in diventi parte della comunità; facciamo crescere quanto più velocemente possibile il numero di check-in e alleggeriamo questo momento!
      </p>
      <Divider horizontal />
      <Header as='h2' color="green">Come?</Header>
      <p>
      Il progetto è semplice, l’abbiamo creato prima e dopo il lavoro (da casa, ovviamente): inserendo dei semplici dati - nome, email e CAP - registri la tua presenza su insiemeacasa.it. I dati non verranno utilizzati per nessun altro scopo: quando il sito non avrà più ragione d’esistere (speriamo presto) verrà cancellato, ti invieremo una mail per fartelo sapere. Tutto il codice è open source e lo <a href="https://github.com/TheGhoul21/covid19-checkin">trovi qui;</a> se pensi di poter contribuire aggiungendo o migliorando funzionalità: fai pure!
      </p>
      <Divider horizontal />
      <Header as='h2' color="green">Ringraziamenti</Header>
      <p>
      L’idea è nata al mattino, intorno alle 06:50; alle 07:15 <a href=" https://www.linkedin.com/in/luca-simonetti/">Luca</a> <strong>(GRAZIE!)</strong> aveva già risposto “Facciamolo” e ha iniziato a programmarlo, poi <a href="https://www.linkedin.com/in/caterina-marzolla-b5a575a3">Caterina</a> ci ha aiutato a immaginarlo graficamente e con <a href="https://www.instagram.com/andreaferraroyo/">Andrea</a>  abbiamo messo insieme quello che mancava, grazie anche <a href="https://www.linkedin.com/in/lucalorenzinivittorio/">Luca</a> per il supporto.</p>
      <p> Speriamo possa essere utile in qualche modo, </p>
      <Header as='h2' color="green"><a href=" https://www.linkedin.com/in/frastab/">Francesco</a></Header>
    </Container>
         </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </div>
  );
}

export default geolocated({})(App);
