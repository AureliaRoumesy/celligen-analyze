import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';
import setHeaderToken from '../../Utils/tokenUtil';
import { message } from 'antd';
import conf from '../../app.conf';
import './ManipList.css';

//ACTIONS 
import { addManipList } from '../../Actions/manipListAction';

function ManipList(props) {
  const [manipList, setManipList] = useState([]);
  const [filterName, setFilterName] = useState(false);
  const [filterDate, setFilterDate] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);

  useEffect(() => {
    setHeaderToken(() => {
      axios.get(`${conf.url}/manip/`)
        .then(data => {
          props.dispatch(addManipList(data.data))
          setManipList(data.data)
        })
        .catch(() => {
          message.error('Problem when retrieving data. Please refresh the page', 3);
        });
    });
  }, []);

  const handleDelete = (index) => {
    setHeaderToken(() => {
      axios.delete(`${conf.url}/manip/${manipList[index].name}`)
        .then(res => {
          if (res.status === 200) {
            const arrayTemp = [...manipList];
            arrayTemp.splice(index, 1);
            setManipList(arrayTemp);
            message.success("succesfully deleted", 3);
          }
        })
        .catch(() => {
          message.error('Manipulation not deleted. Server problem, please try again.', 3);
        });
    });
  };

  const filterManips = (tag, [param, setFunc]) => {
    if (param) {
      setManipList(manipList.reverse());
    } else {
      setManipList(manipList.sort((a, b) => (a[tag] > b[tag] ? 1 : -1)));
    }
    setFunc(!param);
  };

  return (
    <div className="container" >
      <h4>Liste des manip</h4>
      <ul className="collection with-header">
        <li className="collection-header row center-align text-white light-green darken-1">
          <p className="col s3" style={{ color: 'white' }} onClick={() => filterManips('name', [filterName, setFilterName])}>Nom de la manip</p>
          <p className="col s3" style={{ color: 'white' }} onClick={() => filterManips('dateStart', [filterDate, setFilterDate])}>Date début de manip</p>
          <p className="col s3" style={{ color: 'white' }} onClick={() => filterManips('finish', [filterStatus, setFilterStatus])}>Status</p>
          <p className="col s3" style={{ color: 'white' }}>Graph</p>
        </li>
        {manipList.length && manipList.map((manip, index) => (
          <div key={index}>
            <li className="collection-item row center-align" >
              <p className="col s3">{manip.name}</p>
              <p className="col s3">{moment(manip.dateStart).format('ll')}</p>
              <p className="col s3">{manip.finish ? 'Finie' : 'En cours'}</p>
              <p className="col s3">
                <Link
                  className="waves-effect waves-light btn-small light-green darken-1"
                  style={{ textdecoration: 'none', color: 'white' }}
                  to={{
                    pathname: '/graph',
                    search: `id=${manip._id}`,
                  }}><i className="material-icons">show_chart</i>
                </Link>
                <button
                  type="button"
                  className="waves-effect waves-light btn-small light-green darken-1 right"
                  onClick={() => handleDelete(index)}
                >
                  <i className="material-icons">delete</i>
                </button>
              </p>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default connect()(ManipList);

