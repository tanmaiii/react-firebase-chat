import React, { useEffect, useRef, useState } from "react";
import img from "../../assets/sdsad.jpg";
import { Link, useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { BiSolidLockAlt } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { signup, currentUser, login } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true)
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
      setLoading(false)
    } catch (error) {
      setError("Can't login, wrong password or email");
    }
    setLoading(false)
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
            <h3>Welcome back !</h3>
            <span>Start managing finance finance and better</span>
            <span></span>
          </div>
          {error && (
            <div className="auth_body_item_error">
              <span>{error}</span>
            </div>
          )}
          <div className="auth_body_item">
            <label htmlFor="">
              <HiMail />
            </label>
            <input
              ref={emailRef}
              autoComplete="none"
              type="text"
              placeholder="name@exmaple.com"
            />
          </div>
          <div className="auth_body_item">
            <label htmlFor="">
              <BiSolidLockAlt />
            </label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="At least 6 characters"
            />
          </div>
          <div className="auth_body_item_password">
            <Link to={"/auth/forgot-password"}>Forgot password ?</Link>
          </div>
          <div className="auth_body_item_btn">
            <button disabled={loading} className="btn btn-blue" onClick={handleLogin}>
              {loading ? 'loading...' : 'Login'}
            </button>
          </div>
          <div className="auth_body_item_signup">
            <span>Do you have an account ?</span>{" "}
            <Link to={"/auth/signup"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
