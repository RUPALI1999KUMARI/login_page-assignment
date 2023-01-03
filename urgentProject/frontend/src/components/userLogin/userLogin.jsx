import React, { useEffect, useState } from "react";
import HomePage from "../HomePage/HomePage";
import axios from "axios";
import "./userLogin.css";

const UserLogin = () => {
  const [auth, setAuth] = useState(false);
  const [values, setValues] = useState({email: "",password: "",});

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const doLogin = async () => {
    try {
      let login = await axios.post(`http://localhost:3001/user/login`, values);
      if (login.status == 200) {
        setAuth(true);
        localStorage.setItem("usertoken",JSON.stringify(login.data.data.token))
      } 
    } catch (err) {
      window.alert(err.response.data.message)
      console.log(err);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    doLogin();
  };

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("usertoken"));
    if(token){
      setAuth(true);
    }
  }, []);

  if (auth) {
    return <HomePage setAuth={setAuth} />;
  }
  return (
    <>
      <form className="login-from-wrapper">
        <h2 className="title"> Login </h2>
        <div className="inputbox">
          <label className="label">E-mail</label>
          <input
            className="input"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <div className="inputbox">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button className="submit" onClick={handleFormSubmit}>
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default UserLogin;