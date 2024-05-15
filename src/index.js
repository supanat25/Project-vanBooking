import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Setting from "./component/Setting";
import LogInPage from "./component/LogInPage";
import SignupPage from "./component/SignupPage";
import BookingDetail from "./component/BookingDetail";
import MyRound from "./component/MyRound";
import DriverManage from "./component/DriverManage";
import RoundManagement from "./component/RoundManagement";
import ScheduleDriver from "./component/ScheduleDriver";
import ScheduleUser from "./component/ScheduleUser";
import MyAccount from "./component/MyAccount";
import Waiting from "./component/Waiting"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogInPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "home",
    element: <ScheduleUser />,
  },
  {
    path: "bookingDetail",
    element: <BookingDetail />,
  },
  {
    path: "/myaccount/setting",
    element: <Setting />,
  },
  {
    path: "scheduleUser",
    element: <ScheduleUser />,
  },
  {
    path: "myround",
    element: <MyRound />,
  },
  {
    path: "scheduledriver",
    element: <ScheduleDriver />,
  },
  {
    path: "drivermanage",
    element: <DriverManage />,
  },
  {
    path: "roundmanagement",
    element: <RoundManagement />,
  },
  {
    path: "myaccount",
    element: <MyAccount />,
  },
  {
    path: "loading",
    element: <Waiting />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
   
    <RouterProvider router={router} />
    {/* <Footer/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
