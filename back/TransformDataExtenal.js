const moment = require('moment');
let _ = require('underscore');

module.exports = {
  transformDataExternal: (files, oldData) => {
    let oldDataTemp = [];
    let datas = files[0].splice(2, files[0].length);
    for (let i = 0; i < oldData.length; i++) {
      oldDataTemp = [...oldDataTemp, oldData[i]];
    }
    let date = '';
    for (let i = 0; i < datas.length; i++) {
      date = moment(`${datas[i][0]}-${datas[i][1]}-${datas[i][2]} ${datas[i][3]}:${datas[i][4]}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD hh:mm a');
      let index = _.findIndex(oldDataTemp, data => { return moment(data.Time).format('YYYY-MM-DD hh:mm a') === date });
      if (index >=0 ){
        oldDataTemp[index].DensitCellVivantes = datas[i][5];
        oldDataTemp[index].DensitCellMortes = datas[i][6];
        oldDataTemp[index].Glucose = datas[i][7];
        oldDataTemp[index].RdtProd = datas[i][8];
      }
    }
    return oldDataTemp;
  }
} 