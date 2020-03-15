import * as React from 'react';
import { Dimmer, Header, Icon, Grid, Divider, Form, Modal, Button, Popup } from 'semantic-ui-react';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from 'react-share';
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
function CheckinDimmer(props: ICheckinDimmerProps & GeolocatedProps) {

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
                        <li>La tua mail (servirà per confermare la partecipazione, non salviamo il dato)</li>
                        <li>Il CAP della tua città</li>
                        {/* <li>Inserisci il CAP così sapremo dove metterti sulla mappa</li> */}
                    </ol>
                </Grid.Row>
                <Grid.Row>
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} basic>
                        <Modal.Content>
                            <h3>{modalMessage}</h3>
                        </Modal.Content>
                        <Modal.Actions>

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
                            <Button color='green' onClick={() => {
                                setModalOpen(false);
                                modalAction && modalAction();
                            }} inverted>
                                <Icon name='checkmark' /> Chiudi
                    </Button>
                        </Modal.Actions>
                    </Modal>

                    <Header inverted as='h2'>Inserisci i tuoi dati e partecipa!</Header>
                    <Form onSubmit={() => {

                        const url = "https://checkin-covid19-stage.herokuapp.com/user";

                        if (!validateEmail(email)) {

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
                            setModalMessage('Grazie! Abbiamo salvato la tua registrazione, controlla la mail per far apparire il tuo nome sul sito, controlla anche in SPAM.');
                            setModalAction(() => {
                                props.onCheckinSaved();
                            })
                        }).catch((err: Error) => {
                            setModalMessage('Errore durante il salvataggio, ritenta.')
                            setModalOpen(true);
                        })


                    }}>
                        <Form.Input placeholder="Nome" value={name} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setName(evt.target.value) }} />
                        <Form.Input placeholder="Email" value={email} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setEmail(evt.target.value) }} />
                        <Form.Input placeholder="CAP" value={zipCode} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setZipCode(evt.target.value) }} />
                        <Form.Button  >Checkin</Form.Button>
                    </Form>
                </Grid.Row>
            </Grid.Column>
        </Grid>


    </Dimmer>
}

export default geolocated({})(CheckinDimmer);