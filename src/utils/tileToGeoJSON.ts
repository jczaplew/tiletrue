// @ts-ignore  
import vt from '@mapbox/vector-tile'
import Protobuf from 'pbf'
import zlib from 'zlib'

// Adapted from https://github.com/mapbox/vt2geojson/blob/master/index.js
export default function tileToGeoJSON(buffer: any, tile: number[], layers: string[]) {

    // handle zipped buffers
    if (buffer[0] === 0x78 && buffer[1] === 0x9C) {
        buffer = zlib.inflateSync(buffer);
    } else if (buffer[0] === 0x1F && buffer[1] === 0x8B) {
        buffer = zlib.gunzipSync(buffer);
    }

    const vectorTile = new vt.VectorTile(new Protobuf(buffer));
    // Layers are available on the vector tile as a vectorTiles.layers Record<string, any> 

    const features: GeoJSON.Feature[] = []
    layers.forEach(function (layerID) {
        const layer = vectorTile.layers[layerID];
        if (layer) {
            for (var i = 0; i < layer.length; i++) {
                const feature = layer.feature(i).toGeoJSON(tile[0], tile[1], tile[2]);
                if (layers.length > 1) feature.properties.vt_layer = layerID;
                features.push(feature);
            }
        }   
    });

    return features
}
