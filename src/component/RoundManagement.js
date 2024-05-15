import { useState, useEffect } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import TimeOptions from "./TimeOption";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import "../css/main.css";
import Nav from "./Nav";
import Author from "./Author";

function RoundManagement() {
  const [time, setTime] = useState("");
  const [id_schedule, setId_schedule] = useState("");

  const [roundList, setRoundList] = useState([]);
  const [editRound, setEditRound] = useState([]); // เพิ่ม state เพื่อเก็บข้อมูลรอบรถที่จะแก้ไข
  const [roundToCancel, setRoundToCancel] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleShowAdd = () => setShowAdd(true);
  // const handleShow = () => setShow(true);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const handleCloseDeleteSuccessModal = () => setShowDeleteSuccessModal(false);
  const handleShowDeleteSuccessModal = () => setShowDeleteSuccessModal(true);

  const [showAddSuccessModal, setShowAddSuccessModal] = useState(false);
  const handleCloseAddSuccessModal = () => setShowAddSuccessModal(false);
  const handleShowAddSuccessModal = () => setShowAddSuccessModal(true);

  const [showCancelDriverRoundModal, setShowCancelDriverRoundModal] =
    useState(false);
  const handleCloseCancelDriverRoundModal = () =>
    setShowCancelDriverRoundModal(false);

  const handleShowCancelDriverRoundModal = (data) => {
    setRoundToCancel(data);
    setShowCancelDriverRoundModal(true);
  };

  useEffect(() => {
    handleItemClick(1);
  }, []);

  const handleCancelDriverRound = (data) => {
    Axios.put("http://localhost:3333/updateCancelRound", {
      status: "1",
      id_driver: data.id_driver,
      id_scheduleDetail: data.id_scheduleDetail,
    })
      .then((response) => {
        console.log("Schedule detail canceled successfully:", response.data);
        handleCloseCancelDriverRoundModal();
        handleItemClick(data.id_schedule);
      })
      .catch((error) => {
        console.error("Error canceling schedule detail:", error);
      });
  };

  const handleEditRound = (round) => {
    setEditRound(round);
    handleShowEdit();
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    // ส่งข้อมูลการแก้ไขรอบรถไปยังเซิร์ฟเวอร์ และทำการอัปเดตรายการรอบรถใน state
    Axios.put(
      `http://localhost:3333/updateRound/${editRound.id_scheduleDetail}`,
      {
        time: editRound.time,
        // id_schedule: editRound.id_schedule,
      }
    ).then(() => {
      setRoundList((prevRound) =>
        prevRound
          .filter(
            (item) => item.id_scheduleDetail !== editRound.id_scheduleDetail
          )
          .concat({
            ...editRound,
            time: editRound.time,
            // id_schedule: editRound.id_schedule,
          })
      );
      handleCloseEdit(); // ปิด Offcanvas หลังจากแก้ไขเสร็จสิ้น
    });
  };

  const handleItemClick = (destination) => {
    console.log("ตารางหน้า :" + destination);
    console.log(destination);
    const destinationValue =
      parseInt(destination) === 1 ? "กำแพงแสน" : "บางเขน";
    console.log(destinationValue);
    setSelectedItem(destinationValue);

    Axios.get(`http://localhost:3333/schedule/${destination}`)
      .then((response) => {
        setRoundList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  };

  const addRound = () => {
    Axios.post("http://localhost:3333/addRound", {
      time: time,
      id_schedule: id_schedule,
    }).then(() => [
      setRoundList([
        ...roundList,
        {
          time: time,
          id_schedule: id_schedule,
        },
      ]),
      console.log("addround " + id_schedule),
      handleShowAddSuccessModal(),
      handleItemClick(id_schedule),
    ]);
  };

  const deleteRound = (id_scheduleDetail) => {
    Axios.delete(`http://localhost:3333/delete/${id_scheduleDetail}`).then(
      () => {
        setRoundList(
          roundList.filter((val) => {
            return val.id_scheduleDetail !== id_scheduleDetail; // แก้เป็นการเปรียบเทียบที่ถูกต้อง
          })
        );
        handleShowDeleteSuccessModal();
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRound();
    handleCloseAdd();
    // ทำสิ่งที่ต้องการเมื่อผู้ใช้กด Submit ฟอร์ม
    // เช่น ส่งข้อมูลไปยังเซิร์ฟเวอร์หรือประมวลผลข้อมูล
  };

  return (
    <><Author/>
      {" "}
      <Nav />
      <div className="main-container">
        {/* <div>RoundManagement</div> */}

        <div className="head-manage">
          <div>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                style={{ minWidth: "150px", minHeight: "40px" }}
              >
                {selectedItem}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleItemClick(2)}>
                  บางเขน
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleItemClick(1)}>
                  กำแพงแสน
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button
              variant="primary"
              onClick={handleShowAdd}
              className="btn-sm"
              style={{ minWidth: "150px", minHeight: "40px" }}
            >
              เพิ่มรอบ
            </Button>
          </div>
        </div>

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              {/* <th>Key</th> */}
              <th>จุดออกเดินทาง</th>
              <th>รอบเวลา</th>
              <th>คนขับ</th>
              <th>สถานะการเดินทาง</th>
              <th>Action</th>
            </tr>
          </thead>
          {roundList &&
            roundList
              .slice() // สำเนาข้อมูลเพื่อป้องกันการเปลี่ยนแปลงข้อมูลต้นฉบับ
              .sort((a, b) => a.time.localeCompare(b.time)) // เรียงลำดับข้อมูลตามเวลา (time)
              .map((val, key) => {
                return (
                  <tbody key={key}>
                    <tr>
                      {/* <td>{val.id_scheduleDetail}</td> */}
                      <td>{val.name}</td>
                      <td>{val.time.slice(0, 5)}</td>
                      <td>
                        <td>
                          {val.status === 1 ? (
                            "ว่าง"
                          ) : val.status === 2 ? (
                            <>{val.fname}</>
                          ) : (
                            ""
                          )}
                        </td>
                      </td>
                      <td>
                        <td>
                          {val.status_user === 1 && val.status === 2
                            ? "รอรถออก"
                            : val.status_user === 3
                            ? "กำลังเดินทาง"
                            : ""}
                        </td>
                      </td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "3%",
                        }}
                      >
                        <Button
                          className="btn btn-warning"
                          disabled={val.status === 2}
                          onClick={() => handleEditRound(val)}
                        >
                          <BsPencilSquare />
                        </Button>

                        <Button
                          className="btn btn-warning"
                          disabled={val.status === 1 || val.status_user === 3}
                          onClick={() => handleShowCancelDriverRoundModal(val)}
                        >
                          <AiOutlineClear />
                        </Button>

                        <Button
                          className="btn btn-danger"
                          disabled={val.status === 2}
                          onClick={() => deleteRound(val.id_scheduleDetail)}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
        </Table>

        <Offcanvas show={showAdd} onHide={handleCloseAdd}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>เพิ่มรอบรถ</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>จุดต้นทาง</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  defaultValue="1"
                  value={id_schedule}
                  onChange={(event) => setId_schedule(event.target.value)}
                >
                  <option value="1">กำแพงแสน</option>
                  <option value="2">บางเขน</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>เวลา</Form.Label>
                <Form.Select
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                >
                  
                  <option value="">กรุณาเลือกเวลา</option>
                  
                  <TimeOptions />
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit">
                ยืนยันการเพิ่มรอบรถ
              </Button>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>

        <Offcanvas show={showEdit} onHide={handleCloseEdit}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>แก้ไขรอบรถ</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form onSubmit={handleEditSubmit}>
              {/* <Form.Group className="mb-3" controlId="formName">
              <Form.Label>จุดหมายปลายทาง</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={editRound ? editRound.id_schedule : ""}
                onChange={(event) =>
                  setEditRound((prevRound) => ({
                    ...prevRound,
                    id_schedule: event.target.value,
                  }))
                }
              >
                <option value="1">กำแพงแสน</option>
                <option value="2">บางเขน</option>
              </Form.Select>
            </Form.Group> */}
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>เวลา</Form.Label>
                <Form.Select
                  value={editRound ? editRound.time : ""}
                  onChange={(event) =>
                    setEditRound((prevRound) => ({
                      ...prevRound,
                      time: event.target.value,
                    }))
                  }
                >
                  <option value="">กรุณาเลือกเวลา</option>
                  <TimeOptions />
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit">
                ยืนยันการแก้ไข
              </Button>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>

        <Modal
          show={showDeleteSuccessModal}
          onHide={handleCloseDeleteSuccessModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>การลบสำเร็จ</Modal.Title>
          </Modal.Header>
          <Modal.Body>การลบรอบรถสำเร็จแล้ว</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteSuccessModal}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showAddSuccessModal} onHide={handleCloseAddSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>การแจ้งเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>การเพิ่มรอบสำเร็จแล้ว</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddSuccessModal}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showCancelDriverRoundModal}
          onHide={handleCloseCancelDriverRoundModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>ยืนยันการล้างรอบรถ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            คุณแน่ใจหรือไม่ที่ต้องการล้างรอบ{" "}
            {roundToCancel && roundToCancel.time.slice(0, 5)}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCancelDriverRoundModal}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleCancelDriverRound(roundToCancel);
                setId_schedule(roundToCancel);
              }}
            >
              ยืนยัน
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default RoundManagement;
