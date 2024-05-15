import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Nav from "./Nav";
import Dropdown from "react-bootstrap/Dropdown";
import "../css/scheduleUser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import MarkMap from "./MarkMap";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Waiting from "./Waiting";
import { responsiveFontSizes } from "@mui/material";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Author from "./Author";
const icon = <FontAwesomeIcon icon={faArrowRightLong} />;

export default function ScheduleUser() {
  const [fullscreen, setFullscreen] = useState(true);
  const [number_of_seat, setNumber_of_seat] = useState(1);
  const [meeting_point, setMeeting_point] = useState("");
  const [currentTime, setCurrentTime] = useState(""); //เก็บเวลาปัจจุบัน
  const [currentDate, setCurrentDate] = useState(""); // เก็บวันปัจจุบัน
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [myBooking,setMyBooking] = useState([])  ;

  const [scheduleList, setScheduleList] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1);
  const [appointment, setAppointment] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedScheduleData, setSelectedScheduleData] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [booking, setBooking] = useState([]);
  const id_user = localStorage.getItem("id_user");
  const [key, setKey] = useState("home");
  const navigate = useNavigate();
  const [bookingCheck, setBookingCheck] = useState(1); // ใ

  const [showSuccessModal, setShowSuccessModal] = useState(false); // เพิ่ม state เก็บสถานะการแสดง modal

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

  const handleScheduleSelection = (scheduleData) => {
    setSelectedScheduleData(scheduleData);
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  const toggleMapDisplay = () => {
    setShowMap(!showMap);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false); // ฟังก์ชั่นปิด modal
    navigate("/bookingDetail"); // ไปยังหน้า bookingDetail
  };

  useEffect(() => {
    getSchedulde(1);
    const now = new Date();
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = now
      .toLocaleDateString("en-GB", options)
      .replace(/\//g, "-");
    setCurrentDate(formattedDate); // เก็บวันปัจจุบันเมื่อโหลดครั้งแรก
    getCurrentTime();
    getMyBooking();
  }, []);

  useEffect(() => {
    console.log(myBooking); 
    if (myBooking.length > 0) {
      console.log("IF" , myBooking[0].id_scheduleDetail); 
      setBookingCheck(myBooking[0].id_scheduleDetail) ;
    }
  }, [myBooking]); // useEffect จะถูกเรียกเมื่อ myBooking มีการเปลี่ยนแปลง

  const getMyBooking = () => {

    Axios.get(`http://localhost:3333/myBooking/${id_user}`)
      .then((response) => {
        setMyBooking(response.data);
        console.log(myBooking)
        console.log(myBooking[0].id_scheduleDetail)
      })
      .catch((error) => {
        console.error("Error fetching booking_detail:", error);
      });
  };

  const getSchedulde = (destination) => {
    setSelectedItem(destination);
    // const destinationValue = destination === "บางเขน" ? 2 : 1;

    Axios.get(`http://localhost:3333/scheduleUser/${destination}`)
      .then((response) => {
        setScheduleList(response.data);
      
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  };

  const handleBooking = () => {
    const latitudeLongitude = localStorage.getItem("lastClickedLocation");
    let mapData = JSON.parse(latitudeLongitude);
    let meetingPoint = meeting_point;
    const userLat = parseFloat(localStorage.getItem("lat_user"));
    const userLng = parseFloat(localStorage.getItem("lng_user"));

    console.log("1" + meetingPoint);
    if (!mapData) {
      console.log("IF");
      mapData = { latitude: userLat, longitude: userLng };
    }
    if (checkboxChecked) {
      meetingPoint = "ขึ้นที่ต้นทาง";
      mapData = { latitude: 0, longitude: 0 };
      console.log("2" + meetingPoint);
    }

    Axios.post("http://localhost:3333/booking", {
      number_of_seat: number_of_seat,
      meeting_point: meetingPoint,
      id_user_b: id_user,
      id_scheduleDetail: selectedScheduleData.id_scheduleDetail,
      longitude: mapData.longitude,
      latitude: mapData.latitude,
    }).then(() => [
      setBooking([
        ...booking,
        {
          number_of_seat: number_of_seat,
          meeting_point: meeting_point,
          id_user_b: id_user,
          id_scheduleDetail: selectedScheduleData.id_scheduleDetail,
          longitude: mapData.longitude,
          latitude: mapData.latitude,
        },
        setShowOffcanvas(false),
        // getMyBooking(),
        localStorage.removeItem("lastClickedLocation"),
        setShowSuccessModal(true), // เมื่อจองสำเร็จให้แสดง modal
      ]),
    ]);
  };

  return (
    <>
    <Author/>
      <Nav />
      <div className="main-container">
        <div className="schedule-user-filter">
          <h5 style={{ margin: "0" }}>เลือกเส้นทาง</h5>
          <div className="filter-dropdown">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-success"
                id="dropdown-basic"
                size="sm"
              >
                {selectedItem === 1 ? (
                  <>กำแพงแสน {icon} บางเขน</>
                ) : (
                  <>บางเขน {icon} กำแพงแสน</>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => getSchedulde(2)}>
                  บางเขน
                </Dropdown.Item>
                <Dropdown.Item onClick={() => getSchedulde(1)}>
                  กำแพงแสน
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* {scheduleList.length === 0 ||
      scheduleList.every((val) => val.time < currentTime) ? (
        <div className="schedule-user card">
          <div className="card-body-user">
            <div
              style={{ display: "flex", justifyContent: "center" }}
              className="card-body-top"
            >
              <h4>ยังไม่มีรอบให้บริการ</h4>
            </div>
            <FontAwesomeIcon
              icon={faFaceFrown}
              size="2xl"
              style={{ color: "#f50000" }}
            />
          </div>
        </div>
      ) : ( */}
        <div className="header-cards">
          <h5 style={{ margin: "0" }}>ตารางเดินรถ : {currentDate}</h5>
          <div className="note">
            *เวลาที่ใช้เดินทางอาจมีการเปลี่ยนแปลงขึ้นอยู่กับสภาพการจราจร
          </div>
        </div>

        {scheduleList
          .slice() // สำเนาข้อมูลเพื่อป้องกันการเปลี่ยนแปลงข้อมูลต้นฉบับ
          .sort((a, b) => a.time.localeCompare(b.time)) // เรียงลำดับข้อมูลตามเวลา (time)
          .map((val, key) => {
            const isPastTime = val.time < currentTime;
            return (
             
              // !isPastTime && (
              <div className="schedule-user card" key={key}> 
             
          
                <div className="card-body-user">
                  <div className="card-body-1">
                    <div className="card-body-1-1">
                      {val.id_schedule === 1
                        ? "กำแพงแสน"
                        : val.id_schedule === 2
                        ? "บางเขน"
                        : ""}
                      <h4 className="time-font">{val.time.slice(0, 5)} </h4>
                    </div>
                    <div className="card-body-1-2">
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
                    <div className="card-body-1-3">
                      {val.id_schedule === 2
                        ? "กำแพงแสน"
                        : val.id_schedule === 1
                        ? "บางเขน"
                        : ""}
                      <h4 className="time-font">
                        {(
                          (parseInt(val.time.slice(0, 2)) +
                            Math.floor(
                              (parseInt(val.time.slice(3, 5)) + 90) / 60
                            )) %
                          24
                        )
                          .toString()
                          .padStart(2, "0")}
                        :
                        {((parseInt(val.time.slice(3, 5)) + 90) % 60)
                          .toString()
                          .padStart(2, "0")}
                      </h4>
                    </div>

                    <h4></h4>
                  </div>
                  <div className="v-line"></div>
                  <div className="card-body-2">
                    <h7>คนขับ : {val.fname}</h7>
                  </div>
                  {/* <div className="v-line"></div> */}
                  <div className="card-body-3">
                    <h4 style={{margin:"0"}}>
                      {val.current_seat}/{val.all_seat}
                    </h4>

                    {
                    // val.status_user === 3 || val.time < currentTime ? (
                    //   <Button
                    //     variant="secondary"
                    //     style={{ maxHeight: "70%", maxWidth: "70%" }}
                    //     disabled={true}
                    //   >
                    //     ออกแล้ว
                    //   </Button>
                    // ) : 
                    val.current_seat - val.all_seat === 0 ? (
                      <Button
                        variant="danger"
                        style={{ maxHeight: "70%", maxWidth: "70%" }}
                        disabled={true}
                      >
                        เต็ม
                      </Button>
                    ) : 
                    bookingCheck !== 1 ? (
                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">คุณสามารถจองได้ทีละหนึ่งครั้ง!</Tooltip>}>
                      <span style={{display:"contents"}}>
                      <Button
                        variant="primary"
                        style={{maxHeight: "70%",maxWidth:"70%" }}
                        disabled={true}
                      >
                        จอง
                      </Button>
                      </span>

                      
                    </OverlayTrigger>
                    
                    ) : (
                      
                       <Button
                        variant="primary"
                        style={{ maxHeight: "70%", maxWidth: "70%" }}
                        onClick={() => {
                          setShowOffcanvas(true); // เปิด Offcanvas เมื่อคลิกที่ปุ่ม
                          handleScheduleSelection(val); // เลือกเวลาของรอบที่ต้องการจอง
                        }}
                      >
                        จอง
                      </Button>
                    )}

                  </div>
                </div>
              </div>
              // )
            );
          })}
        {/* )} */}
        {/* Offcanvas */}

        <Offcanvas
          show={showOffcanvas}
          placement="end"
          onHide={() => setShowOffcanvas(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <h4
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "#435334",
                }}
              >
                จองรอบ
              </h4>
              <h5
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "#435334",
                }}
              >
                {selectedScheduleData.current_seat} /{" "}
                {selectedScheduleData.all_seat}
              </h5>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <div className="globle-line" style={{ marginInline: "5%" }}></div>
          <Offcanvas.Body>
            <div className="mb-3">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <h6>จุดหมายปลายทาง :</h6>
                <h6>{selectedScheduleData.name}</h6>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <h6> เวลา :</h6>
                {selectedScheduleData && selectedScheduleData.time && (
                  <h6>{selectedScheduleData.time.slice(0, 5)}</h6>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <h6>คนขับ :</h6>
                <h6> {selectedScheduleData.fname}</h6>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <h6> ทะเบียน :</h6>
                <h6>{selectedScheduleData.carNumber}</h6>
              </div>

              {/* <div>{mapData.latitude}</div>
            <div>{mapData.longitude}</div> */}
            </div>
            <div className="globle-line" style={{ marginBlock: "5%" }}></div>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="number_of_seat"
                style={{}}
              >
                <Form.Label>
                  <h5>จำนวนผู้โดยสาร</h5>
                </Form.Label>
                <div className="d-flex align-items-center">
                  <i
                    variant="secondary"
                    onClick={() =>
                      setNumber_of_seat((prevValue) =>
                        prevValue > 1 ? prevValue - 1 : prevValue
                      )
                    }
                    class="fa-solid fa-caret-left fa-2xl"
                  />

                  <Form.Control
                    type="number"
                    min="1"
                    value={number_of_seat}
                    readOnly
                    style={{ width: "50px", textAlign: "center" }}
                  />

                  <i
                    key={key}
                    variant="secondary"
                    onClick={() =>
                      setNumber_of_seat((prevValue) =>
                        prevValue < selectedScheduleData.all_seat
                          ? prevValue + 1
                          : prevValue
                      )
                    }
                    class="fa-solid fa-caret-right fa-2xl"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="appointment">
                <Form.Label>
                  <h5>จุดนัดพบ</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="รายละเอียดจุดนัดพบที่ต้องการแจ้งคนขับ"
                  value={meeting_point}
                  onChange={(e) => setMeeting_point(e.target.value)}
                  disabled={checkboxChecked}
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="ขึ้นที่ต้นทาง"
                checked={checkboxChecked}
                onChange={handleCheckboxChange}
              />
              <div className="button-group">
                <Button
                  variant="info"
                  onClick={toggleMapDisplay}
                  style={{ maxWidth: "80%" }}
                  disabled={checkboxChecked}
                >
                  {showMap ? "ซ่อนแผนที่" : "ปักหมุดแผนที่"}
                </Button>
                {/* {showMap && <Map />} */}

                <Button
                  variant="success"
                  onClick={handleBooking}
                  // disabled={mapData === null}
                  style={{ maxWidth: "80%" }}
                >
                  ยืนยันการจอง
                </Button>
              </div>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>การจองสำเร็จ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuccessModal}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showMap} onHide={toggleMapDisplay} fullscreen={fullscreen}>
          <Modal.Header closeButton>
            <Modal.Title>ปักหมุดจุดนัดพบ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MarkMap />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={toggleMapDisplay}>
              ยืนยัน
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
