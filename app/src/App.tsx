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

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const overlay = new MapboxOverlay({
  interleaved: true,
  layers: [RouteLayer]
});
const coords = [
  [135.52163, 34.7052],
  [135.52191, 34.70523],
  [135.52195, 34.70523],
  [135.52242, 34.70523],
  [135.52293, 34.70518],
  [135.52312, 34.70515],
  [135.52326, 34.70513],
  [135.52344, 34.7051],
  [135.52361, 34.70505],
  [135.52381, 34.70499],
  [135.52422, 34.70483],
  [135.52465, 34.70462],
  [135.52476, 34.70456],
  [135.52489, 34.70449],
  [135.52498, 34.70443],
  [135.52527, 34.70426],
  [135.52549, 34.70412],
  [135.52592, 34.70385],
  [135.52631, 34.7036],
  [135.52634, 34.70358],
  [135.52647, 34.7035],
  [135.52657, 34.70344],
  [135.52689, 34.70325],
  [135.52714, 34.70308],
  [135.52745, 34.7029],
  [135.52759, 34.70282],
  [135.52764, 34.70279],
  [135.52767, 34.70276],
  [135.52809, 34.70251],
  [135.52859, 34.70221],
  [135.52911, 34.70188],
  [135.5293, 34.70176],
  [135.52932, 34.70175],
  [135.52968, 34.70152],
  [135.53049, 34.70102],
  [135.53067, 34.70091],
  [135.5316, 34.70033],
  [135.5318, 34.7002],
  [135.53185, 34.70016],
  [135.53202, 34.70005],
  [135.53224, 34.69988],
  [135.53253, 34.6996],
  [135.53276, 34.69932],
  [135.53291, 34.69907],
  [135.53298, 34.69892],
  [135.53301, 34.69884],
  [135.53309, 34.69867],
  [135.53317, 34.69851],
  [135.53334, 34.69812],
  [135.53347, 34.69785],
  [135.53358, 34.69761]
]
// const chunk = turf.lineChunk(coords, 500, { units: 'meters' }) as FeatureCollection;
// console.log(chunk)
// const length = turf.length(coords, {units: 'meters'});

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

//   function calculateAngle(lat1:number, lon1:number, lat2:number, lon2:number) {
//     // const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;

//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

//     const angleRad = Math.atan2(y, x);
//     const angleDeg = angleRad * 180 / Math.PI;

//     // Convert to positive angle if needed
//     const positiveAngle = angleDeg >= 0 ? angleDeg : 360 + angleDeg;

//     return positiveAngle;
// }

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
          // cubeRef.current.setRotation({x: 0, y: 0, z: refModelAngle.current + Math.PI/2})
          cubeRef.current.setCoords([posLng, posLat]);
          // cubeRef.current.set(
          //   {
          //     'coords': [posLng, posLat],
          //     'rotation': {x: 0, y: 0, z: 0}
          //   }
          // )
          window.tb.add(cubeRef.current);
        },
        render: () => {
          // window.tb.setSunlight(new Date(), [135.495951, 34.702485]);
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
      // [refPosLng.current, refPosLat.current] = turf.along(coords, refIndex.current, {units: 'meters'}).geometry.coordinates;
      [refPosLng.current, refPosLat.current] = coords[refIndex.current % coords.length];
      [refPosPastLng.current, refPosPastLat.current] = coords[(refIndex.current % coords.length)-1];

      refModelAngle.current = turf.bearing([refPosPastLng.current, refPosPastLat.current],[refPosLng.current, refPosLat.current]) * Math.PI/180;
      // console.log(chunk)
      // console.log(Math.abs(cubeRef.current.rotation.z - refModelAngle.current * Math.PI/180))
      cubeRef.current.rotation.z = -refModelAngle.current
      // if (cubeRef.current.rotation.z === 0 || Math.abs(cubeRef.current.rotation.z - refModelAngle.current) < Math.PI){
      //   // cubeRef.current.setRotation({x: 0, y: 0, z: refModelAngle.current + Math.PI/2})
      //   cubeRef.current.rotation.z = -refModelAngle.current
      //   // cubeRef.current.rotation.z = 0
      // }
      // cubeRef.current.rotation.z = refIndex.current * 0.1
      // cubeRef.current.set(
      //   {
      //     'coords': [refPosLng.current, refPosLat.current],
      //     // 'rotation': {x: 0, y: 0, z: refModelAngle.current+Math.PI/2}
      //   }
      // )
      // console.log(cubeRef.current.rotation.z - refModelAngle.current * Math.PI/180)
      // console.log(`before${[refPosLng.current, refPosLat.current]}`)
      // console.log(`after${[refPosLng.current, refPosLat.current]}`)
      // console.log(cubeRef.current.rotation.z)
      cubeRef.current.setCoords([refPosLng.current, refPosLat.current]);
    }, 1000);
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
