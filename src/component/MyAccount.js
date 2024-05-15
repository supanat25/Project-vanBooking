import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Axios from "axios";
import "../css/setting.css";
import "../css/main.css";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import MarkMap from "./MarkMap";
import Modal from "react-bootstrap/Modal";
import Map from "./Map";
import { faL } from "@fortawesome/free-solid-svg-icons";
import Waiting from "./Waiting";
import Author from "./Author";

function MyAccount() {
  const [showMapPage, setShowMapPage] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [accountDataDriver, setAccountDataDriver] = useState([]);
  const id_user = localStorage.getItem("id_user");
  const id_driver = localStorage.getItem("id_driver");
  const checkMapShow = localStorage.getItem("lat_user")
  // localStorage.setItem("lat", localStorage.getItem("lat_user"));
  // localStorage.setItem("lng", localStorage.getItem("lng_user"));
  // const latitudeLongitude = localStorage.getItem("lastClickedLocation");
  // const mapData = JSON.parse(latitudeLongitude);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("lat", localStorage.getItem("lat_user"));
    localStorage.setItem("lng", localStorage.getItem("lng_user"));
    getUserData();
    getDriverData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMapPage(true);
    }, 50); //

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (accountData && accountData.length > 0) {
  //     // console.log(accountData[0].lat_user);
  //     // console.log(accountData[0].id_user);
  //     localStorage.setItem("lat_user", accountData[0].lat_user);
  //     localStorage.setItem("lng_user", accountData[0].lng_user);
  //   }
  // }, [accountData]);

  const createMyMarkMap = () => {
    console.log("OK");
    setShowMapPage(!showMapPage);
    setShowMap(!showMap);
  };

  const getUserData = () => {
    Axios.get(`http://localhost:3333/userData/${id_user}`).then((response) => {
      setAccountData(response.data);

      // localStorage.setItem("lat", localStorage.getItem("lat_user"));
      // localStorage.setItem("lng", localStorage.getItem("lng_user"));
    });
  };

  const getDriverData = () => {
    Axios.get(`http://localhost:3333/driverData/${id_driver}`).then(
      (response) => {
        setAccountDataDriver(response.data);
      }
    );
  };

  const setDefaultMarker = () => {
    setShowMapPage(!showMapPage);
    const latitudeLongitude = localStorage.getItem("lastClickedLocation");
    const mapData = JSON.parse(latitudeLongitude);
    Axios.put("http://localhost:3333/setDefaultMarker", {
      id_user: id_user,
      lat_user: mapData.latitude,
      lng_user: mapData.longitude,
    })
      .then((response) => {
        setShowMap(!showMap);
        localStorage.setItem("lat", mapData.latitude);
        localStorage.setItem("lng", mapData.longitude);
        localStorage.setItem("lat_user", mapData.latitude);
        localStorage.setItem("lng_user", mapData.longitude);
        getUserData();
        console.log("updated user marker successfully:", response.data);
        setShowMapPage(false);
        const timer = setTimeout(() => {
          setShowMapPage(true);
        }, 100); //
        return () => clearTimeout(timer);
      })
      .catch((error) => {
        console.error("Error updating user marker:", error);
      });
  };

  const handleEditClick = () => {
    navigate("/myaccount/setting");
  };

  return (
    <div>
      <Author/>
      <Nav />
      <div className="main-container">
        <div className="schedule-user-filter">
          <h5 style={{ margin: "0" }}>ข้อมูลบัญชีของฉัน</h5>
        </div>
        <Card>
          <Card.Body className="setting-card-body">
            {/* Map ข้อมูลจาก accountData */}
            {accountData.map((val, key) => (
              <div key={key} className="setting-card">
                <div className="setting-label">
                  <h5 className="setting-label-name">username</h5>
                  <h5>{val.username}</h5>
                </div>
                <div className="setting-label">
                  <h5 className="setting-label-name">ชื่อผู้ใช้งาน</h5>
                  <h5>{val.fname}</h5>
                </div>
                <div className="setting-label">
                  <h5 className="setting-label-name">เบอร์โทร</h5>
                  <h5>{val.phoneNumber}</h5>
                </div>
                {/* <div className="setting-label">
                <h5 className="setting-label-name">รหัสผ่าน</h5>
                <h5>{val.password}</h5>
              </div> */}
              </div>
            ))}
            {/* Map ข้อมูลจาก accountDataDriver */}
            {accountDataDriver.map((val, key) => (
              <div key={key}>
                <div className="setting-label">
                  <h5 className="setting-label-name">ทะเบียนรถ</h5>
                  <h5>{val.carNumber}</h5>
                </div>
                <div className="setting-label">
                  <h5 className="setting-label-name">เลขใบอนุญาติ</h5>
                  <h5>{val.identificationNumber}</h5>
                </div>
              </div>
            ))}

            <div className="setting-button-group">
              <Button variant="primary" onClick={handleEditClick}>
                แก้ไข
              </Button>{" "}
            </div>
            <></>
            
            <div className="set-map-default">
              <div>
                {id_driver ? (
                  ""
                ) : checkMapShow === "13.8495909000" ? (
                  <>
                    {" "}
                    <div className="globle-line"></div>
                    <Button variant="primary" onClick={createMyMarkMap}>
                      แก้ไขหมุดเริ่มต้น
                    </Button> 
                   <div style={{display:"flex",justifyContent:"center",color:"red",marginTop:"10px"}}>คุณยังไม่ได้ตั้งค่าจุดเริ่มต้นครั้งแรก</div>
                  </>
                  
                ) :  (
                  <div className="set-map-default">
                    {" "}
                    <div className="globle-line"></div>
                    <h5 style={{marginLeft:"1%"}}>ปักหมุดของฉัน</h5>
                    <div className="map">
                      {showMapPage && <Map />}
                    </div>
                    <Button variant="primary" onClick={createMyMarkMap} style={{marginBottom :"2%"}}>
                      แก้ไขหมุดเริ่มต้น
                    </Button> 
                    
                  
                   
                  </div>
                )}
              </div>

             
            </div>
          </Card.Body>
        </Card>
      </div>
      <Modal
        show={showMap}
        onHide={createMyMarkMap}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ค่าเริ่มต้นการปักหมุดของฉัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            ตั้งค่าหมุดเริ่มต้นที่เราใช้เป็นประจำเพื่อไม่ต้องปักหมุดใหม่ทุุกครั้งที่จองรอบ
          </h6>
          <MarkMap />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={setDefaultMarker}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyAccount;
