import { useState, useEffect } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "../css/main.css";
import "../css/manage.css";
import Nav from "./Nav";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Author from "./Author";


function DriverManage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [carNumber, setcarNumber] = useState("");
  const [identificationNumber, setidentificationNumber] = useState("");
  const [role, setRole] = useState();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usernameList , setUsernameList] = useState([]);

  const [showuser, setShowuser] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getUser = () => {
    Axios.get("http://localhost:3333/user").then((response) => {
      setShowuser(response.data);
    });
  };

  const handleShowModal = (driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const checkDuplicate  = ()=>{
    Axios.get(`http://localhost:3333/checkDuplicate/`)
    .then((response) => {
      setUsernameList(response.data);
    })
    .catch((error) => {
      console.error("Error fetching booking details:", error);
    });
  }

  const addDriver = () => {
    Axios.post("http://localhost:3333/addDriver", {
      fname: name,
      username: username,
      password: 123,
      phoneNumber: phoneNumber,
      carNumber: carNumber,
      identificationNumber: identificationNumber,
      // role: role,
    }).then(() => [
      setShowuser([
        ...showuser,
        {
          fname: name,
          username: username,
          password: password,
          phoneNumber: phoneNumber,
          carNumber: carNumber,
          identificationNumber: identificationNumber,
          // role: role,
        },
      ]),
    ]);
  };

  useEffect(() => {
    getUser();
    checkDuplicate();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !name ||
      !username ||
      !phoneNumber ||
      !carNumber ||
      !identificationNumber
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if(usernameList.some(item => item.username === username)){
      alert("username นี้ถูกใช้ไปแล้ว กรุณาใช้ username อื่น");
      return; 
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert(
        "เบอร์โทรศัพท์มือถือต้องเป็นตัวเลข 10 หลักที่ขึ้นต้นด้วย 0 เท่านั้น"
      );
      return;
    }

    const carRegex = /^[A-Za-zก-๙]{2}\d{4}$/;
    if (!carRegex.test(carNumber)) {
      alert(
        "ทะเบียนรถต้องขึ้นต้นด้วยตัวอักษร 2 ตัว ตามด้วยตัวเลข 4 ตัวเท่านั้น"
      );
      return;
    }

    const licenseRegex = /^\d{8}$/;
    if (!licenseRegex.test(identificationNumber)) {
      alert("เลขใบอนุญาติขับรถต้องเป็นตัวเลข 8 ตัวเท่านั้น");
      return;
    }

    addDriver();
    handleClose();
    getUser();
  };

  return (
    <>
    <Author/>
    <Nav />
    <div className="main-container">
      
      {/* <div>DriverMage</div> */}
      <div className="head-manage">
        <div></div>
        <div>
          <Button
            variant="primary"
            onClick={handleShow}
            className="btn-sm"
            style={{ minWidth: "150px", minHeight: "40px" }}
          >
            เพิ่มบัญชีคนขับ
          </Button>
        </div>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>ชื่อจริง</th>
            <th>ทะเบียนรถ</th>
            <th>สถานะ</th>

            {/* <th>เบอร์โทร</th>
            <th>เลขใบอนุญาติขับรถ</th> */}
            <th>Action</th>
          </tr>
        </thead>
        {showuser &&
          showuser.map((val, key) => {
            return (
              <tbody key={key}>
                <tr>
                  <td>{val.username}</td>
                  <td>{val.fname}</td>
                  <td>{val.carNumber}</td>
                  <td>{val.check_driver === 1 ? "ไม่ได้ลงรอบ" : "ลงรอบ"}</td>

                  {/* <td>{val.phoneNumber}</td>
                  <td>{val.identificationNumber}</td> */}

                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "3%",
                    }}
                  >
                    {/* <Button
                      className="btn btn-warning"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleEditDriver(val)}
                    >
                      <BsPencilSquare />
                    </Button> */}

                    {/* <Button
                      className="btn btn-danger"
                      onClick={() => deleteDriver(val.id_scheduleDetail)}
                    >
                      <BsTrash />
                    </Button> */}

                    <Button
                      className="btn btn-warning"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleShowModal(val)}
                    >
                      
                      <FaMagnifyingGlass />
                    </Button>


                  </td>
                </tr>
              </tbody>
            );
          })}
      </Table>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>สร้างบัญชีคนขับรถ</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>ชื่อจริง</Form.Label>
              <FormControl
                type="text"
                placeholder=""
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <FormControl
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formphoneNumber">
              <Form.Label>เบอร์โทรศัพท์มือถือ</Form.Label>
              <FormControl
                type="text"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formcarNumber">
              <Form.Label>ทะเบียนรถ</Form.Label>
              <FormControl
                type="text"
                value={carNumber}
                onChange={(event) => setcarNumber(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formidentificationNumber">
              <Form.Label>เลขใบอนุญาติขับรถ</Form.Label>
              <FormControl
                type="text"
                value={identificationNumber}
                onChange={(event) =>
                  setidentificationNumber(event.target.value)
                }
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>รหัสผ่าน</Form.Label>
              <FormControl
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group> */}
            <Button variant="primary" type="submit">
              ยืนยัน
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลคนขับ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDriver && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 3fr"}}>
                <h5>Username :</h5>
                <h5>{selectedDriver.username}</h5>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 3fr"}}>
                <h5>ชื่อจริง :</h5>
                <h5>{selectedDriver.fname}</h5>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 3fr"}}>
                <h5>เบอร์โทร :</h5>
                <h5>{selectedDriver.phoneNumber}</h5>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 3fr"}}>
                <h5>ทะเบียนรถ :</h5>
                <h5>{selectedDriver.carNumber}</h5>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 3fr"}}>
                <h5>เลขใบอนุญาติขับรถ :</h5>
                <h5>{selectedDriver.identificationNumber}</h5>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}

export default DriverManage;
