import React, { useEffect, useState } from "react";
import Axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../css/main.css";
import Nav from "./Nav";
import { Button, Modal, Form } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Map from "./Map";
import Author from "./Author";


function MyRound() {
  const [currentTime, setCurrentTime] = useState(""); //เก็บเวลาปัจจุบัน
  const [myRoundList, setMyRoundList] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNumberOfPeople, setNewNumberOfPeople] = useState(0);
  const [idDriver] = useState(localStorage.getItem("id_driver"));
  const [showSuccessTripModal, setShowSuccessTripModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // เพิ่ม state สำหรับแสดง Modal ข้อความเรียบร้อย
  const [customerList, setCustomerList] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getMyRound();
    getCustomer();
    getCurrentTime();
  }, []);

  const handleCheckMark = (lat, lng) => {
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);
    setShowMap(!showMap);
  };

  // const toggleMapDisplay = () => {};

  const handleCancel = (schedule) => {
    setSelectedSchedule(schedule);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setSelectedSchedule(null);
    setShowCancelModal(false);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
    setNewNumberOfPeople(schedule.all_seat);
  };

  const handleCloseEditModal = () => {
    setSelectedSchedule(null);
    setShowEditModal(false);
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

  const handleTravel = (schedule) => {
    getCurrentTime();
    console.log("1Time "+currentTime)
    Axios.put("http://localhost:3333/updateTravel", {
      id_driver: idDriver,
      id_scheduleDetail: schedule.id_scheduleDetail,
      status_user: 3,
      travel_time:currentTime,
    })
      .then((response) => {
        console.log(
          "User status updated successfully for travel start:",
          response.data
        );
        console.log("2 "+currentTime)
        handleCloseEditModal();
        getMyRound();
        setShowSuccessModal(true); // เมื่อสำเร็จให้แสดง Modal ข้อความเรียบร้อย
      })
      .catch((error) => {
        console.error("Error updating user status for travel start:", error);
      });
  };

  const deleteBooking = (id_scheduleDetail) => {
    Axios.delete(`http://localhost:3333/deleteBooking/${id_scheduleDetail}`)
      .then((response) => {
        console.log("Delete success");
      })
      .catch((error) => {
        console.error("Error updating user status for travel start:", error);
      });
  };

  // const createRecord = (schedule) => {
  //   Axios.post("http://localhost:3333/addRecord", {
  //     id_driver: idDriver,
  //     id_scheduleDetail: schedule.id_scheduleDetail,
  //   });
  // };

  const handleTripSaccess = (schedule) => {
    Axios.put("http://localhost:3333/updateTripSuccess", {
      id_driver: idDriver,
      id_scheduleDetail: schedule.id_scheduleDetail,
      status_user: 2,
    })
      .then((response) => {
        console.log(
          "User status updated successfully for trip success :",
          response.data
        );
        deleteBooking(schedule.id_scheduleDetail);
        // createRecord(schedule);
        handleCloseEditModal();
        setShowSuccessTripModal(true); // เมื่อสำเร็จให้แสดง Modal ข้อความเรียบร้อย
        getCustomer();
        getMyRound();
        getCustomer();
        getMyRound();
      })
      .catch((error) => {
        console.error("Error updating user status for travel start:", error);
      });
  };

  const handleEditSubmit = () => {
    if (
      newNumberOfPeople > 0 &&
      newNumberOfPeople <= 14 &&
      newNumberOfPeople >= selectedSchedule.current_seat
    ) {
      Axios.put("http://localhost:3333/updateAllSeat", {
        id_scheduleDetail: selectedSchedule.id_scheduleDetail,
        all_seat: newNumberOfPeople,
      })
        .then((response) => {
          console.log("Number of people updated successfully:", response.data);
          handleCloseEditModal();
          getMyRound();
        })
        .catch((error) => {
          console.error("Error updating number of people:", error);
        });
    } else {
      alert("โปรดเลือกจำนวนคนให้ไม่น้อยกว่าจำนวนปัจจุบัน หรือ ไม่เกิน 14 ที่");
    }
  };

  const handleCancelRound = () => {
    Axios.put("http://localhost:3333/updateCancelRound", {
      status: "1",
      id_driver: idDriver,
      id_scheduleDetail: selectedSchedule.id_scheduleDetail,
    })
      .then((response) => {
        console.log("Schedule detail canceled successfully:", response.data);
        handleCloseCancelModal();
        getMyRound();
        getCustomer();
      })
      .catch((error) => {
        console.error("Error canceling schedule detail:", error);
      });
  };

  const getMyRound = () => {
    Axios.get(`http://localhost:3333/MyRound/${idDriver}`, {})
      .then((response) => {
        setMyRoundList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  };

  const getCustomer = () => {
    Axios.get(`http://localhost:3333/customer/${idDriver}`, {})
      .then((response) => {
        setCustomerList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
      });
  };

  return (
    <div>
      <Author/>
      <Nav />
      <div className="main-container">
        
        <Tabs
          defaultActiveKey="kps"
          id="justify-tab-example"
          className="mb-3"
          justify
        >
<Tab eventKey="kps" title="กำแพงแสน">
    {myRoundList.length === 0 || !myRoundList.some(val => val.id_schedule === 1) ? (
      <h5 style={{ alignSelf: "center" }}>คุณยังไม่ได้ลงทะเบียนรอบขับ</h5>
    ) : (
      <>
        {myRoundList
          .filter((val) => val.id_schedule === 1)
          .map((val, key) => (
            <div className="schedule-user card" key={key}>
              <div className="card-body-user-myround">
                <div className="card-body-top-myround">
                  <div className="globle-trip">
                    <h5>
                      {val.id_schedule === 1
                        ? "กำแพงแสน"
                        : val.id_schedule === 2
                        ? "บางเขน"
                        : ""}
                    </h5>
                    <div className="globle-arrow">
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
                    <h5>
                      {val.id_schedule === 2
                        ? "กำแพงแสน"
                        : val.id_schedule === 1
                        ? "บางเขน"
                        : ""}
                    </h5>
                  </div>
                  <h4 className="time-font">{val.time.slice(0, 5)}</h4>
                </div>
                <div className="globle-line"></div>
                <div className="card-body-mid-myround">
                  <h5>
                    จำนวนผู้โดยสาร : {val.current_seat}/{val.all_seat}
                  </h5>
                  <Button variant="warning" onClick={() => handleEdit(val)}>
                    แก้ไข
                  </Button>
                </div>
                <div className="card-body-but-myround">
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(val)}
                      disabled={
                        !(val.status_user === 1 && val.current_seat === 0)
                      }
                    >
                      ถอน
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleTravel(val)}
                      disabled={val.status_user === 3}
                    >
                      ออกเดินทาง
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleTripSaccess(val)}
                      disabled={val.status_user !== 3}
                    >
                      ถึงจุุดหมาย
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {customerList && customerList.length > 0 ? (
          customerList
            .filter((val) => val.id_schedule === 1)
            .map((val, key) => {
              return (
                <ListGroup key={key}>
                  <ListGroup.Item style={{ padding: "3%" }} disabled={false}>
                    <div className="card-body-item">
                      <h5>ชื่อ</h5>
                      <h5>{val.fname}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>จำนวน</h5>
                      <h5>{val.number_of_seat}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>เบอร์โทร </h5>
                      <h5>{val.phoneNumber}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>รายละเอียดจุดนัดพบ</h5>
                      <h5>{val.meeting_point ? val.meeting_point : "-"}</h5>
                    </div>
                    <div className="myround-button">
                      <Button
                        variant="primary"
                        onClick={() => handleCheckMark(val.lat, val.lng)}
                        disabled={val.meeting_point === "ขึ้นที่ต้นทาง"}
                      >
                        ดูปักหมุด
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              );
            })
        ) : (
          <h5 style={{ alignSelf: "center" }}>ยังไม่มีผู้โดยสาร</h5>
        )}
      </>
    )}
  </Tab>
  <Tab eventKey="ku" title="บางเขน">
    {myRoundList.length === 0 || !myRoundList.some(val => val.id_schedule === 2) ? (
      <h5 style={{ alignSelf: "center" }}>คุณยังไม่ได้ลงทะเบียนรอบขับ</h5>
    ) : (
      <>
        {myRoundList
          .filter((val) => val.id_schedule === 2)
          .map((val, key) => (
            <div className="schedule-user card" key={key}>
              <div className="card-body-user-myround">
                <div className="card-body-top-myround">
                  <div className="globle-trip">
                    <h5>
                      {val.id_schedule === 1
                        ? "กำแพงแสน"
                        : val.id_schedule === 2
                        ? "บางเขน"
                        : ""}
                    </h5>
                    <div className="globle-arrow">
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
                    <h5>
                      {val.id_schedule === 2
                        ? "กำแพงแสน"
                        : val.id_schedule === 1
                        ? "บางเขน"
                        : ""}
                    </h5>
                  </div>
                  <h4 className="time-font">{val.time.slice(0, 5)}</h4>
                </div>
                <div className="globle-line"></div>
                <div className="card-body-mid-myround">
                  <h5>
                    จำนวนผู้โดยสาร : {val.current_seat}/{val.all_seat}
                  </h5>
                  <Button variant="warning" onClick={() => handleEdit(val)}>
                    แก้ไข
                  </Button>
                </div>
                <div className="card-body-but-myround">
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(val)}
                      disabled={
                        !(val.status_user === 1 && val.current_seat === 0)
                      }
                    >
                      ถอน
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleTravel(val)}
                      disabled={val.status_user === 3}
                    >
                      ออกเดินทาง
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleTripSaccess(val)}
                      disabled={val.status_user !== 3}
                    >
                      ถึงจุุดหมาย
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {customerList && customerList.length > 0 ? (
          customerList
            .filter((val) => val.id_schedule === 2)
            .map((val, key) => {
              return (
                <ListGroup key={key}>
                  <ListGroup.Item style={{ padding: "3%" }} disabled={false}>
                    <div className="card-body-item">
                      <h5>ชื่อ</h5>
                      <h5>{val.fname}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>จำนวน</h5>
                      <h5>{val.number_of_seat}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>เบอร์โทร </h5>
                      <h5>{val.phoneNumber}</h5>
                    </div>
                    <div className="card-body-item">
                      <h5>รายละเอียดจุดนัดพบ</h5>
                      <h5>{val.meeting_point ? val.meeting_point : "-"}</h5>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        onClick={() => handleCheckMark(val.lat, val.lng)}
                        disabled={val.meeting_point === "ขึ้นที่ต้นทาง"}
                      >
                        ดูปักหมุด
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              );
            })
        ) : (
          <h5 style={{ alignSelf: "center" }}>ยังไม่มีผู้โดยสาร</h5>
        )}
      </>
    )}
  </Tab>
</Tabs>
       

        <Modal
          show={showSuccessTripModal}
          onHide={() => setShowSuccessTripModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>เรียบร้อย</Modal.Title>
          </Modal.Header>
          <Modal.Body>การเดินทางเสร็จสิ้น</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowSuccessTripModal(false)}
            >
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>เรียบร้อย</Modal.Title>
          </Modal.Header>
          <Modal.Body>การเดินทางเริ่มต้นแล้ว</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowSuccessModal(false)}
            >
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>แก้ไขจำนวนคน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formNumberOfPeople">
              <Form.Label>จำนวนคน</Form.Label>
              <Form.Control
                type="number"
                value={newNumberOfPeople}
                onChange={(e) => setNewNumberOfPeople(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              ยกเลิก
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
          <Modal.Header closeButton>
            <Modal.Title>ยืนยันการถอนรอบขับ</Modal.Title>
          </Modal.Header>
          <Modal.Body>คุณแน่ใจหรือไม่ที่ต้องการที่จะถอนรอบขับนี้?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCancelModal}>
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={handleCancelRound}>
              ถอนรอบขับ
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showMap}
          onHide={handleCheckMark}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>ปักหมุด</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Map />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCheckMark}>
              ยืนยัน
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MyRound;
