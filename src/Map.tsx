import * as React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Segment, Dimmer, Label } from 'semantic-ui-react'
import { geolocated, GeolocatedProps } from 'react-geolocated';
function Map(props: {markers:Array<{name:String, lat:string, long:string}>} & GeolocatedProps) {


    const [viewport, setViewport] = React.useState({ width:400, height:600, latitude:0, longitude:0, zoom:16});

    React.useEffect(() => {
        if (props.coords)
            setViewport({
                width: 400,
                height: 600,
                latitude: props.coords?.latitude,
                longitude: props.coords?.longitude,
                zoom: 16
            })
    }, [props.coords])

    //if (!props.coords) return <Segment loading></Segment>


    return (
        <ReactMapGL
            {...viewport}
            onViewportChange={setViewport}
            mapStyle="https://api.maptiler.com/maps/basic/style.json?key=4S1PQcbnY3BJl06SPrhW"
        >
            {props.markers && props.markers.map((marker) => <Marker latitude={parseFloat(marker.lat)} longitude={parseFloat(marker.long)} 
            offsetLeft={0} offsetTop={0}
            ><Icon name='map marker' color='red' size='big' /><Label>{marker.name} è a casa</Label> </Marker>)}
        </ReactMapGL>

    );
}

export default geolocated({})(Map);