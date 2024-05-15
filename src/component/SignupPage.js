import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import  Axios  from "axios";
import "../css/signup.css";
import { Link, useNavigate } from "react-router-dom";
import infoPic from "../img/cover02.png";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setName] = useState("");
  const [usernameList , setUsernameList] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    checkDuplicate();
  }, []);

  const checkDuplicate  = ()=>{
    Axios.get(`http://localhost:3333/checkDuplicate/`)
    .then((response) => {
      setUsernameList(response.data);
    })
    .catch((error) => {
      console.error("Error fetching booking details:", error);
    });
  }

  const handleSignup = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const signupData = {
      username: data.get("username"),
      password: data.get("password"),
      phoneNumber: data.get("phoneNumber"),
      fname: data.get("fname"),
    };

    if(usernameList.some(item => item.username === username)){
      alert("username นี้ถูกใช้ไปแล้ว กรุณาใช้ username อื่น");
      return; 
    }

    if (!username || !password || !phoneNumber || !fname) {
      alert("โปรดกรอกข้อมูลให้ครบทุกช่อง");
      return; // ออกจากฟังก์ชันเพื่อไม่ต้องทำการส่งข้อมูล
    }

    const phoneCheck = /^[0][0-9]{9}$/;
    if (!phoneCheck.test(phoneNumber)) {
      alert(
        "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เริ่มต้นด้วยเลข 0 และไม่เกิน 10 ตัว)"
      );
      return;
    }

    fetch("http://localhost:3333/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "INSERT SUCCESS") {
          alert("Register successful");
          navigate("/");
        } else {
          alert("err");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error response here
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h3 style={{display:"flex" , justifyContent:"center" ,marginBottom :"10%" , fontWeight:"bold"}}>สมัครสมาชิก</h3>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            {/* <label htmlFor="username">Username</label> */}
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username (ชื่อที่ใช้เข้าสู่ระบบ)"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label> */}
            <input
              type="text"
              id="phoneNumber"
              placeholder="เบอร์โทรศัพท์"
              name="phoneNumber"
              className="form-control"
              onChange={(e) => setphoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="name">ชื่อจริง</label> */}
            <input
              type="name"
              id="fname"
              placeholder="ชื่อจริง-นามสกุล"
              name="fname"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="password">รหัสผ่าน</label> */}
            <input
              type="password"
              id="password"
              placeholder="รหัสผ่าน"
              name="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="signup-button-group">
            {" "}
            <Button variant="danger" onClick={() => navigate("/")}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="success">
              ยืนยัน
            </Button>
          </div>
        </form>
      </div>{" "}
      <div className="signup-img">
        <div className="signup-img-info">
        <div>
            <img
            src={infoPic}
            alt="kps"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
