import React, { useEffect, useState } from "react";
import "./HomePage.css";
import axios from "axios";

const HomePage = (setAuth) => {
  const [studentData, setStudentData] = useState({
    firstName: "N/A",
    lastName: "N/A",
    email: "N/A",
  });

  const getStudentData = async () => {
    try {
      let token = localStorage.getItem("usertoken");
      const res = await axios.get("http://localhost:3001/user", {
        headers: {
          'Authorization': JSON.parse(token)
        }
      });
      setStudentData(res.data.details);
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = async () => {
    try {
      localStorage.removeItem("usertoken");
      setAuth.setAuth(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="listbar">
          <h2> Profile</h2>
          <button className="viewButton" onClick={logOut}>
            Logout
          </button>
        </div>
        <h1>First Name : {studentData.firstName}</h1>
        <h1>Last Name : {studentData.lastName}</h1>
        <h1>Email : {studentData.email}</h1>
      </div>
    </>
  );
};

export default HomePage;
