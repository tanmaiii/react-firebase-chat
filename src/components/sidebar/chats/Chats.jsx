import React, { useEffect, useRef, useState } from "react";
import { db, storage, auth } from "../../../utils/firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { useChat } from "../../../contexts/ChatContext";
import "./chats.scss";
import img from "../../../assets/nofile.jpg";
import { doc, onSnapshot } from "firebase/firestore";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({type: 'CHANGE_USER', payload: u})
  }

  return (
    <div className="chats">
      {chats && Object.entries(chats).sort((a,b)=> b[1].date - a[1].date).map((chat,i) => (
        <div key={i} className="userChat" onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo?.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo?.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
