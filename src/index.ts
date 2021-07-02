import tileCover from '@mapbox/tile-cover'
import tileToGeoJSON from './utils/tileToGeoJSON'
import axios from 'axios'

export interface TileTrueSource {
    name: string,
    url: string,
    zoom: number,
    layers: string[],
}

export type TileTrueConfig = TileTrueSource[]

function lngLatToXYZ(lng: number, lat: number, z: number): number[] {
    return tileCover.tiles({
        type: 'Point',
        coordinates: [lng, lat]
    }, {min_zoom: z, max_zoom: z})[0]
}

async function fetchSourceData(source: TileTrueSource, lng: number, lat: number) {
    const tile = lngLatToXYZ(lng, lat, source.zoom)

    const response = await axios.get(
            source.url
                .replace('{x}', tile[0].toString())
                .replace('{y}', tile[1].toString())
                .replace('{z}', tile[2].toString()),
            {
                responseType: 'arraybuffer'
            }
    )
    if (response.status !== 200) return []

    return tileToGeoJSON(response.data, tile, source.layers).map(feature => ({
        ...feature.properties,
        _sourceTileURL: source.url,
    }))
}

export default function TileTrue(config: TileTrueConfig) {
    // Validate config
    
    // Catch errors fetching tiles

    return async (lng: number,  lat: number) => 
        (await Promise.all(config.map(source => fetchSourceData(source, lng, lat)))).flat()    
}
