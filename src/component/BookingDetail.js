import React, { useState, useEffect } from "react";
import Axios from "axios";
import Nav from "./Nav";
import "../css/bookingDetail.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import "../css/main.css";
import "../css/animation.css";
import Map from "./Map";
import Author from "./Author";

function BookingDetail() {
  const [bookingDetail, setBookingDetail] = useState([]);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับการแสดง modal
  const [idToDelete, setIdToDelete] = useState(null); // เพิ่ม state เพื่อเก็บ ID ที่จะลบ
  const [id_scheduleDetailToUpdate, setId_scheduleDetailToUpdate] =
    useState(null); // เพิ่ม state เพื่อเก็บ ID ที่จะลบ
  const [number_of_seatToDelete, setNumber_of_seatToDelete] = useState(null); // เพิ่ม state เพื่อเก็บ ID ที่จะลบ
  const [currentTime, setCurrentTime] = useState(""); //เก็บเวลาปัจจุบัน
  const id_user = localStorage.getItem("id_user");
  const [currentDate, setCurrentDate] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getCurrentDate();
    getCurrentTime();
  }, []);

  useEffect(() => {
    if (currentDate !== "") {
      getBookingDetail(currentDate);
    }
  }, [currentDate]);

  const handleCheckMark = (lat, lng) => {
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);
    setShowMap(!showMap);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setCurrentDate(formattedDate);
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

  const getBookingDetail = (currentDate) => {
    Axios.get(`http://localhost:3333/bookingDetail/${id_user}`)
      .then((response) => {
        setBookingDetail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error);
      });
  };

  const updateSchedule = (id_scheduleDetail, number_of_seat) => {
    Axios.put("http://localhost:3333/updateAfterCancel", {
      id_scheduleDetail: id_scheduleDetail,
      number_of_seat: number_of_seat,
    })
      .then((response) => {
        console.log("updateSchedule successfully", response.data);
      })
      .catch((error) => {
        console.error("Error updateSchedule", error);
      });
  };

  const cancelBooking = () => {
    Axios.delete(`http://localhost:3333/cancelBooking/${idToDelete}`)
      .then((response) => {
        updateSchedule(id_scheduleDetailToUpdate, number_of_seatToDelete); // ส่ง id_scheduleDetail และ number_of_seat
        setShowModal(false);
        getBookingDetail(currentDate);
        console.log("Cancel success");
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleCancel = (
    id_bookingDetail,
    number_of_seat,
    id_scheduleDetail
  ) => {
    // เมื่อคลิกที่ปุ่มยกเลิก ให้เซ็ต ID ที่ต้องการลบและแสดง modal
    setId_scheduleDetailToUpdate(id_scheduleDetail);
    setNumber_of_seatToDelete(number_of_seat);
    setIdToDelete(id_bookingDetail);
    setShowModal(true);
  };

  return (
    <>
    <Author/>
    <Nav />
    <div className="main-container">
    <div className="schedule-user-filter">
        <h5 style={{margin:"0"}}>การจองของฉัน</h5>
      </div>
      {/* <h5>การจองของฉัน</h5> */}

      {bookingDetail.length === 0 ? (
        <h6 style={{display:"flex", justifyContent:"center"}}>ยังไม่มีข้อมูลการจอง</h6>
      ) : (
        <div>
          {bookingDetail.map((val, key) => {
            return (
              <div className="booking-user card" key={key}>
                <div className="card-body-booking">
                  <div className="card-body-booking-1">
                    <h4 className="time-font">{val.time.slice(0, 5)}</h4>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h4
                        className={`${
                          val.id_status === 3 ? "animate-charcter" : ""
                        }`}
                        style={{ fontWeight: "bold" }}
                      >
                        {val.user_status}
                      </h4>
                      {val.status_user === 3 ? (
                        <h8>เมื่อ {val.travel_time}</h8>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="globle-line"></div>

                  <div className="card-body-booking-2">
                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">
                        {" "}
                        จุดหมายปลายทาง :{" "}
                      </h6>
                      <h6>{val.id_schedule === 1 ? "บางเขน" : "กำแพงแสน"}</h6>
                    </div>
                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">คนขับ : </h6>
                      <h6>{val.fname}</h6>
                    </div>

                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">เบอร์โทร : </h6>
                      <h6>{val.phoneNumber}</h6>
                    </div>
                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">ทะเบียน : </h6>
                      <h6>{val.carNumber}</h6>
                    </div>
                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">จำนวน : </h6>
                      <h6>{val.number_of_seat} ท่าน</h6>
                    </div>
                    <div className="body-infomation">
                      <h6 className="body-sub-infomation">
                        รายละเอียดจุดนัดพบ :{" "}
                      </h6>
                      {/* <h6>{val.meeting_point}:</h6> */}
                      <h6>{val.meeting_point ? val.meeting_point : "-"}</h6>
                    </div>
                  </div>
                  <div className="booking-button-group">
                    <Button
                      variant="primary"
                      style={{ gridColumn: "2" }}
                      onClick={() => handleCheckMark(val.lat, val.lng)}
                      disabled = {val.meeting_point === "ขึ้นที่ต้นทาง"}
                    >
                      ปักหมุดของฉัน
                    </Button>

                    <Button
                      variant="outline-danger"
                      style={{ gridColumn: "3" }}
                      // disabled={val.id_status === 3}
                      onClick={() =>
                        handleCancel(
                          val.id_bookingDetail,
                          val.number_of_seat,
                          val.id_scheduleDetail
                        )
                      }
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal เพื่อยืนยันการยกเลิก */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการยกเลิกการจอง</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณต้องการยกเลิกการจองนี้หรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={cancelBooking}>
            ยืนยันการยกเลิก
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
          <Modal.Title>ปักหมุดของฉัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Map />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCheckMark}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}

export default BookingDetail;
