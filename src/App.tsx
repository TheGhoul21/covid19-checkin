import React, { ChangeEvent } from 'react';
import book from './book.png';
import food from './food.png';
import love from './love.png';
import git from './git.png';
import mail from './mail.png';
import fitness from './fitness.png';
import phone from './phone.png'
import './App.css';
import Map from './Map';
import { Progress, Button, Icon, Container, Sidebar, Segment, Grid, Header, Image, Card, Dimmer, Form, Label, Modal, Divider, Sticky, Popup, Statistic, Loader } from 'semantic-ui-react'
import CheckinDimmer from './CheckinDimmer';
import Cookies from 'universal-cookie';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from 'react-share'
import CopyToClipboard from "react-copy-to-clipboard";
const comuni = require('./comuni.json');

const regions = comuni.reduce((acc: any, curr: any) => {
  return ({ ...acc, [curr.regione.nome]: { ...acc[curr.regione.nome], [curr.sigla]: 1 } })
}, {})
const axios = require('axios').default;
function App(props: {}) {
  const [visible, setVisible] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [nextTick, setNextTick] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [markers, setMarkers] = React.useState([]);

  const cookies = new Cookies();

  const COOKIE_NAME = 'Checkin';
  React.useEffect(() => {
    axios.get('https://api.acasainsieme.it/user').then((resp: any) => {
      setLoading(false);
      setMarkers(resp.data.sort((a: any, b: any) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      }));

      setTimeout(() => setNextTick(+new Date()), 5000);
    })
  }, [nextTick])

  const [countersPerRegion, setCountersPerRegion] = React.useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    setCountersPerRegion(markers.reduce((acc: any, curr) => {
      Object.keys(regions).map(regionName => {
        if (regions[regionName][curr['province']]) {
          acc[regionName] = acc[regionName] ? acc[regionName] + 1 : 1;
        }
        return 1;
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
  const [currentRegion, setCurrentRegion] = React.useState<string | null>(null);

  const renderRegion = (regionName: string) => <Button
    active={regionName === currentRegion}
    onClick={() => {

      if (currentRegion === regionName) {
        setCurrentProvinces({});
        setCurrentRegion(null);
      } else {
        setCurrentRegion(regionName)
        setCurrentProvinces(regions[regionName])
      }

      setVisible(false);
    }}>
    {countersPerRegion[regionName] ? `(${countersPerRegion[regionName]}) ` : ''}{regionName}</Button>

  const confirmedMarkes = React.useMemo(() => {
    return markers.filter(marker => marker['confirmed']);
  }, [markers])

  React.useEffect(() => {
    if (confirmedMarkes.length > 0 && currentCounter > confirmedMarkes.length - 1) {
      setCurrentCounter(0)
    } else if (confirmedMarkes.length > 0 && confirmedMarkes[currentCounter]) {
      if (confirmedMarkes[currentCounter]['confirmed']) {
        setCurrentName(confirmedMarkes[currentCounter]['name']);
        setTimeout(() => setCurrentCounter(currentCounter + 1), 1200)
      }
    }
  }, [currentCounter, confirmedMarkes])

  const [modalOpen, setModalOpen] = React.useState(false);

  const [counters, setCounters] = React.useState([0, 0]);

  React.useEffect(() => {
    setCounters([markers.filter((item) => {
      return item['createdAt'] > todayAtMidnight
    }).length, markers.length])
  }, [markers, todayAtMidnight])



  return (<div>
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
        style={visible ? { width: '100vw' } : { display: 'none' }}
      >
        <Grid style={{ height: '100vh', width: '100vw', zIndex: 99999 }}>
          <Grid.Row style={{ width: '100vw' }}>
            <Grid textAlign='center' style={{ height: '100vh', padding: '2vh', width: '100vw', paddingBottom: '10vh', overflow: 'none', backgroundColor: 'white' }}
            >

              <Grid.Row columns={1} style={{ width: '100vw' }} fluid>
                <Grid.Column>
                  <Header as='h3' onClick={() => setVisible(false)}><Icon name='arrow down' />Torna alla mappa</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={1} divided centered >
                  {/* <Grid.Column textAlign='center'>
                    <Statistic>
                      <Statistic.Value>
                        {counters[0]}
                      </Statistic.Value>
                      <Statistic.Label>a casa oggi</Statistic.Label>
                    </Statistic>
                   </Grid.Column> */}
                  <Grid.Column textAlign='center'>
                    <Statistic size='large'>
                      <Statistic.Value>
                        {counters[1]}
                      </Statistic.Value>
                      <Statistic.Label>Check-in effettuati</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row><strong>Regioni </strong>  (clicca su una regione per evidenziarla) </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Button.Group vertical>
                    {Object.keys(regions).slice(0, 10).sort().map(regionName => renderRegion(regionName))}
                  </Button.Group>
                </Grid.Column>
                <Grid.Column>
                  <Button.Group vertical>
                    {Object.keys(regions).slice(10).sort().map(regionName => renderRegion(regionName))}
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row></Grid>
      </Sidebar>
      <Sidebar.Pusher style={{ overflowY: visible ? 'none' : 'auto', height: '100vh', paddingBottom: '10vh' }}>
        <Container style={{ width: '100vw', overflow: 'none' }} >
          <Dimmer active={loading}><Loader>Un attimo, carichiamo tutti i check-in (siete tantissimi, ci vorrà qualche secondo :) ) </Loader></Dimmer>
          <Divider horizontal />
          <Header textAlign='center' color='green' as='h1'> #IoRestoaCasa
            {currentName && <Label textAlign='center' color='green' pointing='left' > <Icon name='home' /> {currentName} è a casa</Label>}
          </Header>
          <Divider horizontal />
          <Dimmer.Dimmable blurring={true} dimmed={active}>
            <CheckinDimmer onCheckinSaved={() => {
              setActive(false);
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(0, 0, 0, 0)
              cookies.set(COOKIE_NAME, 1, { path: '/', expires: tomorrow });

            }} setActive={setActive} active={active} data={data} zipCode={zipCode} />
            <Segment>
              <Progress progress='value' value={counters[1]} total={20000} label='Prossimo obiettivo: 20.000' active color='green' />
            </Segment>
            <Segment>
              <strong> AAA: Stiamo ricevendo tantissime visite <strong>(Grazie) </strong>e il sito potrebbe essere un pò lentino :) risolviamo presto! </strong> <p> Facciamo squadra, sosteniamoci, attraverso questa iniziativa. Condividiamo questa esperienza per renderla più leggera: <strong> non sei l’unico a fare uno sforzo</strong> per il bene di tutti. Registra ora la tua presenza a casa, <strong>#iorestoacasa e non da solo  </strong></p>
            </Segment>
            <Segment>

              <Form onSubmit={() => {
                // setActive(true)

                const data = comuni.filter((data: { nome: String, cap: Array<String>, sigla: String }) => {
                  return (data.cap.indexOf(zipCode) !== -1)
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
                {!cookies.get(COOKIE_NAME) ?
                  <Form.Input disabled={cookies.get(COOKIE_NAME)} action="Fai Check-in" icon='searchengin' iconPosition='left' placeholder='Cerca CAP' fluid

                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                      setZipCode(evt.target.value)

                    }}
                  /> :
                  <>Hai già fatto un checkin per oggi, ora invita i tuoi amici e torna domani!</>}
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
            <Button color='grey' fluid onClick={() => setVisible(true)}><Icon name='arrow up' /> Clicca e guarda in quanti siamo! <Icon name='arrow up' /></Button>
          </Dimmer.Dimmable>
          <Divider horizontal />
          <Grid.Row Align='center'>
            <FacebookShareButton quote="Io sono a casa! Registrate anche voi la vostra presenza e coloriamo l'italia, insieme!" url={window.location.href}><FacebookIcon size={50} round={true} />
              <Label as='a' basic pointing='left'>
                Condividi
                  </Label>
            </FacebookShareButton>
            <WhatsappShareButton url={window.location.href}><WhatsappIcon size={50} round={true} />
              <Label as='a' basic pointing='left'>
                Invia!
                  </Label>
            </WhatsappShareButton>
            <TwitterShareButton url={window.location.href} title="Stiamo a casa, insieme. Fai check-in e colora l'italia #acasainsieme"><TwitterIcon size={50} round={true} />
              <Label as='a' basic pointing='left'>
                Twitta!
                  </Label>
            </TwitterShareButton>

            {/*<CopyToClipboard
                  text={window.location.href}
                ><Button style={{
                  width: '50px', height: '50px',
                  padding: "0px",
                  cursor: "pointer"
                                 

                }} ><Popup trigger={<Icon
                  style={{
                    width: '50px', height: '50px',
                    padding: "0px",
                    cursor: "pointer",
                    textAlign: 'center',
                    display: 'inline'
                  }}

                  size={'big'} name="linkify" fluid />}
                  pinned={true}
                  openOnTriggerClick={true}
                  openOnTriggerFocus={false}
                  openOnTriggerMouseEnter={false}
                  content={'Copiato!'}
                    />
                  <Label as='a' basic pointing='left'>
                   Copia Link
                  </Label>
                    </Button>
                </CopyToClipboard>*/}
          </Grid.Row>
          <Segment>
            <Divider horizontal />

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
                L’idea è nata al mattino, intorno alle 06:50; alle 07:15 <a href="https://www.instagram.com/dajeluchino/">Luca S.</a> <strong>(GRAZIE!)</strong> aveva già risposto “Facciamolo” e ha iniziato a programmarlo, poi <a href="https://www.linkedin.com/in/caterina-marzolla-b5a575a3">Caterina</a> ci ha aiutato a immaginarlo graficamente e con <a href="https://www.instagram.com/andreaferraroyo/">Andrea</a>  abbiamo messo insieme quello che mancava, grazie anche <a href="https://www.linkedin.com/in/lucalorenzinivittorio/">Luca L.</a> per il supporto. Grazie a <a href="https://www.nohup.it/">Nohup</a> per offrirci l'hosting gratuito. </p>
              <p> Speriamo possa essere utile in qualche modo, </p>
              <Header as='h2' color="green"><a href=" https://www.linkedin.com/in/frastab/">Francesco</a></Header>
              <Header as='h3'>Condividi con i tuoi amici:</Header>
              <Button.Group>
                <FacebookShareButton url={window.location.href}><FacebookIcon size={50} /></FacebookShareButton>
                <WhatsappShareButton url={window.location.href}><WhatsappIcon size={50} /></WhatsappShareButton>
                <CopyToClipboard
                  text={window.location.href}
                ><Button style={{
                  width: '50px', height: '50px',
                  padding: "0px",
                  cursor: "pointer"

                }} ><Popup trigger={<Icon
                  style={{
                    width: '50px', height: '50px',
                    padding: "0px",
                    cursor: "pointer",
                    textAlign: 'center',
                    display: 'inline'
                  }}

                  size={'big'} name="linkify" fluid />}
                  pinned={true}
                  openOnTriggerClick={true}
                  openOnTriggerFocus={false}
                  openOnTriggerMouseEnter={false}
                  content={'Copiato!'}

                    /></Button>
                </CopyToClipboard>
              </Button.Group>
            </Container>
          </Segment>
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
                    src={love}
                  />
                  <Card.Header>Aiutiamo la Protezione civile</Card.Header>
                  <Card.Meta>Doniamo</Card.Meta>
                  <Card.Description>
                    La rai raccoglie i fondi per la  <strong>Protezione Civile</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="https://www.rai.it/ufficiostampa/assets/template/us-articolo.html?ssiPath=/articoli/2020/03/Coronavirus-Rai-raccolta-fondi-con-Protezione-Civile-b2ff16f1-56dc-4bfa-8ed5-ed63319a1641-ssi.html" target="blank"> Leggi e dona!</a>
                  </Button>
                  {/*<Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                  16 */}
                </Card.Content>
              </Card>
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
                    Hai pensato che potresti tornare in forma <strong>chiuso in casa?</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="https://www.youtube.com/playlist?list=PLkbcqe_maYrEoRoVSuo5PO_lM4HX8FYLm" target="blank"> Guarda la playlist</a>
                  </Button>
                  {/*<Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                  16 */}
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
                    Cosa c'è di meglio di leggere sul <strong>divano?</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="https://tg24.sky.it/speciali/libri.html" target="blank"> Cercane un pò</a>
                  </Button>
                  {/* <Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                 16 */}
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated='right'
                    size='mini'
                    src={phone}
                  />
                  <Card.Header>Parla con qualcuno</Card.Header>
                  <Card.Meta>Una bella iniziativa per chi si sente solo!</Card.Meta>
                  <Card.Description>
                    Una bella iniziativa delle volontarie e volontari dell’Osservatorio  <strong>“Roma! Puoi dirlo forte”.</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="https://iorestoinsieme.it/" target="blank"> Scopri l'iniziativa</a>
                  </Button>
                  {/* <Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                 16 */}
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
                    Il canale youtube di Bressanini sembra davvero interessante
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="https://www.youtube.com/user/dariobressanini/videos" target="blank"> Approfondisci</a>
                  </Button>
                  {/*<Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                  16 */}
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated='right'
                    size='mini'
                    src={mail}
                  />
                  <Card.Header>Altro?</Card.Header>
                  <Card.Meta>aiutaci ad inserire altro</Card.Meta>
                  <Card.Description>
                    se pensi ci sia qualcosa di utile da condividire <strong>scrivici!</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color='green'>
                    <a href="mailto:info@acasainsieme.it" target="blank"> Scrivici!</a>
                  </Button>
                  {/*<Icon 
                  name='heart outline'
                  color='red' 
                  floated='right' 
                  />
                  16 */}
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
          
        </Container>

      </Sidebar.Pusher>
    </Sidebar.Pushable>
    <Sticky>
      <Segment inverted style={{ position: "fixed", height: "6vh", zIndex: 99999, top: "94vh", left: 0, width: "100vw" }} vertical>
        <Label as='a' color='black' image>
          <img alt='love' src={love} />
          <Label.Detail>Made with love by</Label.Detail>
        </Label>
        <Label><a href="https://www.instagram.com/dajeluchino/" target="blank">Luca</a></Label>
        <Label><a href="https://www.linkedin.com/in/frastab/" target="blank">Francesco</a></Label>
        <Label as='a' href="https://github.com/TheGhoul21/covid19-checkin" color='black' image> Open Source
          <img alt='git' src={git} />
        </Label>
        <a href="https://www.iubenda.com/privacy-policy/74415181" title="Privacy Policy " target="blank">Privacy </a>
      </Segment>
    </Sticky>
  </div>
  );
}

export default App;
