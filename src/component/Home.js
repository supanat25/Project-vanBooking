import React, { useEffect } from "react";
import Nav from "./Nav";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../img/kps.jpg";
import img2 from "../img/kubkk.png";
import Author from "./Author";
import "../css/home.css";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   fetch("http://localhost:3333/authen", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + token
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status == "ok") {
  //         console.log("Authen success:", data);

  //       } else {
  //         // alert("token not acess");
  //         const token = localStorage.removeItem('token');
  //         navigate("/");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // Handle error response here
  //     });
  // });

  return (
    <div className="main-container">
      <Nav />

      <Author />
      <home-imgbut>
        {/* <Link to="/scheduleUser">
          <img src={img} alt="example" className="home-img" />
        </Link> */}

        <Link to={{ pathname: "/scheduleUser", state: { value: "1" } }}>
          <img src={img} alt="kps" className="home-img" />
        </Link>

        <Link to="/scheduleUser">
          <img src={img2} alt="example" className="home-img" />
        </Link>
      </home-imgbut>
    </div>
  );
}

export default Home;
