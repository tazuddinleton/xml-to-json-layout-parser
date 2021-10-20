import { writeFileSync, readFileSync } from 'fs';
import {mapSection, addNr} from './lib.js'

const data = JSON.parse(readFileSync('./input.json'));
console.log('data loaded.')
console.log('start processing...')
let config = {
  dac6: {
    key: "DAC6",
    layout: {
      base: "dac6",
      rows: data.map(mapSection).map(addNr).flat(2)
    }
  }
}

writeFileSync('output.json', JSON.stringify(config));
console.log('done.')
