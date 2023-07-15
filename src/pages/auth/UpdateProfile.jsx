import React, { useEffect, useState, useRef } from "react";
import img from "../../assets/sdsad.jpg";
import { Link, useNavigate } from "react-router-dom";
import { GrAddCircle } from "react-icons/gr";

import { HiMail } from "react-icons/hi";
import { BiSolidLockAlt } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { AiFillCamera, AiFillPhone } from "react-icons/ai";
import { BsFillBookFill } from "react-icons/bs";

import { useAuth } from "../../contexts/AuthContext";
import { db, storage, auth } from "../../utils/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function UpdateProfile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const fileRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();
  const phoneRef = useRef();
  const dcsRef = useRef();

  const {
    currentUser,
    authUpdateProfile,
    authUpdateEmail,
    authUpdatePassword,
  } = useAuth();

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

  const handleUpdate = async () => {
    const file = fileRef.current.files[0];
    const displayName = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const dcs = dcsRef.current.value;
    const phone = phoneRef.current.value;

    const date = new Date().getTime();
    const storageRef = ref(storage, `${currentUser.displayName + date}`);

    setMessage("");
    setError("");

    if (passwordRef.current.value.length < 6) {
      return setError("Password of 6 characters or more");
    }

    if (passwordRef.current.value !== rePasswordRef.current.value) {
      return setError("Password does not match");
    }
    setLoading(true);
    try {
      setError("");

      if (file !== undefined) {
        uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (dowloadURL) => {
            try {
              await authUpdateProfile({
                photoURL: dowloadURL,
              });
              updateDoc(doc(db, "users", currentUser.uid), {
                photoURL: dowloadURL,
              });
            } catch (error) {
              setError("Failed to upload photo");
            }
          });
        });
      }

      await authUpdateProfile({
        displayName: displayName,
      });
      await authUpdateEmail(email);
      await authUpdatePassword(password);

      updateDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        displayName: displayName,
        email: email,
        dcs: dcs,
        phone: phone,
      });

      setMessage("Update profile successfully !");
      navigate("/auth/profile");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Update profile error");
    }
  };

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);

  const handleInputImg = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
  };

  return (
    <div className="container-auth">
      <div className="auth_UpdateProfile auth">
        <div className="auth_img">
          {avatar ? (
            <img src={avatar.preview} alt="" />
          ) : (
            <img src={currentUser.photoURL} alt="" />
          )}
          <label htmlFor="inputImg">
            <GrAddCircle />
          </label>
          <input
            autoComplete="none"
            ref={fileRef}
            id="inputImg"
            style={{ display: "none" }}
            type="file"
            name=""
            onChange={handleInputImg}
          />
        </div>

        {user && (
          <div className="auth_body">
            {error && (
              <div className="auth_body_item_error">
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="auth_body_item_message">
                <span>{message}</span>
              </div>
            )}
            <div className="auth_body_item">
              <label htmlFor="">
                <BiSolidUser />
              </label>
              <input
                ref={nameRef}
                placeholder="username"
                autoComplete="none"
                type="text"
                defaultValue={currentUser.displayName}
              />
            </div>
            <div className="auth_body_item">
              <label htmlFor="">
                <AiFillPhone />
              </label>
              <input
                placeholder="your phone"
                defaultValue={user.phone}
                ref={phoneRef}
                autoComplete="none"
                type="text"
              />
            </div>
            <div className="auth_body_item">
              <label htmlFor="">
                <HiMail />
              </label>
              <input
                ref={emailRef}
                placeholder="name@exmaple.com"
                defaultValue={currentUser.email}
                autoComplete="none"
                type="text"
              />
            </div>
            <div className="auth_body_item">
              <label htmlFor="">
                <BsFillBookFill />
              </label>
              <input
                placeholder="your introduction"
                ref={dcsRef}
                defaultValue={user.dcs}
                autoComplete="none"
                type="text"
              />
            </div>
            <div className="auth_body_item">
              <label htmlFor="">
                <BiSolidLockAlt />
              </label>
              <input
                ref={passwordRef}
                placeholder="Password (at least 6 characters)"
                autoComplete="none"
                type="password"
              />
            </div>
            <div className="auth_body_item">
              <label htmlFor="">
                <BiSolidLockAlt />
              </label>
              <input
                ref={rePasswordRef}
                placeholder="Re Password"
                autoComplete="none"
                type="password"
              />
            </div>

            <div className="auth_body_item_btn">
              <Link to={"/auth/profile"}>
                <button className="btn btn-red">Cancel</button>
              </Link>
              <button className="btn btn-blue" onClick={handleUpdate}>
                {
                  loading ? 'loading...': 'Save'
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
