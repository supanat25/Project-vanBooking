import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import profilePic from "../img/Profile.png";
import "../css/nav.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBook,
  faCar,
  faClipboardList,
  faBusinessTime,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";


function Nav() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("fname");
    if (name) {
      setName(name);
      setRole(role);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <navbarTop>
        <div className="container-navtop">
          <div className="nav-top">
            <img
              src={logo}
              alt="kps"
              style={{ width: "11%", height: "auto",  }}
            />

            <h5 className="nav-top-text">ระบบจองรถตู้วินกำแพงแสน - บางเขน </h5>

            <NavLink
              to="/"
              className="nav-top-item-logout"
              onClick={handleLogout}
              activeClassName="active"
              style={{color:"black"}}
            >
              <i className="fa-solid fa-right-from-bracket" /> 
            </NavLink>
          </div>
        </div>
      </navbarTop>
      <navbar>
        <div className="nav-header">
          <div style={{ width: "100%", height: "100%" }}>
            <img
              src={profilePic}
              alt="kps"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="nav-name">
            <h5
              className="nav-text-name"
              style={{ marginBottom: "0", alignSelf: "self-end" }}
            >
              {name}
            </h5>
            {role === "user" && (
            <h7 className="nav-role-user">ผู้ใช้งานทั่วไป</h7>
            )}
            {role === "driver" && <h7 className="nav-role-nonuser">DRIVER</h7>}
            {role === "admin" && <h7 className="nav-role-nonuser">ADMIN</h7>}
          </div>

          {/* <div className="nav-role">
          {" "}
          {role === "driver" && <h4 className="nav-role">DRIVER</h4>}
          {role === "admin" && <h4 className="nav-role">ADMIN</h4>}
        </div> */}
        </div>

        <div className="line"></div>
        <div className="nav-list">
          {role === "user" && (
            <>
              <NavLink
                exact
                to="/home"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faHouse} />
                <div className="nav-item-text">หน้าแรก</div>
              </NavLink>
              <NavLink
                to="/bookingDetail"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faBook} size="lg" />
                <div className="nav-item-text">การจองของฉัน</div>
              </NavLink>
            </>
          )}
          {role === "driver" && (
            <>
              <NavLink
                to="/myround"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faCar} size="lg" />
                <div className="nav-item-text">รอบขับของฉัน</div>
              </NavLink>
              <NavLink
                to="/scheduledriver"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faClipboardList} size="lg" />
                <div className="nav-item-text">ลงทะเบียนรอบขับ</div>
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink
                to="/drivermanage"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faPeopleRoof} size="lg" />
                <div className="nav-item-text">จัดการคนขับ</div>
              </NavLink>
              <NavLink
                to="/roundmanagement"
                className="nav-side-item"
                activeClassName="active"
              >
                <FontAwesomeIcon icon={faBusinessTime} size="lg" />
                <div className="nav-item-text">จัดการรอบเวลา</div>
              </NavLink>
            </>
          )}

          {role !== "admin" && (
            <div className="on-respon">
              <NavLink
                to="/myaccount"
                className="nav-side-item"
                activeClassName="active"
              >
                <i className="fas fa-cog" />
                <div className="nav-item-text">บัญชี</div>
              </NavLink>
            </div>
          )}
        </div>
        {/* <div className="logout">
          <NavLink
            to="/"
            className="nav-side-item-logout"
            onClick={handleLogout}
            activeClassName="active"
          >
            <i className="fa-solid fa-right-from-bracket" /> ออกจากระบบ
          </NavLink>
        </div> */}
      </navbar>
    </>
  );
}

export default Nav;
