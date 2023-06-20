import { GeoJsonLayer } from '@deck.gl/layers/typed';
import 'mapbox-gl/dist/mapbox-gl.css';

import jrwRoute from '../data/jrw.json';

const RouteLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: jrwRoute,
    // pickable: true,
    // stroked: true,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    // getFillColor: [160, 160, 180, 200],
    getFillColor: (d) => d.properties?.station_color || [255, 0, 0, 150],
    getLineColor: (d) => d.properties?.line_color || [255, 0, 0, 150],
    getPointRadius: 10,
    getLineWidth: 50,
    // beforeId: 'layer_id'
});

export default RouteLayer;
