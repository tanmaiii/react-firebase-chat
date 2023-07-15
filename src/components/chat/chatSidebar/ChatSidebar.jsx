import React, { useState, useEffect } from "react";
import "./chatSidebar.scss";
import img from "../../../assets/nofile.jpg";
import avt from "../../../assets/sdsad.jpg";
import { BiPhoneCall } from "react-icons/bi";
import { FiVideo } from "react-icons/fi";
import { IoMdVolumeOff } from "react-icons/io";
import { useChat } from "../../../contexts/ChatContext";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";

export default function ChatSidebar() {
  const [user, setUser] = useState();
  const { data } = useChat();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getDoc(doc(db, "users", data.user.uid));
        if (res.exists()) return setUser(res.data());
      } catch (err) {
        console.log(err);
      }
    };
    data.user.uid && getUser();
  }, [data.user.uid]);

  return (
    data.user.uid && (
      <div className="chatSidebar">
        <div className="chatSidebar_info">
          <img src={user?.photoURL} alt="" />
          <h3 className="chatSidebar_info_name">{user?.displayName}</h3>
          <span className="chatSidebar_info_number">{user?.phone}</span>
          <div className="chatSidebar_info_control">
            <button>
              <BiPhoneCall />
            </button>
            <button>
              <FiVideo />
            </button>
            <button>
              <IoMdVolumeOff />
            </button>
          </div>
          <div className="chatSidebar_info_dcs">{user?.dcs}</div>
          <div className="chatSidebar_info_tag">
            <ul>
              <li>UI</li>
              <li>UX</li>
              <li>website degsite</li>
              <li>play game</li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
}
