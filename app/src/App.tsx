import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { Threebox, THREE } from 'threebox-plugin';
import * as turf from "@turf/turf"

import 'mapbox-gl/dist/mapbox-gl.css';
import "threebox-plugin/dist/threebox.css";
import "./App.css"

import RouteLayer from "./layers/RouteLayer"

// import data from "./data/Railroad.json"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const overlay = new MapboxOverlay({
  interleaved: true,
  layers: [RouteLayer]
});

const coords = 	[
  [
    135.50292,
    34.64962
  ],
  [
    135.50066,
    34.65019
  ]
]
// const multiLineString = turf.multiLineString(data)
// const flattenedCoordinates: number[][] = [];

// turf.coordEach(multiLineString, (coord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) => {
//     flattenedCoordinates.push(coord);
// });

// const coords = flattenedCoordinates

const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const cubeRef = useRef<any>();

  // 地図上部に表示される現在の中心位置座標
  const [lng, setLng] = useState(135.495951);
  const [lat, setLat] = useState(34.702485);

  const [zoom, setZoom] = useState(16);
  const [pitch, setPitch] = useState(50);

  const [posLng, setPosLng] = useState(135.495951);
  const [posLat, setPosLat] = useState(34.702485);
  const [posModelAngle, setPosModelAngle] = useState(0);
  const refPosLat = useRef(posLat)
  const refPosLng = useRef(posLng)
  const refModelAngle = useRef(posModelAngle)
  const [posPastLng, setPosPastLng] = useState(0);
  const [posPastLat, setPosPastLat] = useState(0);
  const refPosPastLat = useRef(posPastLat)
  const refPosPastLng = useRef(posPastLng)

  const [index, setIndex] = useState(0);
  const refIndex = useRef(index)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAP_STYLE,
      center: [135.495951, 34.702485],
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
          const geometry = new THREE.BoxGeometry(30, 60, 30);
          const material = new THREE.MeshPhongMaterial( {color: 0x990000} );
          cubeRef.current = window.tb.Object3D({
            obj: new THREE.Mesh(geometry, material),
            units: 'meters',
            // adjustment: {x: 0.5, y: 0.5, z: 0},
            anchor: 'center',
            // bbox: true,
          })
          cubeRef.current.setCoords([posLng, posLat]);
          window.tb.add(cubeRef.current);
        },
        render: () => {
          window.tb.update();
        }
      })
    })
  })

  // 現在の地図の中心座標，ズーム，傾きを取得
  useEffect(() => {
    // マップが初期化されるまで待つ
    if (!mapRef.current) return;
    mapRef.current.on('move', () => {
      if (!mapRef.current) return;
      setLng(mapRef.current.getCenter().lng);
      setLat(mapRef.current.getCenter().lat);
      setZoom(mapRef.current.getZoom());
      setPitch(mapRef.current.getPitch());
    });
  });

  useEffect(() => {
    refPosLat.current = posLat;
    refPosLng.current = posLng;
  }, [posLat, posLng]);

  useEffect(() => {
    setInterval(() => {
      if (!cubeRef.current) return;
      refIndex.current += 1;
      [refPosLng.current, refPosLat.current] = coords[refIndex.current % coords.length];
      [refPosPastLng.current, refPosPastLat.current] = coords[(refIndex.current % coords.length)-1];
      refModelAngle.current = turf.bearing([refPosPastLng.current, refPosPastLat.current],[refPosLng.current, refPosLat.current]) * Math.PI/180;
      cubeRef.current.rotation.z = -refModelAngle.current
      cubeRef.current.setCoords([refPosLng.current, refPosLat.current]);
    }, 100);
  }, []);

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
