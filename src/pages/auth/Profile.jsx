import React, { useEffect, useState } from "react";
import "./auth.scss";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../utils/firebase";
import { doc, onSnapshot  } from "firebase/firestore";

import { HiMail } from "react-icons/hi";
import { BiSolidLockAlt } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { AiFillCamera, AiFillPhone } from "react-icons/ai";
import { BsFillBookFill } from "react-icons/bs";


export default function Profile() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    const getUser = () => {
      const docRef = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setUser(doc.data());
      });

      return () => {
        docRef();
      };
    };
    currentUser.uid && getUser();
  }, [currentUser.uid]);

  return (
    <div className="container-auth">
      {user && (
        <div className="auth_profile auth">
          <div className="auth_img">
            <img src={currentUser.photoURL}alt="" />
          </div>
          <div className="auth_body">
            <div className="auth_body_item">
              <label htmlFor=""><BiSolidUser/></label>
              <span>{currentUser.displayName}</span>
            </div>
            <div className="auth_body_item">
              <label htmlFor=""><AiFillPhone/></label>
              <span>{user.phone}</span>
            </div>
            <div className="auth_body_item">
              <label htmlFor=""><HiMail/></label>
              <span>{user.email}</span>
            </div>
            <div className="auth_body_item">
              <label htmlFor=""><BsFillBookFill/></label>
              <span>{user.dcs}</span>
            </div>
            <div className="auth_body_item_btn">
              <button className="btn btn-red" onClick={handleLogout}>
                Logout
              </button>
              <Link to={"/auth/update-profile"}>
                <button className="btn btn-blue">Update</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
