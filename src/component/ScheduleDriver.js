import React, { useState, useEffect } from "react";
import "../css/main.css";
import Axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Nav from "./Nav";
import Author from "./Author";

function ScheduleDriver() {
  const [currentTime, setCurrentTime] = useState(""); //เก็บเวลาปัจจุบัน
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("กำแพงแสน");
  const [check, setCheck] = useState([]); // เริ่มต้น check_driver เป็น 0
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [checkDriverStatus, setCheckDriverStatus] = useState(0);
  const [show, setShow] = useState(false);
  const [checkRegis , setCheckRegis] = useState ([]);
  const [checkKps , setCheckKps] = useState ([]);
  const [checkKu , setCheckKu] = useState ();
  const [checkDriver, setCheckDriver] = useState(0); 
  const id_driver = localStorage.getItem("id_driver");


  const handleClose = () => setShow(false);

  useEffect(() => {

    
    handdleCheck();
    handleItemClick("กำแพงแสน");
    getCurrentTime();
  }, []);

  //เช็คว่าลงรอบรึยัง
  useEffect(() => {
    if (check.length > 0) {
      setCheckDriverStatus(check[0].check_driver);
    }
  }, [check]);

  
    //เช็คว่าลงรอบไหนไปบ้าง
    useEffect(() => {
      let checkDriverState = 0;
     
      checkRegis.forEach(item => { 

        if (item.id_schedule === 1) {
          if (checkDriverState === 2) {
            checkDriverState = 3; //regis both
          } else {
              checkDriverState = 1;// regis kps only
          }
        } else if (item.id_schedule === 2) {

          if (checkDriverState === 1) {
            checkDriverState = 3; //regis both
          } else {
            checkDriverState = 2;// regis ku only 
          }

        }
      });
    
      if (checkDriverState === 0) {
        checkDriverState = 4;//not regis
      }
    
      console.log(checkDriverState);
      setCheckDriver(checkDriverState);
    }, [checkRegis]);
    

  const handleShow = (schedule) => {
    setSelectedSchedule(schedule);
    if (schedule.status === 2) {
      // setDisableButton(true); 
    } else {
      setShow(true);
      // setDisableButton(false); 
    }
  };


  const getCurrentTime = () => {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // เปลี่ยนเป็น false เพื่อแสดงเวลาในรูปแบบ 24 ชั่วโมง
    };
    const currentTimeString = now.toLocaleTimeString([], options);
    setCurrentTime(currentTimeString);
  };


  const handdleCheck = () => {
    Axios.get(`http://localhost:3333/check/${id_driver}`).then((response) => {
      setCheck(response.data);

      // เมื่อมีการตรวจสอบ check_driver สำเร็จ ให้ตรวจสอบค่าเพื่อกำหนดค่า disableButton
      // setDisableButton(response.data.check_driver !== 1);
    });

    Axios.get(`http://localhost:3333/checkRegisterRound/${id_driver}`).then((response) => {
      setCheckRegis(response.data);
      console.log("6666")
     
    });
  };

  const handleConfirm = (selectedSchedule) => {
    Axios.put("http://localhost:3333/updateRegisConfirm", {
      status: "2", // กำหนดค่า status ที่ต้องการอัปเดต
      id_driver: id_driver, // กำหนดค่า id_driver ที่ต้องการอัปเดต
      id_scheduleDetail: selectedSchedule.id_scheduleDetail, // ใช้ค่า id_scheduleDetail ของ selectedSchedule
    })
      .then((response) => {
        console.log("Schedule detail updated successfully:", response.data);
        handleClose();
        
        handdleCheck();
        handleItemClick("กำแพงแสน");
      })
      .catch((error) => {
        console.error("Error updating schedule detail:", error);
      });
  };

  const handleItemClick = (destination) => {
    setSelectedItem(destination);
    const destinationValue = destination === "บางเขน" ? 2 : 1;

    Axios.get(`http://localhost:3333/schedule/${destinationValue}`)
      .then((response) => {
        setScheduleList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  };

  const logicRegister = (id_schedule) => {
    
    if (id_schedule === 1) {

      switch (checkDriver) {
        case 1: return true;
        case 2: return false;
        case 3: return true;
        case 4: return false;
      }
    } else if (id_schedule === 2) {

      switch (checkDriver) {
        case 1: return false;
        case 2: return true;
        case 3: return true;
        case 4: return false;
      }
    }
  }
  

  return (
    <>
    <Author/>
    <Nav />
    <div className="main-container">
      
     

      {/* {check &&
        check.map((val, key) => {
          return (
            <div key={key}>
              <div>ไอดี{val.id_driver}</div>
              <div>สถานะลง = {val.check_driver} (ยัง 1 / ลงแล้ว 2)</div>
            </div>
          );
        })} */}

      <div className="schedule-user-filter">
      <h5 style={{margin:"0"}}>เลือกจุดเริ่มต้นการเดินทาง</h5>
        <div className="fiter-dropdown">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-success"
              id="dropdown-basic"
              size="sm"
             
            >
              {selectedItem}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleItemClick("บางเขน")}>
                บางเขน
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("กำแพงแสน")}>
                กำแพงแสน
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        
      </div>

      {scheduleList
        .slice() // สำเนาข้อมูลเพื่อป้องกันการเปลี่ยนแปลงข้อมูลต้นฉบับ
        .sort((a, b) => a.time.localeCompare(b.time)) // เรียงลำดับข้อมูลตามเวลา (time)
        .map((val, key) => {
          // const isPastTime = val.time < currentTime;
          
          return (
            // !isPastTime && (
            <div className="schedule-user card" key={key}>
              <div className="card-body-driver">
                <div className="card-body-top">
                  
                  <h4>{val.time ? val.time.slice(0, 5) : ""}</h4>
                  <h4
                    className={
                      val.status_driver === "ว่าง" ? "green-text" : "red-text"
                    }
                  >
                    {val.status_driver}

                  </h4>
                  
                    
                </div>
                <div className="card-body-mid">
                  <h7>จุดหมายเริ่มต้น : {val.name}</h7>
                  
                </div>
                <div className="card-body-but">
                  
                  <Button
                    variant="outline-success"
                    onClick={() => handleShow(val)}
                    // disabled={!(val.status === 1 && checkDriverStatus === 1) && logicRegister(val.id_schedule) } 
                    disabled={ (val.status === 2 || logicRegister(val.id_schedule))}
                  >
                    ลงรอบ
                  </Button>
                </div>
              </div>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>คุณต้องการลงรอบขับรถ ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedSchedule && (
                    <div>
                      <p>จุดหมายปลายทาง: {selectedSchedule.name}</p>
                      <p>
                        เวลา:{" "}
                        {selectedSchedule.time
                          ? selectedSchedule.time.slice(0, 5)
                          : ""}
                      </p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    ยกเลิก
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleConfirm(selectedSchedule)}
                    // disabled={disableButton} // ปิดใช้งานปุ่ม confirm หากมี check_driver เป็น 1
                  >
                    ยืนยัน
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            // )
          );
        })}
    </div>
    </>
  );
}

export default ScheduleDriver;
