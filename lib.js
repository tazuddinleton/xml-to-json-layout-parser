

export function mapSection(s) {  
    let id = getId(s);
    console.log('section: ', id);
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
        console.log('-------> nested section: ', getId(x));
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
    console.log('domestic-aspect keys: ', rows.map(k => k.key).join(", "))
    let d = {
      key: getId(domAspect),
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
  
export function addNr(data) {  
  console.log('adding nr to section', data[0].key, 'starting at', addNr.nr);   
    for(let i = 0; i < data.length; i++){      
      let d = data[i];      
      if (d.nr == -1) {
        d.nr = addNr.nr++;
      }else if (d.dynamicRow && d.dynamicRow.nr == -1) {
        d.dynamicRow.nr = addNr.nr++;
      }else if(i % 2 == 0 && !d.rows && (!d.nr || d.nr == -1)){
        d.nr = addNr.nr++;
      }else if(i % 2 != 0 && !d.rows){
        d.nr = addNr.nr++;
      }
  
      if (d.rows && d.rows.length) {     
        addNr(d.rows);
      }
    }
    return data;
  }
addNr.nr = 0
  