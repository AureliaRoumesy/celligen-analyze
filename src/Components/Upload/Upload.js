import React, { useState, useEffect } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import axios from 'axios';
import setHeaderToken from '../../Utils/tokenUtil';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import M from 'materialize-css/dist/js/materialize.js';
import 'react-datepicker/dist/react-datepicker.css';
import { message, Spin, Icon } from 'antd';
import conf from '../../app.conf';
import './Upload.css';

registerLocale('fr', fr);

function Upload() {
  const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState([]);
  const [fileLength, setFileLength] = useState(-1)
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [manipName, setManipName] = useState('');
  const [wrongExtention, setWrongExtention] = useState(false);
  const [finished, setFinished] = useState(false);
  const [manipInProgress, setManipInProgress] = useState({});
  const [manipSelected, setManipSelected] = useState('new');
  const [externalFile, setExternalFile] = useState(false);
  const [dateStart, setDateStart] = useState(new Date())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    M.AutoInit();
  }, [])

  useEffect(() => {
    setHeaderToken(() => {
      axios.get(`${conf.url}/manipinprogress/`)
        .then(data => {
          setManipInProgress(data.data)
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, []);

  const renderFile = (files) => {
    let array = [];
    let resultTemp = [];
    for (let i = 0; i < files.length; i++) {
      array = [...array, files[i]];
    }
    array.map((file) => {
      let fileName = file.name;

      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx" || fileName.slice(fileName.lastIndexOf('.') + 1) === "xls") {
        console.log('good extension');
        setWrongExtention(false);
        return ExcelRenderer(file, (err, resp) => {
          if (err) throw err;
          resultTemp = [...resultTemp, resp.rows];
          setResult(resultTemp);
        });
      }
      else {
        return setWrongExtention(true);
      }
    })
  }
  useEffect(() => {
    if (result.length === fileLength) {
      console.log(externalFile)
      setFiles([finished, manipName, result, externalFile, dateStart])
      setFilesUploaded(true)
      setLoading(false)
    }
  }, [result.length, manipName.length, finished, externalFile, dateStart])

  const handleSubmit = () => {
    console.log(files)
    setLoading(true)
    if (manipSelected === 'new') {
      setHeaderToken(() => {
        axios.post(`${conf.url}/upload`, files)
          .then(res => {
            console.log(res.status)
            if (res.status === 200) {
              message.success("succesfully saved", 3);
            } else if (res.status === 400) {
              message.error('Manipulation not saved. Manipulation name aready used, please choose another.', 3);
            }
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            message.error('Manipulation not saved. Server problem or manipulation name aready used, please try again.', 3);
            setLoading(false)
          });
      });
    } else {
      setHeaderToken(() => {
        axios.put(`${conf.url}/upload/${manipSelected}`, files)
          .then(res => {
            if (res.status === 200) {
              message.success("succesfully saved", 3);
            } else if (res.status === 888) {
              message.error('Manipulation name already used, please choose another.', 3);
            }
            setLoading(false)
          })
          .catch(() => {
            message.error('Manipulation not saved. Server problem, please try again.', 3);
            setLoading(false)
          });
      });
    }
  }

  const fileHandler = (event) => {
    console.log(event.target.files)
    setLoading(true)
    if (event.target.files.length) {
      let fileList = event.target.files;
      renderFile(fileList);
      setFileLength(event.target.files.length);
    }
    if (event.target.files.length === 2) {
      setExternalFile(false);
    } else {
      setExternalFile(true);
    }
  }

  return (
    <div className='container' >
      <h4 className="center-align">Téléchargement des fichiers excel</h4>
      <div className="divider"></div>
      <div className="row">
        {manipName.length > 0 ? '' : <p className="col s12" >Entrer un nom de manipulation</p>}
      </div>
      <div className="row section">
        <select className="browser-default input-field col s4" value={manipSelected} onChange={(event) => setManipSelected(event.target.value)}>
          <option value="new">Nouvelle manip</option>
          {manipInProgress.length && manipInProgress.map((manip, index) => (
            <option key={index} value={manip.name}>{manip.name}</option>))}
        </select>
        {manipSelected === 'new' ? 
          <div>
            <input type="text" className="col s3 offset-s1 input-field name" onChange={(event) => setManipName(event.target.value)} placeholder='Nom de la manipulation' /> 
            <div className="input-field col" style={{ marginTop: '-5vh' }}>
              <p style={{ color: 'black', fontSize: '1.2em' }}>Date de début de manip :</p>
              <DatePicker
                locale="fr"
                dateFormat="dd/MM/yyyy"
                selected={dateStart && new Date(dateStart)}
                onChange={date => date && setDateStart(date)}
              />
            </div>
          </div>
          : null}
      </div>
      <div className="row section">
        {/* <input className="col s6 input-field" type="file" multiple onChange={fileHandler} /> */}

        <div className="file-field input-field">
          <div className="section waves-effect waves-light btn light-green darken-1">
            <span>Parcourir</span>
            <input type="file" multiple onChange={fileHandler} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Téléchargement fichiers Celligen" />
          </div>
        </div>

        <div className="file-field input-field">
          <div className="section waves-effect waves-light btn light-green darken-1">
            <span>Parcourir</span>
            <input type="file" onChange={fileHandler} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Téléchargement fichier externe" />
          </div>
        </div>

        <div className="input-field col s6">
          <label>
            <input type="checkbox"
              id="check_finish_manip"
              checked={finished ? "checked" : ''}
              onChange={(event) => setFinished(event.target.checked)} />
            <span>Cocher si la manipulation est finie</span>
          </label>
        </div>
        
      </div>
      {loading && <Spin indicator={antIcon} style={{ color: '#7cb342'}}/>}
      {(filesUploaded && manipName.length && !loading) || (filesUploaded && manipSelected && !loading) ? <button className="section waves-effect waves-light btn light-green darken-1" onClick={handleSubmit} >Envoyer</button> : ''}
      {wrongExtention ? <p className="section" >Mauvaise extension, choisir une extension *.xls ou *.xlsx.</p> : ''}
    </div>
  );
}

export default Upload;