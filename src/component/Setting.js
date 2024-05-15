import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import "../css/setting.css";
import "../css/main.css";
import Nav from "./Nav";
import Author from "./Author";

function Setting() {
  const [accountDataDriver, setAccountDataDriver] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const navigate = useNavigate();
  const id_user = localStorage.getItem("id_user");
  const id_driver = localStorage.getItem("id_driver");

  useEffect(() => {
    getUserData();
    if (id_driver !== null) {
      getDriverData();
    }
  }, []);

  const getDriverData = () => {
    Axios.get(`http://localhost:3333/driverData/${id_driver}`).then(
      (response) => {
        const driverData = response.data[0];
        setAccountDataDriver(driverData);
        setCarNumber(driverData.carNumber);
        setIdentificationNumber(driverData.identificationNumber);
      }
    );
  };

  const getUserData = () => {
    Axios.get(`http://localhost:3333/userData/${id_user}`).then((response) => {
      const userData = response.data[0];
      setAccountData(userData);
      setName(userData.fname);
      setPhoneNumber(userData.phoneNumber);
      setEmail(userData.username);
      setPassword(userData.password);
    });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser();
    navigate("/myaccount");
  };

  const updateUser = () => {
    Axios.put("http://localhost:3333/updateUser", {
      password: password,
      id_user: id_user,
      fname: name,
      phoneNumber: phoneNumber,
    })
      .then((response) => {
        console.log("updated user successfully:", response.data);
        navigate("/myaccount");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
    <Author/>
    <Nav />
    <div className="main-container">
    <div className="schedule-user-filter">
        <h5 style={{margin:"0"}}>แก้ไขข้อมูลบัญชี</h5>
      </div>
      <Card>
       
        <Card.Body className="setting-card-body">
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="setting-label">
              <h5 className="setting-label-name">username</h5>
              <span>{email}</span> {/* แสดงข้อมูลอีเมลเป็นข้อมูลอย่างเดียว */}
            </div>
            <div className="setting-label">
              <h5 className="setting-label-name">ชื่อผู้ใช้งาน</h5>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="setting-label">
              <h5 className="setting-label-name">เบอร์โทร</h5>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <div className="setting-label">
              <h5 className="setting-label-name">รหัสผ่าน</h5>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>{" "}
            {id_driver !== null && (
              <>
                <div className="setting-label">
                  <h5 className="setting-label-name">ทะเบียนรถ</h5>
                  <span>{carNumber}</span>{" "}
                  {/* แสดงข้อมูลอีเมลเป็นข้อมูลอย่างเดียว */}
                </div>
                <div className="setting-label">
                  <h5 className="setting-label-name">เลขใบอนุญาติ</h5>
                  <span>{identificationNumber}</span>{" "}
                  {/* แสดงข้อมูลอีเมลเป็นข้อมูลอย่างเดียว */}
                </div>
              </>
            )}
            <div className="setting-button-group">   
            <Button variant="danger" onClick={() => navigate("/myaccount")}>
              ยกเลิก
            </Button>
            <Button variant="success" type="submit" style={{marginInline:"2%"}}>
              ยืนยันการแก้ไข
            </Button>
            </div>
         
          </form>
        </Card.Body>
      </Card>
    </div>
    </>
  );
}

export default Setting;
