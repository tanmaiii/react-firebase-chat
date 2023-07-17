import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { BiSolidLockAlt } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [message, setMessage] = useState();

  const { signup, currentUser, resetPassword } = useAuth();
  const emailRef = useRef();
  const navigate = useNavigate();
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      setError("Failed to Reset Password");
    }
    setIsLoading(false);
  };


  useEffect(() => {
    if (currentUser) {
      navigate("/auth/profile");
    }
  }, [currentUser]);
  return (
    <div className="">
      <div className="auth_forgotPassword auth_login-signup auth">
        <div className="auth_body">
          <div className="auth_body_header">
            <h3>Forgot Password</h3>
            <span></span>
          </div>
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
              <HiMail/>
            </label>
            <input ref={emailRef} autoComplete="none" type="email" placeholder="name@exmaple.com"/>
          </div>
          <div className="auth_body_item_btn">
              <button className="btn btn-blue" onClick={handleResetPassword}>Send</button>
          </div>
          <div className="auth_body_item_signup">
            <Link to={'/auth/login'}>Back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
