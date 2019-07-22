const moment = require('moment');
const _ = require('underscore');
moment.suppressDeprecationWarnings = true;

function getJsDateFromExcel(excelDateValue) {
  let date = new Date((excelDateValue - (25567 + 2)) * 86400 * 1000);
  let localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000);
  return localTime;
}

module.exports = {
  transformDataCelligen: (files) => {
    const data = [];
    let maxLength = 0;
    if (files[1] && files[0].length >= files[1].length){
      maxLength = files[1].length - 4;
    } else {
      maxLength = files[0].length - 4;
    }
    for (let j = 0; j < maxLength; j++) {
      data[j] = {
        hour : j/60,
      }
    }
    for (let i = 0; i < files.length; i++) {
      // trouver la longueur min de tableau de données et tourner jusqu'a 
      //taille min -4
      let datas = files[i].splice(4, files[i].length);
      let time = 0;
      for (let k = 1; k <= 15; k++){
        if (files[i][2][k]) {
          if ((files[i][2][k] === 'Time') && (time === 0)) {
            time = 1;
            for (let j = 0; j < maxLength; j++) {
              if (typeof (datas[j][k]) === 'number') {
                data[j].Time = moment(getJsDateFromExcel(datas[j][k], 'Z')).format('YYYY-MM-DD hh:mm a')
              } else {
                data[j].Time = moment(datas[j][k], 'MM/DD/YYYY hh:mm:ss a').format('YYYY-MM-DD hh:mm a')
              }
              data[j].hour = (moment(data[j].Time).format('X') - moment(data[0].Time).format('X')) / 3600
            }
          } else if (files[i][2][k].includes("DO")) {
            for (let j = 0; j < maxLength; j++) {
              data[j].DO = datas[j][k];
            }
          } else if (files[i][2][k].includes("AirFlo")){
            for (let j = 0; j < maxLength; j++) {
              data[j]['AirFlo(1)'] = datas[j][k];
            } 
          } else if (files[i][2][k].includes("Temp")){
            for (let j = 0; j < maxLength; j++) {
              data[j].Temp = datas[j][k];
            } 
          } else if (files[i][2][k].includes("pH")){
            for (let j = 0; j < maxLength; j++) {
              data[j]['ph-Opt'] = datas[j][k];
            } 
          } else if (files[i][2][k].includes("OvlAir")){
            for (let j = 0; j < maxLength; j++) {
              data[j].OvlAir = datas[j][k];
            } 
          } else if (files[i][2][k].includes("OvlCO2")){
            for (let j = 0; j < maxLength; j++) {
              data[j].OvlCO2 = datas[j][k];
            } 
          } else if (files[i][2][k].includes("O2Flo")){
            if (files[i][2][k].includes("CO")) {
              for (let j = 0; j < maxLength; j++) {
                data[j]['CO2Flo(4)'] = datas[j][k];
              } 
            } else {
              for (let j = 0; j < maxLength; j++) {
                data[j]['O2Flo(2)']= datas[j][k];
              } 
            }
          } else if (files[i][2][k].includes("N2Flo")){
            for (let j = 0; j < maxLength; j++) {
              data[j]['N2Flo(3)'] = datas[j][k];
            } 
          } else if (files[i][2][k].includes("Agit")){
            for (let j = 0; j < maxLength; j++) {
              data[j].Agit = datas[j][k];
            } 
          } else if (files[i][2][k].includes("OvlFlo")){
            for (let j = 0; j < maxLength; j++) {
              data[j].OvlFlo = datas[j][k];
            } 
          } else if (files[i][2][k].includes("OvlO2")){
            for (let j = 0; j < maxLength; j++) {
              data[j].OvlO2 = datas[j][k];
            } 
          } else if (files[i][2][k].includes("OvlN2")){
            for (let j = 0; j < maxLength; j++) {
              data[j].OvlN2 = datas[j][k];
            } 
          } 
        }
      }
    }
    const uniqTime = _.uniq(data, 'Time');
    return uniqTime;
  }
}
