import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ManipList from './Components/ManipList/ManipList';
import Upload from './Components/Upload/Upload';
import Menu from './Components/Menu/Menu';
import Graph from './Components/Graph/Graph';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import setHeaderToken from './Utils/tokenUtil';
import conf from './app.conf';

import { tokenApprovedTrueAction } from './Actions/tokenAction';

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
        .catch((error) => {
          console.log(error);
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
