import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./search.scss";
import img from "../../../assets/nofile.jpg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { query, collection, where, getDocs, or ,doc, onSnapshot,getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage, auth } from "../../../utils/firebase";
import { useAuth } from "../../../contexts/AuthContext";


export default function Search() {
  const resultRef = useRef();
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { logout, currentUser } = useAuth();

  useEffect(() => {
    if (username.length === 0) {
      users && (resultRef.current.style.display = "none");
    }
  }, [username]);

  const handleKeyDown = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSearch = async () => {
    setErr(false);
    const data = [];
    const newData = [];

    const q = query(
      collection(db, "users"),
      or(where("displayName", "==", username), where("phone", "==", username))
    );
    try {
      const querySnapshot = await getDocs(q);
      let i = 0;
      const result = Object.entries(querySnapshot.docs);
      result.forEach((item) => {
        data.push(item[1].data());
      });

      for (let i = 0; i < data.length; i++) {
        if (!newData.includes(data[i])) {
          newData.push(data[i]);
        }
      }

      setUsers(newData);
      resultRef.current.style.display = "block";
      if (newData.length === 0) return setErr(true);
    } catch (err) {
      setErr(true);
    }
  };

  async function handleSelect(user){

    const combinedId =
    currentUser.uid > user.uid
      ? currentUser.uid + user.uid
      : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        console.log('xong');
      }
    } catch (err) {}

    setUsers(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="search_input">
        <button>
          <FiSearch />
        </button>
        <input
          type="text"
          name=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id=""
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <button className="btn-close" onClick={() => setUsername("")}>
          <AiOutlineCloseCircle />
        </button>
      </div>
      {users && (
        <div ref={resultRef} className="search_result">
          {err ? <div className="userChat err">No result</div> : ""}
          {users.map((user, key) => (
            <div key={key} className="userChat" onClick={ () =>  handleSelect(user)}>
              <img src={user.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{user.displayName}</span>
                <p>{user.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
