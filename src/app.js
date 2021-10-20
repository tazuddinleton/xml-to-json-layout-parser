import { writeFileSync, readFileSync } from 'fs';
import {mapSection, addNr} from './lib.js'

const data = JSON.parse(readFileSync('./input/data.json'));
if(!data.length){
  console.error('data not loaded');  
}else{
  console.log('data loaded.')
}
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


console.log('writing output...');
writeFileSync('./output/config.json', JSON.stringify(config));
console.log('done.')
