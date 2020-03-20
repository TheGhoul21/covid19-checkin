import * as React from 'react';
import ReactMapGL, { Source, Layer, LayerProps } from 'react-map-gl';

export const heatmapLayer: LayerProps = {
    'id': 'earthquakes-heat',
    'type': 'heatmap',
    'source': 'earthquakes',
    'maxzoom': 9,
    'paint': {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(24,178,43)',
            0.4,
            'rgb(24,178,43)',
            0.6,
            'rgb(24,178,43)',
            0.8,
            'rgb(24,178,43)',
            1,
            'rgb(24,178,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            9,
            10
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            9,
            0
        ]
    }
};

const layer: LayerProps = {
    'id': 'earthquakes-point',
    'type': 'circle',
    'source': 'earthquakes',
    'minzoom': 4,
    'paint': {
        // Size circle radius by earthquake magnitude and zoom level
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
            16,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
        ],
        // Color circle by earthquake magnitude
        'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1,
            'rgba(33,102,172,0)',
            2,
            'rgb(103,169,207)',
            3,
            'rgb(209,229,240)',
            4,
            'rgb(253,219,199)',
            5,
            'rgb(239,138,98)',
            6,
            'rgb(178,24,43)'
        ],

        // Transition from heatmap to circle layer by zoom level
        'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            0,
            8,
            1
        ]
    }
}



function Map(props: { currentProvinces: { [key: string]: number }, markers: Array<{ name: String, lat: string, long: string, province: string }> }) {


    const [viewport, setViewport] = React.useState({ width: 400, height: 600, latitude: 41.89193, longitude: 12.51133, zoom: 4 });

    //if (!props.coords) return <Segment loading></Segment>
    const [geojson, setGeojson] = React.useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>();

    React.useEffect(() => {

        const provinces = Object.keys(props.currentProvinces);
        const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: "FeatureCollection",
            features:
                props.markers.filter(({ province }) => provinces.length === 0 || provinces.indexOf(province) >= 0).map(({ lat, long }) => ({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [parseFloat(long), parseFloat(lat)] } }))

        };
        setGeojson(geojson)

    }, [props.markers, props.currentProvinces])
    return (
        <ReactMapGL
            {...viewport}
            width="100"
            height="50vh"
            onViewportChange={setViewport}
            mapStyle="https://api.maptiler.com/maps/825e764f-c6e2-4abb-af65-66e334cc727d/style.json?key=ldf4BjnANURHPfgDqq9l"
        >
            {geojson && <Source type="geojson" data={geojson}>
                <Layer {...heatmapLayer} />
                <Layer {...layer} />
            </Source>}
        </ReactMapGL>

    );
}

export default Map;