import * as React from 'react';
import { Threebox, THREE } from "threebox-plugin";

import {
  Map,
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const App: React.FC = () => {
  const mapRef = React.useRef(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const tbRef = React.useRef(null);

  const [viewState, setViewState] = React.useState({
    longitude: 135.495951,
    latitude: 34.702485,
    zoom: 16,
    pitch: 75,
    bearing: 0,
  });

  const handleMapLoad = (map) => {
    const gl = map.getCanvas().getContext('webgl');
    const tb = new Threebox(map, gl, {
      defaultLights: true,
      enableSelectingObjects: true,
      enableDraggingObjects: true,
      enableRotatingObjects: true
    });
    tbRef.current = tb;

    const geometry = new THREE.BoxGeometry(4000, 4000, 4000);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);

    tb.add(cube, { units: 'meters', coords: [135.495951, 34.702485] });
    // setMapLoaded(true);
  };

  const customLayer = {
    id: "custom_layer",
    type: "custom",
    renderingMode: "3d",
    onAdd: (map, gl) => {
      handleMapLoad(map);
    },
    render: (gl, matrix) => {
      tbRef.current.update();
    },
  };

  return (
    <Map
      ref={mapRef}
      style={{ width: '100vw', height: '100vh' }}
      // onLoad={onMapLoad}
      onLoad={() => setMapLoaded(true)}
      initialViewState={viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle={import.meta.env.VITE_MAP_STYLE}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
    >
      {mapLoaded && <Layer {...customLayer} />}
      <NavigationControl />
      <FullscreenControl />
      <GeolocateControl />
    </Map>
  );
};

export default App;
