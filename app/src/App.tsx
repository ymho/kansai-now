import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { Threebox, THREE } from 'threebox-plugin';
// import * as turf from "@turf/turf"

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
  const cubeRef = useRef<any>();

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
            { defaultLights: true,
              // realSunlight : true
            }
          );
          const geometry = new THREE.BoxGeometry(30, 90, 30);
          const material = new THREE.MeshPhongMaterial( {color: 0x990000} );
          cubeRef.current = window.tb.Object3D({
            obj: new THREE.Mesh(geometry, material),
            units: 'meters'
          })
          cubeRef.current.rotation.z = 2
          cubeRef.current.setCoords([135.495951, 34.702485]);
          window.tb.add(cubeRef.current);
        },
        render: () => {
          // window.tb.setSunlight(new Date(), [135.495951, 34.702485]);
          window.tb.update();
        }
      })
    })
  })

  useEffect(() => {
    if (!mapRef.current) return; // wait for map to initialize
    mapRef.current.on('move', () => {
      if (!mapRef.current) return;
      setLng(mapRef.current.getCenter().lng);
      setLat(mapRef.current.getCenter().lat);
      setZoom(mapRef.current.getZoom());
      setPitch(mapRef.current.getPitch());
      cubeRef.current.setCoords([mapRef.current.getCenter().lng, mapRef.current.getCenter().lat]);
    });
  });

  return (
  <div>
    <div className="sidebar">
      Lng: {lng} | Lat: {lat} | Z: {zoom} |
    </div>
    <div ref={mapContainer} className="map-container" />
  </div>
  );
}

export default App;
