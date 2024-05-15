import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import "../css/logIn.css";
import { Button } from "react-bootstrap";
import infoPic from "../img/cover02.png";
import Waiting from "./Waiting";



const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); // เพิ่ม state เพื่อแสดงข้อผิดพลาด
  const [showWaiting, setShowWaiting] = useState(false); // เพิ่ม state เพื่อแสดง Waiting component
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      username: data.get("username"),
      password: data.get("password"),
      role: data.get("role"),
    };

    // แสดง Waiting component ก่อนทำการ fetch
    setShowWaiting(true);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
    // กำหนดเวลาในการโหลด 1.5 วินาที
    setTimeout(() => {
      fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            console.log("Success:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", data.username);
            localStorage.setItem("role", data.role);
            localStorage.setItem("fname", data.fname);

            

            if (data.role === "admin") {
              navigate("/drivermanage");
              
            }
            if (data.role === "user") {
              localStorage.setItem("id_user", data.id_user);
              localStorage.setItem("lat_user", data.lat_user);
              localStorage.setItem("lng_user", data.lng_user);
              navigate("/home");
              // alert("Login as user success");
            }
            if (data.role === "driver") {
              localStorage.setItem("id_driver", data.id_driver);
              localStorage.setItem("id_user", data.id_user);
              navigate("/myround");
              
            }
          } else {
            // เซ็ต state เพื่อแสดง Alert
            setShowError(true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error response here
        })
        .finally(() => {
          // ซ่อน Waiting component เมื่อโหลดเสร็จสิ้น
          setShowWaiting(false);
        });
    }, 800);
  };

  return (
    <>
      {showWaiting && <Waiting />}{" "}
      {/* แสดง Waiting component ถ้า showWaiting เป็น true */}
      <div className="login-container">
        <div className="login-form">
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10%",
              fontWeight: "bold",
            }}
          >
            เข้าสู่ระบบ
          </h3>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              {/* <label htmlFor="username">ชื่อผู้ใช้งาน</label> */}
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              {/* <label htmlFor="password">รหัสผ่าน</label> */}
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="login-button-group">
              <Button type="submit" variant="success">
                เข้าสู่ระบบ
              </Button>
           
       
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 2fr",
                  alignItems: "center",
                  marginBlock: "4%",
                }}
              >
                <div className="globle-line-login"></div>
                <h8
                  style={{
                    display: " flex",
                    justifyContent: " center",
                    color: "gray",
                  }}
                >
                  or
                </h8>
                <div className="globle-line-login"></div>
              </div>
              <Button variant="secondary" onClick={() => navigate("/signup")}>
                สมัครสมาชิก
              </Button>
            </div>
          </form>
        </div>
        <div className="login-img">
          <div className="login-img-info">
            <div>
              <img src={infoPic} alt="kps" />
            </div>
          </div>
        </div>
        <Alert show={showError} variant="danger" className="alert-top">
          Username หรือ Password ไม่ถูกต้อง
        </Alert>
      </div>
    </>
  );
};

export default LogInPage;
