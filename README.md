# tiletrue
Query many vector tiles at a given coordinate

## API

````typescript
import TileTrue from 'tiletrue'

const config = [{
    name: 'Example',
    url: 'https://domain.com/{z}/{x}/{y}.mvt',
    zoom: 12,
    layers: ['layer'],
}]

const tileTrue = TileTrue(config)

(async () => {
    const dataAtLocation = await tileTrue(-90, 45)

    // returns an array of properties for each feature found at the location, in each layer, 
    // of each source in the config. Each feature has the properties _layer and _sourceTileURL  
    // that allows them to be related back to the config
})

````

## Development

#### Start
````bash
npm run-script start
````

#### Build
````bash
npm run-script build
````

# License
MIT
