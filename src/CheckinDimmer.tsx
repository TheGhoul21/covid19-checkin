import * as React from 'react';
import { Dimmer, Container, Header, Icon, Grid, Divider, Form, FormInput, Label, Loader, Popup, Modal, Button } from 'semantic-ui-react';
import { geolocated, GeolocatedProps } from 'react-geolocated';
const comuni = require('./comuni.json');
const axios = require('axios').default;

interface ICheckinDimmerProps {
    active: boolean,
    setActive: (val: boolean) => any,
    data: { nome: String, sigla: String, cap: Array<String> },
    zipCode: String,
}

function validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
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
                    <ol>
                        <li>Inserisci il tuo nome</li>
                        <li>Inserisci la tua mail (servirà per confermare la partecipazione, non salviamo il dato)</li>
                        {/* <li>Inserisci il CAP così sapremo dove metterti sulla mappa</li> */}
                    </ol>
                </Grid.Row>
                <Grid.Row>
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} basic>
                        <Modal.Content>
                            <h3>{modalMessage}</h3>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={() => setModalOpen(false)} inverted>
                                <Icon name='checkmark' /> Chiudi
                    </Button>
                        </Modal.Actions>
                    </Modal>

                    <Header inverted as='h2'>OPPURE COMPILA I CAMPI QUI SOTTO</Header>
                    <Form onSubmit={() => {

                        const url = "https://checkin-covid19-stage.herokuapp.com/user";

                        if (!validateEmail(email)) {

                            setModalMessage('Email non valida');
                            setModalOpen(true);

                            return;
                        }

                        const data = comuni.filter((data: { cap: Array<String> }) => data.cap.indexOf(zipCode) >= 0)[0];

                        const hasMatch = data.length > 0

                        if (!hasMatch) {
                            setModalMessage('CAP non trovato');
                            setModalOpen(true)
                            return;
                        }

                        axios.post(url, {
                            name,
                            email,
                            cap: zipCode,
                            lat: props.coords?.latitude,
                            long: props.coords?.longitude,
                            province: data?.sigla,
                            city: data?.nome,
                            state: 'Italy'
                        }).then(() => {
                            setModalOpen(true);
                            setModalMessage('Salvato con successo');
                        }).catch((err: Error) => {
                            setModalMessage('Errore durante il salvataggio, ritenta.')
                            setModalOpen(true);
                        })


                    }}>
                        <Form.Input placeholder="Nome" value={name} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setName(evt.target.value) }} />
                        <Form.Input placeholder="Email" value={email} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setEmail(evt.target.value) }} />
                        <Form.Input disabled placeholder="CAP" value={zipCode} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => { setZipCode(evt.target.value) }} />
                        <Form.Button  >Checkin</Form.Button>
                    </Form>
                </Grid.Row>
            </Grid.Column>
        </Grid>


    </Dimmer>
}

export default geolocated({})(CheckinDimmer);