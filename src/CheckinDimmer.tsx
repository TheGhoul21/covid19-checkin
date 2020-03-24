import * as React from 'react';
import { Dimmer, Header, Icon, Grid, Divider, Form, Modal, Button, Popup, Image } from 'semantic-ui-react';
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from 'react-share';
import logo_def from './logo_def.png';
import CopyToClipboard from "react-copy-to-clipboard";
const comuni = require('./comuni.json');
const italy_geo = require('./italy_geo.json');
const axios = require('axios').default;

interface ICheckinDimmerProps {
    active: boolean,
    setActive: (val: boolean) => any,
    data: { nome: String, sigla: String, cap: Array<String> },
    zipCode: String,
    onCheckinSaved: () => any
}

function validateEmail(mail: string) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}
function CheckinDimmer(props: ICheckinDimmerProps) {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [zipCode, setZipCode] = React.useState(props.zipCode);

    React.useEffect(() => {
        setZipCode(props.zipCode)
    }, [props.zipCode]);

    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
    const [modalAction, setModalAction] = React.useState<() => any>(() => { });

    return <Dimmer active={props.active}>

        <Grid columns={1}>
            <Grid.Column>
                <Grid.Row fluid style={{ height: '5vh' }}>
                    <Header textAlign='left' inverted>

                        <Icon onClick={() => props.setActive(false)} name='arrow left' />Stai a casa con noi!
                        </Header>

                </Grid.Row>
                <Grid.Row>

                    <Divider horizontal />
                    <Header inverted as='h2'>Ecco cosa serve:</Header>
                    <ol>
                        <li>Il tuo nome</li>
                        <li>La tua mail (opzionale) per far far apparire il tuo nome sul sito!</li>
                        <li>Il CAP, così da sapere dove mostrare il puntino verede.</li>
                        {/* <li>Inserisci il CAP così sapremo dove metterti sulla mappa</li> */}
                    </ol>
                </Grid.Row>
                <Grid.Row>

                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} inverted>

                        {modalMessage.length > 0 ? modalMessage : <>
                            <Modal.Header as='h1'> Grazie!</Modal.Header>
                            <Modal.Content image>
                                <Image
                                    wrapped
                                    size='medium'
                                    src={logo_def}
                                />
                                <Modal.Description>
                                    <Header>Ora spargi la voce</Header>
                                    <p>
                                        Grazie per aver preso parte a questa iniziativa, in questo momento è importante sentirsi vicini, vogliamo che tutta Italia partecipi così da colorare ogni singolo punto sulla mappa. Se hai inserito la tua mail controlla la tua posta per confermare la registrazione e far apparire il tuo nome (controlla anche in SPAM)
              </p>
                                    <Button.Group floated='left'>
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
                                    <p> <strong>Ci aiuti a farlo conoscere a tutti?</strong></p>
                                    <p><strong>Condividi Ora con i tuoi amici e familiari!</strong></p>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Modal.Actions>
                                    <Button floated='left' color='red' onClick={() => {
                                        setModalOpen(false);
                                        modalAction && modalAction();
                                    }} inverted>
                                        <Icon name='checkmark' /> Chiudi
    </Button>
                                </Modal.Actions>
                            </Modal.Actions>
                        </>}
                    </Modal>

                    <Header inverted as='h2'>Inserisci i tuoi dati e partecipa!</Header>
                    <Form onSubmit={() => {

                        const url = "http://35.241.241.164/user";

                        if (email.trim().length > 0 && !validateEmail(email)) {

                            setModalMessage('Email non valida');
                            setModalOpen(true);

                            return;
                        }

                        const data = comuni.filter((data: { cap: Array<String> }) => data.cap.indexOf(zipCode) >= 0);

                        const hasMatch = data.length > 0

                        if (!hasMatch) {
                            setModalMessage('CAP non trovato');
                            setModalOpen(true)
                            return;
                        }

                        const codice = parseInt(data[0].codice);
                        const coords = { latitude: 0, longitude: 0 };

                        for (var i in italy_geo) {
                            if (parseInt(italy_geo[i].istat) === codice) {
                                console.log(italy_geo[i].istat, codice)
                                coords.latitude = italy_geo[i].lat;
                                coords.longitude = italy_geo[i].lng;
                                break;
                            }
                        }

                        axios.post(url, {
                            name,
                            email,
                            cap: zipCode,
                            lat: coords.latitude,// || props.coords?.latitude,
                            long: coords.longitude,// || props.coords?.longitude,
                            province: data[0]?.sigla,
                            city: data[0]?.nome,
                            state: 'Italy'
                        }).then(() => {
                            setModalOpen(true);
                            setModalMessage('')
                            //setModalMessage('Grazie! Abbiamo salvato la tua registrazione, controlla la mail per far apparire il tuo nome sul sito (controlla anche in SPAM). Condividi questa pagina con i tuoi amici!');
                            setModalAction(() => {
                                props.onCheckinSaved();
                            })
                        }).catch((err: Error) => {
                            setModalMessage('Errore durante il salvataggio, ritenta.')
                            setModalOpen(true);
                        })


                    }}>
                        <Form.Input placeholder="Nome" value={name} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setName(evt.target.value) }} />
                        <Form.Input placeholder="Email (opzionale)" value={email} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setEmail(evt.target.value) }} />
                        <Form.Input placeholder="CAP" value={zipCode} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setZipCode(evt.target.value) }} />
                        <Form.Button  >Checkin</Form.Button>
                    </Form>
                </Grid.Row>
            </Grid.Column>
        </Grid>


    </Dimmer>
}

export default CheckinDimmer;