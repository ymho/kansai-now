import { SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { Geometry } from '@luma.gl/core';

import 'mapbox-gl/dist/mapbox-gl.css';

import { Train } from './train';

const createTrainMeshLayer = (width = 64, height = 32, depth = 32, color = [255, 165, 0, 150]) => {
    const train = new Train(width, height, depth, color);
    const data = [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [135.49456, 34.70144],
            },
            color: [255, 0, 0, 255]
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [135.4969, 34.70306],
            },
            color: [70, 70, 200, 255]
        },
    ];

    const positions = train.getPositions();

    // メッシュの高さのオフセット値(TODO: 動的に変更)
    const offset = 20;

    for (let i = 0; i < positions.length; i += 3) {
        // Z軸方向にオフセットを加える
        positions[i + 2] += offset;
    }

    const layer = new SimpleMeshLayer({
        id: 'test_layer',
        data,
        // texture: 'texture.png',
        mesh: new Geometry({
            id: 'test_train',
            attributes: {
                positions: { size: 3, value: new Float32Array(positions) },
                normals: { size: 3, value: new Float32Array(train.getNormals()) },
            },
            indices: new Uint16Array(train.getIndices()),
        }),
        getPosition: (d) => d.geometry.coordinates,
        // getColor: train.getColor(),
        getColor: (d) => d.color,
        // getColor: (d) => [255, 0, 0, 150],
        // getOrientation: (d) => [0, 30, 0],
        getOrientation: [0, 30, 0],
    });
    return layer;
};

const TrainLayer = createTrainMeshLayer();
export default TrainLayer;
