import * as React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon } from 'semantic-ui-react'
function Map() {
    const [viewport, setViewport] = React.useState({
        width: 400,
        height: 600,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
    });

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

export default Map;