import React, { useEffect, useState, useRef } from "react";
import avt from "../../assets/avatar.jpg";
import { Link , useNavigate } from "react-router-dom";

import { HiMail } from "react-icons/hi";
import { BiSolidLockAlt } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { AiFillCamera } from "react-icons/ai";

import { useAuth} from "../../contexts/AuthContext";
import {db, storage, auth } from '../../utils/firebase'
import {updateProfile} from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { setDoc, doc , onSnapshot} from "firebase/firestore";


export default function Signup() {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();
  const { signup, currentUser } = useAuth();

  const handleSubmit = async () => {
    if (nameRef.current.value === "") return setError("Name is not null");

    if (emailRef.current.value === "") return setError("Email is not null");

    if(passwordRef.current.value.length < 6) {
      return setError("Password must be at least 6 character");
    } 

    if (passwordRef.current.value !== rePasswordRef.current.value){
      return setError("Password is not match");
    }

    if(fileRef.current.files[0] === undefined){
        return setError("Avatar is not null");
    } 
      
    const file = fileRef.current.files[0]
    const displayName = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    setLoading(true);
    try{
      const res = await signup(email, password)

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`)

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await  updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              phone: null,
              dcs:'',
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
            setLoading(false);
          } catch (err) {
            console.log(err);
            setError(true);
            setLoading(false);
          }
        });
      });
    }catch(err) {
        setError('Error Signup')
        setLoading(false);
    }
    setLoading(false)
  };

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/auth/profile");
    }
  }, [currentUser]);

  return (
    <div className="">
      <div className="auth_login-signup auth">
        <div className="auth_body">
          <div className="auth_body_header">
            <h3>Welcome !</h3>
            <span>Start managing finance finance and better</span>
            <span></span>
          </div>
          <div className="auth_body_item_avatar">
            <div className="auth_body_item_avatar_img">
              {avatar ? (
                <img  src={avatar.preview} alt="" />
              ) : (
                <img src={avt} alt="" />
              )}
              <label htmlFor="inputAvatar">
                <AiFillCamera />
              </label>
              <input
                ref={fileRef}
                onChange={handleAvatar}
                id="inputAvatar"
                style={{ display: "none" }}
                type="file"
              />
            </div>
          </div>
          {error && (
            <div className="auth_body_item_error">
              <span>{error}</span>
            </div>
          )}
          <div className="auth_body_item">
            <label htmlFor="nameSignup">
              <BiSolidUser />
            </label>
            <input
              ref={nameRef}
              id="nameSignup"
              autoComplete="none"
              type="text"
              placeholder="username"
            />
          </div>
          <div className="auth_body_item">
            <label htmlFor="emailSignup">
              <HiMail />
            </label>
            <input
              ref={emailRef}
              id="emailSignup"
              autoComplete="none"
              type="email"
              placeholder="name@exmaple.com"
            />
          </div>
          <div className="auth_body_item">
            <label htmlFor="passwordSignup">
              <BiSolidLockAlt />
            </label>
            <input
              ref={passwordRef}
              id="passwordSignup"
              autoComplete="none"
              type="password"
              placeholder="Password (at least 6 characters)"
            />
          </div>
          <div className="auth_body_item">
            <label htmlFor="rePasswordSignup">
              <BiSolidLockAlt />
            </label>
            <input
              ref={rePasswordRef}
              id="rePasswordSignup"
              autoComplete="none"
              type="password"
              placeholder="Re Password"
            />
          </div>
          <div className="auth_body_item_terms">
            <input autoComplete="none" type="checkbox" />{" "}
            <span>Agree to the terms</span>
          </div>
          <div onClick={handleSubmit} className="auth_body_item_btn">
            <button disabled={loading} className="btn btn-blue">
              {
                loading ? 'Loading...' : 'SignUp'
              }
            </button>
          </div>
          <div className="auth_body_item_signup">
            <span>Do you an account ?</span>{" "}
            <Link to={"/auth/login"}>Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
