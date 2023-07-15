import React, { useEffect } from "react";
import "./navbar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";

import img from "../../assets/nofile.jpg";
import {FaRegUserCircle} from 'react-icons/fa'
import {BsChatSquareDots} from 'react-icons/bs'
import {TiThMenu} from 'react-icons/ti'

import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const {pathname} = useLocation();
  const {currentUser} = useAuth()

  const handleBtnMenu = () => {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('active');
    console.log(sidebar);
  }

  return (
    <div className="navbar">
      <div className="navbar_left">
        <div className="navbar_logo">CHAT APP</div>
        <div className="navbar_control">
            <Link to={'/auth/profile'} className={pathname === '/auth/profile' || pathname ===  '/auth/update-profile'  ? `navbar_control_item active` : `navbar_control_item`}>
              <FaRegUserCircle/>
              <span >Contacts</span>
            </Link>
            <Link to={'/'} className={pathname === '/'  ? `navbar_control_item active` : `navbar_control_item`}>
              <BsChatSquareDots/>
              <span >Chat</span>
            </Link>
        </div>
      </div>
      <div className="navbar_right_info">
        <div className="navbar_info_body">
          <span> Hello, {currentUser.displayName}</span>
        </div>
        <img src={currentUser.photoURL} alt="" />
      </div>
      <div  className="navbar_right_menu" onClick={handleBtnMenu}>
        <button id="btnMenu">
          <TiThMenu/>
        </button>
      </div>
    </div>
  );
}
