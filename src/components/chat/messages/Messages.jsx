import React, { useEffect, useState, useRef } from "react";
import "./messages.scss";
import { useChat } from "../../../contexts/ChatContext";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import Modal from "../../modal/Modal";
import {FiArrowDownCircle} from 'react-icons/fi'

export default function Messages() {
  const [file, setFile] = useState(null)
  const { data } = useChat();
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    messagesRef.current.style.transform = `translateY(0%)`;
  }, [messages]);


  return (
    <>
    <div className="messages" ref={messagesRef}>
      {messages.map((m) => (
        <Message message={m} key={m.id} setFile={setFile}/>
        ))}
    </div>
    <Modal file={file}/>
    </>
    
  );
}

const Message = (props) => {
  const { currentUser } = useAuth();
  const { data } = useChat();
  const message = props.message

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleModalImg = (e) => {
    const modal = document.querySelector('#modal')
    modal.classList.add('active')
    props.setFile(e.target.src)
  }

  const time = `${new Date(
    message.date.seconds * 1000
  ).getHours()} : ${new Date(message.date.seconds * 1000).getMinutes()}`;

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
      ref={ref}
    >
      <img className="message_avt" src={data.user.photoURL} alt="" />
      <div className="message_content">
        {message.text !== "" && <p>{message.text}</p>}
        <div className="message_content_img" >
          {message.img && <img src={message.img} alt="" onClick={(e) => handleModalImg(e)}/>}
          {message.file && <a href={message.file}  target="_blank" className="message_content_img_file">
                 <i className="fa-solid fa-file"></i> 
                 <span>{ message.fileName ? message.fileName : 'name file'}</span> 
                <FiArrowDownCircle/>
              </a>
          }
        </div>
        <span className="message_content_time">{time}</span>
      </div>
    </div>
  );
};
