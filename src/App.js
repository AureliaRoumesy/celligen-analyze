import axios from 'axios';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { message } from 'antd';
import { tokenApprovedTrueAction } from './Actions/tokenAction';
import conf from './app.conf';
import Graph from './Components/Graph/Graph';
import Login from './Components/Login/Login';
import ManipList from './Components/ManipList/ManipList';
import Menu from './Components/Menu/Menu';
import SignUp from './Components/SignUp/SignUp';
import Upload from './Components/Upload/Upload';
import setHeaderToken from './Utils/tokenUtil';


function App({ tokenApproved, dispatch }) {
  useEffect(() => {
    setHeaderToken(() => {
      axios.post(`${conf.url}/auth`)
        .then((res) => {
          if (res.status === 200) {
            dispatch(tokenApprovedTrueAction());
          } else {
            localStorage.removeItem('id_token');
          }
        })
        .catch(() => {
          message.error("Problème lors de l'authentification", 3);
        });
    });
  }, []);

  return (
    <div>
      {tokenApproved ? (
        <div>
          <Menu />
          <Route path='/' exact component={ManipList} />
          <Route path='/upload' exact component={Upload} />
          <Route path='/graph' exact component={Graph} />
          <Route path="/signup" exact component={SignUp} />
        </div>
      ):
      <Login />
      }
    </div>
  );
}

const mapStateToProps = store => ({
  tokenApproved: store.token,
});

export default connect(mapStateToProps)(App);
