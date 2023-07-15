import React, { useRef,useState,useEffect} from "react";
import "./input.scss";
import { ImFilePicture } from "react-icons/im";
import { AiOutlineSend } from "react-icons/ai";
import { useChat } from "../../../contexts/ChatContext";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, onSnapshot,updateDoc,getDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { ref ,getDownloadURL, uploadBytesResumable} from "firebase/storage";
import { db, storage, auth } from "../../../utils/firebase";
import {v4 as uuid} from 'uuid'

export default function Input() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null)
  const { data } = useChat();
  const { currentUser } = useAuth();

  const inputRef = useRef();

  const handleInput = () => {
    console.log('input', inputRef.current.scrollHeight);
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
  }

  const handleSend = async () => {
    if(file){
      const storageRef = ref(storage, uuid())

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        (err)=> {

        },
        ()=> {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId),{
              messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId:currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
              }),
            })
          });
        }
      )

    }else{
      await updateDoc(doc(db, 'chats', data.chatId),{
          messages: arrayUnion({
              id: uuid(),
              text,
              senderId:currentUser.uid,
              date: Timestamp.now(),
          })
      })

      await updateDoc(doc(db, 'userChats', currentUser.uid),{
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      })

      await updateDoc(doc(db, 'userChats', data.user.uid),{
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      })

    }
    setText('')
    setFile(null)
  }

  useEffect(() => {
    if(text.length === 0) {
      inputRef.current.style.height = '55px'
    }
  },[text])
  
  return (
    <div className="input">
        <textarea
          ref={inputRef}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Type something..."
          onInput={handleInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="send">
          <input
            type="file"
            style={{ display: "none" }}
            id="fileImg"
            className="input-img"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="label-img" htmlFor="fileImg">
            <ImFilePicture />
          </label>
          <button className="btn-send" onClick={handleSend}>
            <AiOutlineSend />
          </button>
        </div>
    </div>
  );
}
