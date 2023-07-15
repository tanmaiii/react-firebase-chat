import React from "react";
import "./headerChat.scss";
import img from "../../../assets/nofile.jpg";
import { useChat } from "../../../contexts/ChatContext";


export default function HeaderChat() {
  const { data } = useChat();

  return (
    <div className="headerChat">
      <div className="headerChat_left">
        <img src={data.user?.photoURL} alt="" />
        <span>Conversation with</span>
        <h3>{data.user?.displayName}</h3>
      </div>
      <div className="headerChat_right">
        
      </div>
    </div>
  );
}
