import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import setHeaderToken from '../../Utils/tokenUtil';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, Brush,
} from 'recharts';
import _ from 'underscore';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { message } from 'antd';
import conf from '../../app.conf';
import './Graph.css'

function Graph(props) {
  const [data, setData] = useState([]);
  const [manipSelected, setManipSelected] = useState({});
  const [DO, setDO] = useState({ graph: false, axe: 0, color: '#e6194b' });
  const [N2Flo3, setN2Flo3] = useState({ graph: false, axe: 0, color: '#3cb44b' });
  const [OvlAir, setOvlAir] = useState({ graph: false, axe: 0, color: '#ffe119' });
  const [OvlO2, setOvlO2] = useState({ graph: false, axe: 0, color: '#4363d8' });
  const [OvlN2, setOvlN2] = useState({ graph: false, axe: 0, color: '#f58231' });
  const [AirFlo1, setAirFlo1] = useState({ graph: false, axe: 0, color: '#9a6324' });
  const [O2Flo2, setO2Flo2] = useState({ graph: false, axe: 0, color: '#911eb4' });
  const [Agit, setAgit] = useState({ graph: false, axe: 0, color: '#46f0f0' });
  const [Temp, setTemp] = useState({ graph: false, axe: 0, color: '#f032e6' });
  const [CO2Flo4, setCO2Flo4] = useState({ graph: false, axe: 0, color: '#bcf60c' });
  const [OvlFlo, setOvlFlo] = useState({ graph: false, axe: 0, color: '#fabebe' });
  const [OvlCO2, setOvlCO2] = useState({ graph: false, axe: 0, color: '#008080' });
  const [phOpt, setphOpt] = useState({ graph: false, axe: 0, color: '#e6beff' });
  const [DensiteCellMortes, setDensiteCellMortes] = useState({ graph: false, axe: 0, color: '#000075' });
  const [DensiteCellVivantes, setDensiteCellVivantes] = useState({ graph: false, axe: 0, color: '#800000' });
  const [Glucose, setGlucose] = useState({ graph: false, axe: 0, color: '#ffd8b1' });
  const [RdtProd, setRdtProd] = useState({ graph: false, axe: 0, color: '#808000' });
  const [initTime, setInitTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [inputTimeOpen, setInputTimeOpen] = useState(false);
  const [inputAxeOpen, setInputAxeOpen] = useState(false);
  const [inputColorOpen, setInputColorOpen] = useState(false);
  const [initData, setInitData] = useState([]);
  const [axes, setAxes] = useState([
    { name: 'axe', num: 0, orientation: 'G', dataMin: null, dataMax: null }
  ])

  useEffect(() => {
    const params = queryString.parse(props.location.search);
    let manipSelectedId = params.id

    setHeaderToken(() => {
      axios.get(`${conf.url}/graph/${manipSelectedId}`)
        .then(data => {
          setManipSelected(data.data)
        })
        .catch(() => {
          message.error('Problem when retrieving data. Please refresh the page', 3);
        });
    });
  }, [props.location.search, props.manipList.length])

  useEffect(() => {
    if (manipSelected.data) {
      let arrayTemp = []
      arrayTemp = manipSelected.data.filter(data =>
        data.hour % 1 === 0 || data.DensiteCellMortes > 0 || data.DensiteCellVivantes > 0 || data.Glucose > 0 || data.RdtProd > 0
      );
      setInitData(arrayTemp)
      setInitTime(arrayTemp[0].hour)
      setEndTime(arrayTemp[arrayTemp.length - 1].hour)
      setData(arrayTemp)
    }
  }, [manipSelected])

  const printDocument = () => {
    const input = document.getElementById("graphToPrint");
    html2canvas(input).then(function (canvas) {
      document.body.appendChild(canvas);
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF({  orientation: 'landscape' });
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("downloadedPdf.pdf");
    });
  }

  const validateTimeStartEnd = () => {
    setInputTimeOpen(false)
    let arrayTemp = [...data];
    let indexStart = _.findIndex(data, foo => { return foo.hour === parseInt(initTime) })
    let indexEnd = _.findIndex(data, foo => { return foo.hour === parseInt(endTime) })
    arrayTemp = arrayTemp.slice(indexStart, indexEnd)
    setData(arrayTemp)
  }
  const resetData = () => {
    setData(initData)
    setInitTime(initData[0].hour)
    setEndTime(initData[initData.length - 1].hour)
  }

  const checkGraphFunction = (event, [param, setFunc]) => {
    const objectTemp = { ...param, graph: event.target.checked }
    setFunc(objectTemp)
  };

  const changeColorFunction = (event, [param, setFunc]) => {
    const objectTemp = { ...param, color: event.target.value }
    setFunc(objectTemp)
  };

  const checkAxeFunction = (index, [param, setFunc]) => {
    if (param.axe !== index) {
      const objectTemp = { ...param, axe: index }
      setFunc(objectTemp)
    } else {
      const objectTemp = { ...param, axe: 0 }
      setFunc(objectTemp)
    }
  };

  const handleDeleteAxe = (index) => {
    let arrayTemp = [...axes];
    arrayTemp.splice(index, 1);
    setAxes(arrayTemp);
  }

  const handleAddAxe = () => {
    const arrayTemp = [...axes, { name: 'nouvel axe' }];
    setAxes(arrayTemp);
  }

  const handleCreateAxe = () => {
    setInputAxeOpen(false)
  }

  const changeAxeFunction = (event, index, param) => {
    let arrayTemp = [...axes]
    if (param === 'name') {
      arrayTemp[index].name = event.target.value
    } else if (param === 'orientation') {
      arrayTemp[index].orientation = event.target.value
    } else if (param === 'dataMin') {
      arrayTemp[index].dataMin = event.target.value
    } else if (param === 'dataMax') {
      arrayTemp[index].dataMax = event.target.value
    }
    setAxes(arrayTemp);
  }

  return (
    <div>
      <div>
        <h4 className="center-align">Graphique</h4>
        <div className="divider"></div>
        {data &&
          <div  >
            <div id="graphToPrint" 
            className='container'
            >
              <h5 >{manipSelected.name} </h5>
              <LineChart
                width={810}
                height={550}
                data={data}
                margin={{
                  top: 10, right: 30, left: 20, bottom: 10,
                }}
                style={{ margin: 'auto' }}
              >
                <XAxis dataKey="hour" />
                {axes.length > 0 && axes.map((axe, index) =>
                  <YAxis
                    key={index}
                    yAxisId={index}
                    type="number"
                    interval={0}
                    label={{ value: axe.name, angle: -90, position: 'insideTopRight', offset: 25 }}
                    orientation={axe.orientation === 'D' ? 'right' : 'left'}
                    domain={axe.dataMax && axe.dataMax ? [parseFloat(axe.dataMin), parseFloat(axe.dataMax)] : [0, 'auto']}
                    tickMargin={20}
                  />
                )}
                <Tooltip />
                <Legend />
                {DO.graph && <Line yAxisId={DO.axe} type="monotone" dataKey="DO" stroke={DO.color} />}
                {AirFlo1.graph && <Line yAxisId={AirFlo1.axe} type="monotone" dataKey="AirFlo(1)" stroke={AirFlo1.color} />}
                {phOpt.graph && <Line yAxisId={phOpt.axe} type="monotone" dataKey="ph-Opt" stroke={phOpt.color} />}
                {OvlAir.graph && <Line yAxisId={OvlAir.axe} type="monotone" dataKey="OvlAir" stroke={OvlAir.color} />}
                {OvlCO2.graph && <Line yAxisId={OvlCO2.axe} type="monotone" dataKey="OvlCO2" stroke={OvlCO2.color} />}
                {O2Flo2.graph && <Line yAxisId={O2Flo2.axe} type="monotone" dataKey="O2Flo(2)" stroke={O2Flo2.color} />}
                {CO2Flo4.graph && <Line yAxisId={CO2Flo4.axe} type="monotone" dataKey="CO2Flo(4)" stroke={CO2Flo4.color} />}
                {Agit.graph && <Line yAxisId={Agit.axe} type="monotone" dataKey="Agit" stroke={Agit.color} />}
                {N2Flo3.graph && <Line yAxisId={N2Flo3.axe} type="monotone" dataKey="N2Flo(3)" stroke={N2Flo3.color} />}
                {OvlFlo.graph && <Line yAxisId={OvlFlo.axe} type="monotone" dataKey="OvlFlo" stroke={OvlFlo.color} />}
                {OvlO2.graph && <Line yAxisId={OvlO2.axe} type="monotone" dataKey="OvlO2" stroke={OvlO2.color} />}
                {OvlN2.graph && <Line yAxisId={OvlN2.axe} type="monotone" dataKey="OvlN2" stroke={OvlN2.color} />}
                {DensiteCellMortes.graph && <Line connectNulls yAxisId={DensiteCellMortes.axe} type="monotone" dataKey="DensitCellMortes" stroke={DensiteCellMortes.color} />}
                {DensiteCellVivantes.graph && <Line connectNulls yAxisId={DensiteCellVivantes.axe} type="monotone" dataKey="DensitCellVivantes" stroke={DensiteCellVivantes.color} />}
                {Glucose.graph && <Line connectNulls yAxisId={Glucose.axe} type="monotone" dataKey="Glucose" stroke={Glucose.color} />}
                {RdtProd.graph && <Line connectNulls yAxisId={RdtProd.axe} type="monotone" dataKey="RdtProd" stroke={RdtProd.color} />}
                <Brush />
              </LineChart>
            </div>
          
            <div style={{ display: 'flex', justifyContent: 'center', width: '100vw' }}>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_DO"
                  checked={DO.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [DO, setDO])} />
                <span>DO</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_N2Flo(3)"
                  checked={N2Flo3.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [N2Flo3, setN2Flo3])} />
                <span>N2Flo(3)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_OvlAir"
                  checked={OvlAir.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [OvlAir, setOvlAir])} />
                <span>OvlAir</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_OvlO2"
                  checked={OvlO2.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [OvlO2, setOvlO2])} />
                <span>OvlO2</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_OvlN2"
                  checked={OvlN2.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [OvlN2, setOvlN2])} />
                <span>OvlN2</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_AirFlo(1)"
                  checked={AirFlo1.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [AirFlo1, setAirFlo1])} />
                <span>AirFlo(1)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_O2Flo(2)"
                  checked={O2Flo2.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [O2Flo2, setO2Flo2])} />
                <span>O2Flo(2)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_Agit"
                  checked={Agit.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [Agit, setAgit])} />
                <span>Agit</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_OvlFlo"
                  checked={OvlFlo.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [OvlFlo, setOvlFlo])} />
                <span>OvlFlo</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_CO2Flo(4)"
                  checked={CO2Flo4.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [CO2Flo4, setCO2Flo4])} />
                <span>CO2Flo(4)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_OvlCO2"
                  checked={OvlCO2.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [OvlCO2, setOvlCO2])} />
                <span>OvlCO2</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_Temp"
                  checked={Temp.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [Temp, setTemp])} />
                <span>Temp</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_phOpt"
                  checked={phOpt.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [phOpt, setphOpt])} />
                <span>ph-Opt</span>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_DensiteCellMortes"
                  checked={DensiteCellMortes.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [DensiteCellMortes, setDensiteCellMortes])} />
                <span>DensiteCellMortes (M/mL)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_DensiteCellVivantes"
                  checked={DensiteCellVivantes.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [DensiteCellVivantes, setDensiteCellVivantes])} />
                <span>DensiteCellVivantes (M/mL)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_Glucose"
                  checked={Glucose.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [Glucose, setGlucose])} />
                <span>Glucose (g/L)</span>
              </label>
              <label className="col" style={{ marginRight: '1vw' }}>
                <input type="checkbox"
                  id="check_RdtProd"
                  checked={RdtProd.graph ? "checked" : ''}
                  onChange={(event) => checkGraphFunction(event, [RdtProd, setRdtProd])} />
                <span>RdtProd (mg/mL)</span>
              </label>
            </div>
          </div>}
      </div>
      <div className='button-upload'>
        <button className="waves-effect waves-light btn light-green darken-1" onClick={printDocument}>Telecharger le graph</button>
      </div>
      <div className='row'>
        <div style={{ display: 'flex' }} className='col s6'>
          <table style={{ width: '50%', marginLeft: '5vw' }} className="centered">
            <thead>
              <tr>
                <th>T début (h)</th>
                <th>T fin (h)</th>
                <th>
                  <button className="waves-effect waves-light btn light-green darken-1" onClick={resetData} style={{ marginTop: '45px', marginLeft: '10px' }}>
                    Reset
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{inputTimeOpen ?
                  <input
                    type="text"
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => setInitTime(event.target.value)}
                    placeholder='T début'
                  />
                  : initTime}</td>
                <td>{inputTimeOpen ?
                  <input
                    type="text"
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => setEndTime(event.target.value)}
                    placeholder='T fin'
                  />
                  : endTime}</td>
                <td>
                  {inputTimeOpen ?
                    <button className="waves-effect waves-light btn light-green darken-1" onClick={validateTimeStartEnd}>
                      <i className="material-icons">input</i>
                    </button>
                    :
                    <button className="waves-effect waves-light btn light-green darken-1" onClick={() => setInputTimeOpen(true)}>
                      <i className="material-icons">create</i>
                    </button>
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='col s6' style={{ display: 'inline-block' }} >
          <h6 style={{ fontWeight: '1000' }}>Axes (si pas de valeur min et max => automatique)</h6>
          <table style={{ width: '80%' }} class="centered">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Orientation (G ou D)</th>
                <th>Valeur min</th>
                <th>Valeur max</th>
                <th>
                  <button className="waves-effect waves-light btn light-green darken-1" onClick={handleAddAxe}>
                    <i class="material-icons">add</i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {axes && axes.map((axe, index) => (
                <tr key={index}>
                  <td>
                    {inputAxeOpen ?
                      <input
                        type="text"
                        style={{ width: '100%' }}
                        className="col s3 offset-s1 input-field name"
                        onChange={(event) => changeAxeFunction(event, index, 'name')}
                        placeholder='Nom'
                        value={axe.name !== null ? axe.name : ''}
                      />
                      : axe.name}
                  </td>
                  <td>
                    {inputAxeOpen ?
                      <input
                        style={{ width: '100%' }}
                        type="text"
                        className="col s3 offset-s1 input-field name"
                        onChange={(event) => changeAxeFunction(event, index, 'orientation')}
                        placeholder='Orientation'
                        value={axe.orientation !== null ? axe.orientation : ''}
                      />
                      : axe.orientation}
                  </td>
                  <td>
                    {inputAxeOpen ?
                      <input
                        style={{ width: '100%' }}
                        type="text"
                        className="col s3 offset-s1 input-field name"
                        onChange={(event) => changeAxeFunction(event, index, 'dataMin')}
                        placeholder='Valeur bas'
                        value={axe.dataMin !== null ? axe.dataMin : ''}
                      />
                      : axe.dataMin}
                  </td>
                  <td>
                    {inputAxeOpen ?
                      <input
                        type="text"
                        style={{ width: '100%' }}
                        className="col s3 offset-s1 input-field name"
                        onChange={(event) => changeAxeFunction(event, index, 'dataMax')}
                        placeholder='Valeur haut'
                        value={axe.dataMax !== null ? axe.dataMax : ''}
                      />
                      : axe.dataMax}</td>
                  <td>
                    {inputAxeOpen ?
                      <button className="waves-effect waves-light btn light-green darken-1" onClick={handleCreateAxe}>
                        <i class="material-icons">input</i>
                      </button>
                      : <button className="waves-effect waves-light btn light-green darken-1" onClick={() => setInputAxeOpen(true)}>
                        <i class="material-icons">create</i>
                      </button>}
                    <button className="waves-effect waves-light btn light-green darken-1" onClick={() => handleDeleteAxe(index)}>
                      <i class="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginBottom: '5vh', marginLeft: '5vw' }} className='row'>
        <table style={{ width: '90vw' }} className="centered">
          <thead>
            <tr>
              <th>Axe</th>
              <th>DO</th>
              <th>N2Flo(3)</th>
              <th>OvlAir</th>
              <th>OvlO2</th>
              <th>OvlN2</th>
              <th>AirFlo(1)</th>
              <th>O2Flo(2)</th>
              <th>Agit</th>
              <th>OvlFlo</th>
              <th>CO2Flo(4)</th>
              <th>OvlCO2</th>
              <th>Temp</th>
              <th>ph-Opt</th>
              <th>DensiteCellMortes</th>
              <th>DensiteCellVivantes</th>
              <th>Glucose</th>
              <th>RdtProd</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {inputColorOpen ?
                  <button className="waves-effect waves-light btn light-green darken-1" onClick={() => setInputColorOpen(false)}>
                    <i class="material-icons">input</i>
                  </button>
                  : <button className="waves-effect waves-light btn light-green darken-1" onClick={() => setInputColorOpen(true)}>
                    <i class="material-icons">create</i>
                  </button>}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={DO.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [DO, setDO])}
                    placeholder='Couleur'
                  />
                  : DO.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={N2Flo3.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [N2Flo3, setN2Flo3])}
                    placeholder='Couleur'
                  />
                  : N2Flo3.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={OvlAir.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [OvlAir, setOvlAir])}
                    placeholder='Couleur'
                  />
                  : OvlAir.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={OvlO2.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [OvlO2, setOvlO2])}
                    placeholder='Couleur'
                  />
                  : OvlO2.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={OvlN2.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [OvlN2, setOvlN2])}
                    placeholder='Couleur'
                  />
                  : OvlN2.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={AirFlo1.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [AirFlo1, setAirFlo1])}
                    placeholder='Couleur'
                  />
                  : AirFlo1.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={O2Flo2.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [O2Flo2, setO2Flo2])}
                    placeholder='Couleur'
                  />
                  : O2Flo2.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={Agit.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [Agit, setAgit])}
                    placeholder='Couleur'
                  />
                  : Agit.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={OvlFlo.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [OvlFlo, setOvlFlo])}
                    placeholder='Couleur'
                  />
                  : OvlFlo.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={CO2Flo4.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [CO2Flo4, setCO2Flo4])}
                    placeholder='Couleur'
                  />
                  : CO2Flo4.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={OvlCO2.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [OvlCO2, setOvlCO2])}
                    placeholder='Couleur'
                  />
                  : OvlCO2.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={Temp.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [Temp, setTemp])}
                    placeholder='Couleur'
                  />
                  : Temp.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={phOpt.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [phOpt, setphOpt])}
                    placeholder='Couleur'
                  />
                  : phOpt.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={DensiteCellMortes.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [DensiteCellMortes, setDensiteCellMortes])}
                    placeholder='Couleur'
                  />
                  : DensiteCellMortes.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={DensiteCellVivantes.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [DensiteCellVivantes, setDensiteCellVivantes])}
                    placeholder='Couleur'
                  />
                  : DensiteCellVivantes.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={Glucose.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [Glucose, setGlucose])}
                    placeholder='Couleur'
                  />
                  : Glucose.color}
              </td>
              <td>
                {inputColorOpen ?
                  <input
                    type="text"
                    value={RdtProd.color}
                    style={{ width: '100%' }}
                    className="col s3 offset-s1 input-field name"
                    onChange={(event) => changeColorFunction(event, [RdtProd, setRdtProd])}
                    placeholder='Couleur'
                  />
                  : RdtProd.color}
              </td>
            </tr>
            {axes && axes.map((axe, index) => (
              <tr key={index}>
                <td>{axe.name}</td>
                <td><div onClick={() => checkAxeFunction(index, [DO, setDO])}>{DO.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [N2Flo3, setN2Flo3])}>{N2Flo3.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [OvlAir, setOvlAir])}>{OvlAir.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [OvlO2, setOvlO2])}>{OvlO2.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [OvlN2, setOvlN2])}>{OvlN2.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [AirFlo1, setAirFlo1])}>{AirFlo1.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [O2Flo2, setO2Flo2])}>{O2Flo2.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [Agit, setAgit])}>{Agit.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [OvlFlo, setOvlFlo])}>{OvlFlo.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [CO2Flo4, setCO2Flo4])}>{CO2Flo4.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [OvlCO2, setOvlCO2])}>{OvlCO2.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [Temp, setTemp])}>{Temp.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [phOpt, setphOpt])}>{phOpt.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [DensiteCellMortes, setDensiteCellMortes])}>{DensiteCellMortes.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [DensiteCellVivantes, setDensiteCellVivantes])}>{DensiteCellVivantes.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [Glucose, setGlucose])}>{Glucose.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
                <td><div onClick={() => checkAxeFunction(index, [RdtProd, setRdtProd])}>{RdtProd.axe === index ? <i class="material-icons">done</i> : <i class="material-icons">crop_square</i>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const mapStateToProps = store => ({
  manipList: store
});

export default withRouter(connect(mapStateToProps)(Graph))