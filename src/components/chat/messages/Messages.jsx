import React, { useEffect, useState, useRef } from "react";
import "./messages.scss";
import img from "../../../assets/nofile.jpg";
import { useChat } from "../../../contexts/ChatContext";
import { useAuth } from "../../../contexts/AuthContext";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage, auth } from "../../../utils/firebase";

export default function Messages() {
  const { data } = useChat();
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef()

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId),(doc) => {
      doc.exists() && setMessages(doc.data().messages)
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    messagesRef.current.style.transform = `translateY(0%)`
  }, [messages]);


  return (
    <div className="messages" ref={messagesRef}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { data } = useChat();

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const time =`${new Date(message.date.seconds*1000).getHours()} : ${new Date(message.date.seconds*1000).getMinutes() }`

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
      ref={ref}
    >
      <img className="message_avt" src={data.user.photoURL} alt="" />
      <div className="message_content">
        {
          message.text !== '' && <p>{message.text}</p>
        }
        <div className="message_content_img">
          {message.img && <img src={message.img} alt="" />}
        </div>
        <span className="message_content_time">{time}</span>
      </div>
    </div>
  );
};
