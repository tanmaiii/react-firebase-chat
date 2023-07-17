import React, { useRef, useState, useEffect, memo } from "react";
import "./input.scss";
import img from "../../../assets/avatar.jpg";

import { ImFilePicture } from "react-icons/im";
import { AiOutlineSend,AiFillFileAdd } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";

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
import { v4 as uuid } from "uuid";

function Input() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [imgRev, setImgRev] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fileRef = useRef();
  const { data } = useChat();
  const { currentUser } = useAuth();

  const inputRef = useRef();

  const handleInput = () => {
    
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  };

  const handleSend = async () => {
    setError(false);
    setLoading(true);

    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (err) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                file: downloadURL,
                fileName: file.name,
              }),
            });
          });
        }
      );
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: file.name,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: file.name,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } else if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (err) => {
          setError("Error uploading file");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: img.name,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: img.name,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } else {
      if (text.length === 0) return setLoading(false);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setFile(null);
    setImg(null)
    setImgRev(null);
    setLoading(false);
    fileRef.current.value = "";
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setImg(file);
      file.preview = URL.createObjectURL(file);
    } else {
      setFile(file);
    }
    setImgRev(file);
  };

  const handleClearFile = () => {
    setFile(null);
    setImgRev(null);
    fileRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      imgRev && URL.revokeObjectURL(imgRev.preview);
    };
  }, [imgRev]);

  useEffect(() => {
    if (text.length === 0) {
      inputRef.current.style.height = "55px";
    }
  }, [text]);

  return (
    <div className="input">
      <div className="main">
        {imgRev && (
          <div className="main_img">
            {imgRev.preview ? (
              <img src={imgRev.preview} alt="" />
            ) : (
              <div className="main_img_file">
                <i className="fa-solid fa-file"></i>
                <h4>{imgRev.name}</h4>
              </div>
            )}
            <button className="" onClick={handleClearFile}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
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
      </div>
      <div className="send">
        <input
          ref={fileRef}
          type="file"
          style={{ display: "none" }}
          id="fileImg"
          className="input-img"
          onChange={(e) => handleFile(e)}
        />
        <label className='lable-file' htmlFor="fileImg">
          <AiFillFileAdd/>
        </label>
        <label className="label-img" htmlFor="fileImg">
          <ImFilePicture />
        </label>
        <button disabled={loading} className="btn-send" onClick={handleSend}>
          {loading ? "..." : <AiOutlineSend />}
        </button>
      </div>
    </div>
  );
}

export default memo(Input);
