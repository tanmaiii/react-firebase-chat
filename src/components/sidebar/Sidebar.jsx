import React from "react";
import "./sidebar.scss";
import Search from "./search/Search";
import Chats from "./chats/Chats";
import {IoMdClose} from 'react-icons/io'
export default function Sidebar() {

  const handleBtncClose = () => {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('active') ;

  }

  return (
    <div id="sidebar" className="sidebar col pc-2 t-3 m-7">
      <Search/>
      <Chats/>
      <button className="sidebar_btn_close" onClick={handleBtncClose}>
        <IoMdClose/>
      </button>
    </div>
  );
}
