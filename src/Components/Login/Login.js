import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { tokenApprovedTrueAction } from '../../Actions/tokenAction';
import conf from '../../app.conf';
import './Login.css';

function Login({ dispatch }) {
  const [emailSignIn, setEmailSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');
  const [adminSignIn, setAdminSignIn] = useState({});

  useEffect(() => {
    const adminTemp = {
      emailSignIn,
      passwordSignIn,
    };
    setAdminSignIn(adminTemp);
  }, [emailSignIn, passwordSignIn]);

  const handleSendSignIn = () => {
    axios.post(`${conf.url}/login`, adminSignIn)
      .then((data) => {
        const token = data.data;
        localStorage.setItem('id_token', token);
        dispatch(tokenApprovedTrueAction());
        message.success("Bienvenue sur l'espace admin !", 3);
      })
      .catch(() => {
        message.error('Erreur dans le mail ou le mot de passe.', 3);
      });
  };

  return (
    <div className='valign-wrapper'>
      <div className='centerLogin'>
        <h2>Celligen Analyze</h2>

        <div className='row'>
          <div className='input-field col s6'>
            <input
              id='emailSignIn'
              type='email'
              value={emailSignIn}
              onChange={event => setEmailSignIn(event.target.value)}
              required
              className='validate'
            />
            <label htmlFor='emailSignIn'>Email</label>
          </div>
          <div className='input-field col s6'>
            <input
              id='passwordSignIn'
              type='password'
              value={passwordSignIn}
              onChange={event => setPasswordSignIn(event.target.value)}
              required
              className='validate'
            />
            <label htmlFor='passwordSignIn'>Mot de passe</label>
          </div>
        </div>
        <div className='input-field row loginButton'>
          <button
            type='button'
            style={{ margin: 'auto' }}
            className='waves-effect waves-light btn-small light-green darken-1 white-text col s2 offset-s3'
            onClick={handleSendSignIn}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  dispatch: PropTypes.func,
};

Login.defaultProps = {
  dispatch: null,
};

export default connect()(Login);
