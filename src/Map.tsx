import * as React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Segment, Dimmer } from 'semantic-ui-react'
import { geolocated, GeolocatedProps } from 'react-geolocated';
function Map(props: {} & GeolocatedProps) {


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
            <Marker latitude={37.78} longitude={-122.41} offsetLeft={-0} offsetTop={-0}>
                <Icon color="red" name="map marker" size="big" />

            </Marker>
        </ReactMapGL>

    );
}

export default geolocated({})(Map);