import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import conf from '../../app.conf';

function SignUp() {
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [nameSignUp, setNameSignUp] = useState('');
  const [adminSignUp, setAdminSignUp] = useState({});

  useEffect(() => {
    const adminTemp = {
      nameSignUp,
      emailSignUp,
      passwordSignUp,
    };
    setAdminSignUp(adminTemp);
  }, [emailSignUp, passwordSignUp, nameSignUp]);

  const handleSendSignUp = () => {
    axios.post(`${conf.url}/login/SignUp`, adminSignUp)
      .then(() => {
        message.success('Enregistré avec succès.', 3);
      })
      .catch(() => {
        message.error("Problème lors de l'enregistrement du nouvel admin.", 3);
      });
  };

  return (
    <div className="valign-wrapper">
      <div className="centerLogin">
        <h3>Enregistrement nouvel admin</h3>
        <div className="row">
          <div className="input-field col s4">
            <input
              id="nameSignUp"
              type="text"
              value={nameSignUp}
              onChange={event => setNameSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="nameSignUp">Nom</label>
          </div>
          <div className="input-field col s4">
            <input
              id="emailSignUp"
              type="email"
              value={emailSignUp}
              onChange={event => setEmailSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="emailSignUp">Email</label>
          </div>
          <div className="input-field col s4">
            <input
              id="passwordSignUp"
              type="password"
              value={passwordSignUp}
              onChange={event => setPasswordSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="passwordSignUp">mot de passe</label>
          </div>
        </div>
        <div className="input-field row loginButton">
          <button
            type="button"
            className="waves-effect waves-light btn-small light-green darken-1 white-text col s2 offset-s3"
            onClick={handleSendSignUp}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
