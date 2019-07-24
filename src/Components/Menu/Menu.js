import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Menu.css';

import { tokenApprovedFalseAction } from '../../Actions/tokenAction';

function Menu({ dispatch }) {
  const [sidebarDisplay, setSidebarDisplay] = useState('sidebarNO');
  const handleClick = () => {
    if (sidebarDisplay === 'sidebarNO') {
      setSidebarDisplay('sidebarYES');
    } else {
      setSidebarDisplay('sidebarNO');
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem('id_token');
    dispatch(tokenApprovedFalseAction());
  };

  return (
    <div>
      <nav>
        <div className='nav-wrapper white'>
          <a href='/#' className='brand-logo'>CelliGen Analize</a>
          <a href='/#' data-target='mobile-demo' className='sidenav-trigger'><i className='material-icons icon-green' onClick={handleClick}>menu</i></a>
          <ul className='right hide-on-med-and-down' style={{ display: 'flex', alignItems: 'center' }}>
            <li><NavLink exact to='/'>Manip List</NavLink></li>
            <li><NavLink exact to='/upload'>Upload</NavLink></li>
            <li><NavLink exact to='/graph'>Graph</NavLink></li>
            <li>
              <button
                type='button'
                className='waves-effect waves-light btn-small light-green darken-1 white-text col s2 right'
                onClick={handleDisconnect}
              >
                Se déconnecter
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <ul className={sidebarDisplay} id='mobile-demo'>
        <li><NavLink onClick={handleClick} exact to='/'>Manip List</NavLink></li>
        <li><NavLink onClick={handleClick} exact to='/upload'>Upload</NavLink></li>
        <li><NavLink onClick={handleClick} exact to='/graph'>Graph</NavLink></li>
        <li>
          <button
            type='button'
            className='waves-effect waves-light btn-small light-green darken-1 white-text col s2 right'
            onClick={handleDisconnect}
          >
            Se déconnecter
          </button>
        </li>
      </ul>
    </div >
  );
}

export default connect()(Menu);