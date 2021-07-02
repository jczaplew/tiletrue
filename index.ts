import {readFile} from 'fs/promises';
import TileTrue from './src';

(async () => {
    const config = JSON.parse((await readFile(__dirname + '/example.config.json')).toString())
    const tileTrue = TileTrue(config)
    
    const lng = -90
    const lat = 45

    const data = await tileTrue(lng, lat)
    console.log(data)
})()
