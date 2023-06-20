import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { Threebox, THREE } from 'threebox-plugin';

import 'mapbox-gl/dist/mapbox-gl.css';
import "threebox-plugin/dist/threebox.css";
import "./App.css"

import RouteLayer from "./layers/RouteLayer"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const overlay = new MapboxOverlay({
  interleaved: true,
  layers: [RouteLayer]
});

const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();

  const [lng, setLng] = useState(135.495951);
  const [lat, setLat] = useState(34.702485);
  const [zoom, setZoom] = useState(16);
  const [pitch, setPitch] = useState(50);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAP_STYLE,
      center: [lng, lat],
      zoom,
      pitch
    });

    mapRef.current.addControl(new MapboxLanguage());
    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.GeolocateControl());
    mapRef.current.addControl(overlay)
  });

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      const existingLayer = mapRef.current.getLayer('custom_layer');
      if (existingLayer) {
        mapRef.current.removeLayer('custom_layer');
      }

      mapRef.current.addLayer({
        id: 'custom_layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: (map, gl) => {
          window.tb = new Threebox(
            map,
            gl,
            { defaultLights: true }
          );
          const geometry = new THREE.BoxGeometry(30, 90, 30);
          const cube = window.tb.Object3D({
            obj: new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x660000 })),
            units: 'meters'
          }).setCoords([135.495951, 34.702485]);;
          window.tb.add(cube);
        },
        render: () => {
          window.tb.update();
        }
      })
    })
  })

  useEffect(() => {
    if (!mapRef.current) return; // wait for map to initialize
    mapRef.current.on('move', () => {
      setLng(mapRef.current.getCenter().lng.toFixed(4));
      setLat(mapRef.current.getCenter().lat.toFixed(4));
      setZoom(mapRef.current.getZoom().toFixed(2));
      setPitch(mapRef.current.getPitch().toFixed(2));
    });
  });

  return (
  <div>
    <div className="sidebar">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
  </div>
  );
}

export default App;
