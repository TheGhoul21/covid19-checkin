import * as React from 'react';
import { Dimmer, Container, Header, Icon, Grid, Divider, Form, FormInput, Label, Loader, Popup } from 'semantic-ui-react';
import { geolocated, GeolocatedProps } from 'react-geolocated';
const comuni = require('./comuni.json');
const axios = require('axios').default;

interface ICheckinDimmerProps {
    active: boolean,
    setActive: (val: boolean) => any,
    data: {nome:String, sigla:String, cap:Array<String>},
    zipCode: String
} 

function CheckinDimmer(props: ICheckinDimmerProps & GeolocatedProps) {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [zipCode, setZipCode] = React.useState(props.zipCode);

    React.useEffect(() => {
        setZipCode(props.zipCode)
    }, [props.zipCode]);

    

    return <Dimmer active={props.active}>

        <Grid columns={1}>
            <Grid.Column>
                <Grid.Row fluid style={{ height: '5vh'}}>
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


                    <Header as='h2'>OPPURE COMPILA I CAMPI QUI SOTTO</Header>
                    <Form onSubmit={() => {
                        //console.log(name, email, zipCode, props.coords)

                        const url = "https://checkin-covid19-stage.herokuapp.com/user";
                        // name=Luca&email=luca@luca.com&province=Padova&city=Padova&state=Italy&cap=33550&lat=41.666279&long=18.242070

                        axios.post(url, {
                            name,
                            email,
                            cap: zipCode,
                            lat: props.coords?.latitude,
                            long: props.coords?.longitude,
                            province:props.data.sigla,
                            city:props.data.nome,
                        }).then(() => {
                            alert("ok")
                        }).catch((err:Error)=>{
                            console.error(err.message);
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