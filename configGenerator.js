const fs = require('fs');
const data = require('./input.json');

let nr = 0
let config = {
  dac6: {
    key: "DAC6",
    layout: {
      base: "dac6",
      rows: data.map(mapSection).map(addNr).flat(2)
    }
  }
}

fs.writeFileSync('output.json', JSON.stringify(config));

function mapSection(s) {  
  let id = getId(s);
  let res = [{
    key: id,
    prop: 'section',
    inNavOutline: true,
    nr: getNr()
  }];

  let f = getNestedSections(s);
  if (!(f && f.length)) {
    res.push(...mapNested(s))
  }
  else {
    res.push({
      key: id,
      prop: 'section',
      rows: [...mapNested(s)]
    })
  }
  return res;
}

function mapNested(section) {
  section = section['section'] ? section['section'] : section;

  let f = getNestedSections(section);

  if (f && f.length) {
    var r = [];
    f.forEach(x => {

      let k = mapNested(x);
      if (k.length > 1) {
        let obj = { key: getId(x), prop: 'section' };
        r = [...r, obj, { ...obj, rows: [...k] }];
      } else {
        let obj = { key: getId(x), prop: 'section', nr: getNr() };
        r = [...r, obj, ...k]
      }
    });
    return r;
  } else {

    if (f && f.length) {
      let obj = { key: getId(section), prop: 'section' };
      return [obj, ...mapDomAspect(section)];
    } else {
      return [...mapDomAspect(section)];
    }
  }
}

function mapDomAspect(s) {
  let list = Array.from(s);
  let result = [];

  let domAspect = list.filter(x => x['domestic-aspect'])[0]['domestic-aspect'];

  let rows = Object.keys(domAspect)
    .filter(k => k != 'id')
    .map(r => {
      return {
        key: r
      }
    });
  let d = {
    key: getId(domAspect), // domAspect['id'],
    nr: getNr(),
    prop: "domestic-aspect",
    rows: rows
  }

  result.push({
    key: getId(list),
    prop: 'section',
    hasDynamicRows: true,
    dynamicRow: d
  });

  return result;
}

function getId(section) {

  section = section['section'] ? section['section'] : section;  
  if(section['id']){
    return replaceCountryCode(section['id']);
  }

  let s = Array.from(section);
  if (s.length) {
    let id = s[0].id;    
    return replaceCountryCode(id);
  } 
}

function replaceCountryCode(id){
  return id.replace(/dac6_[a-z]+/, 'dac6_cc');    
}

function getNestedSections(s) {
  s = s['section'] ? s['section'] : s;
  return Array.from(s).filter(s => s['section']);
}

function getNr() {
  return -1;
}

function addNr(data) {
  if(nr > 0){
    nr += 10;
  }
  for(let i = 0; i < data.length; i++){
    
    let d = data[i];
    if (d.nr == -1) {
      d.nr = nr++;
    }else if (d.dynamicRow && d.dynamicRow.nr == -1) {
      d.dynamicRow.nr = nr++;
    }else if(i % 2 == 0 && !d.rows && (!d.nr || d.nr == -1)){
      d.nr = nr++;
    }else if(i % 2 != 0 && !d.rows){
      d.nr = nr++;
    }

    if (d.rows && d.rows.length) {     
      addNr(d.rows);
    }
  }
  return data;
}
