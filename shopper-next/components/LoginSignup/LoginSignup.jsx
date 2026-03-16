'use client'
import React, { useState } from "react";
import "./LoginSignup.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const login = async () => {
  let responseData;
  await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => (responseData = data));

  if (responseData.success) {
    localStorage.setItem("auth-token", responseData.token);
    window.location.replace("/");
  } else {
    const message = responseData.error 
      || responseData.errors?.[0]?.msg 
      || "Something went wrong";
    alert(message);
  }
};

const signup = async () => {
  if (!agreedToTerms) {
    alert("Please agree to the Terms of Use & Privacy Policy.");
    return;
  }
  let responseData;
  await fetch("http://localhost:4000/signup", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => (responseData = data));

  if (responseData.success) {
    localStorage.setItem("auth-token", responseData.token);
    window.location.replace("/");
  } else {
    const message = responseData.error 
      || responseData.errors?.[0]?.msg 
      || "Something went wrong";
    alert(message);
  }
};
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">

        <h1>{state === "Login" ? "Sign in" : "Create account"}</h1>
        <p className="ls-subtitle">
          {state === "Login" ? "Welcome back to Shopper" : "Join Shopper today"}
        </p>

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Full name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email address"
          />
          <div className="password-input-wrapper">
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword
                ? <AiOutlineEyeInvisible size={20} color="#999" />
                : <AiOutlineEye size={20} color="#999" />}
            </span>
          </div>
        </div>

        <button onClick={() => { state === "Login" ? login() : signup(); }}>
          {state === "Login" ? "Sign in" : "Create account"}
        </button>

        <p className="ls-switch">
          {state === "Login" ? (
            <>Don't have an account?{" "}<span onClick={() => setState("Sign Up")}>Sign up</span></>
          ) : (
            <>Already have an account?{" "}<span onClick={() => setState("Login")}>Sign in</span></>
          )}
        </p>

        {state === "Sign Up" && (
          <label className="ls-agree">
            <div className="ls-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span className="ls-checkmark"></span>
            </div>
            <p>
              I agree to the <a href="#terms">Terms of Use</a> &amp; <a href="#privacy">Privacy Policy</a>
            </p>
          </label>
        )}

      </div>
    </div>
  );
};

export default LoginSignup;