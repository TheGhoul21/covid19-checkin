import * as React from 'react';
import { Dimmer, Container, Header, Icon, Grid } from 'semantic-ui-react';

interface ICheckinDimmerProps {
    active: boolean,
    setActive:(val:boolean) => any
}

function CheckinDimmer(props: ICheckinDimmerProps) {


    return <Dimmer active={props.active}>
        
            <Grid>
                <Grid.Row fluid>
                    <Header textAlign='left' inverted>

                        <Icon onClick={() => props.setActive(false)} name='arrow left' />Stai a casa con noi!
            </Header>
                </Grid.Row>
                <Grid.Row style={{ height: '85vh'}}></Grid.Row>
            </Grid>

    
    </Dimmer>
}

export default CheckinDimmer;