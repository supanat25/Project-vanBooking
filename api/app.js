var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");
const secret = "api-login";
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

app.use(cors());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "van_booking",
});

//สมัครมาชิก
app.post("/register", jsonParser, function (req, res, next) {
  connection.execute(
    "INSERT INTO user (username, password,phoneNumber,fname) VALUES (?,?,?,?)",
    [
      req.body.username,
      req.body.password,
      req.body.phoneNumber,
      req.body.fname,
      // req.body.role,
    ],

    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "INSERT SUCCESS" });
    }
  );
});

// ล็อกอิน
app.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM user LEFT JOIN driver ON user.id_user = driver.user_id WHERE username=?",
    [req.body.username],

    function (err, user, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (user.length == 0) {
        res.json({ status: "error", message: "No user found" });
        return;
      }

      if (req.body.password === user[0].password) {
        var token = jwt.sign(
          {
            username: user[0].username,
            name: user[0].name,
          },
          secret
        );

        // if (req.body.password === user[0].password) {
        //   var token = jwt.sign({ username: user[0].username }, secret);

        res.json({
          status: "ok",
          massage: "Login success",
          role: user[0].role,
          token,
          username: user[0].username,
          id_user: user[0].id_user,
          fname: user[0].fname,
          id_driver: user[0].id_driver,
          lat_user: user[0].lat_user,
          lng_user: user[0].lng_user
        });
      } else {
        res.json({ status: "error", massage: "Login failed" });
      }
    }
  );
});

//เช็คความถูกต้อง
app.post("/authen", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "err", message: err.message });
  }
});

app.get("/scheduleUser/:id_schedule", jsonParser, (req, res) => {
  connection.query(
    `SELECT * 
     FROM (schedule_detail 
     LEFT JOIN schedule ON schedule_detail.id_schedule = schedule.id_schedule) 
     LEFT JOIN driver ON schedule_detail.id_driver = driver.id_driver 
     LEFT JOIN user ON driver.user_id = user.id_user 
     LEFT JOIN status_for_driver ON schedule_detail.status = status_for_driver.id_status 
     WHERE schedule_detail.id_schedule = ? && status = '2'`,
    [req.params.id_schedule],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//ไว้เช็คว่าผู้โดยสารจองแล้วหรือยัง
app.get("/myBooking/:id_user", (req, res) => {
  connection.query(
    "SELECT * From booking_detail WHERE id_user_b = ? ",
    [req.params.id_user],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});



//แสดงตารางเวลาทั้งหมด
app.get("/schedule/:id_schedule", jsonParser, (req, res) => {
  connection.query(
    `SELECT * 
     FROM (schedule_detail 
     LEFT JOIN schedule ON schedule_detail.id_schedule = schedule.id_schedule) 
     LEFT JOIN driver ON schedule_detail.id_driver = driver.id_driver 
     LEFT JOIN user ON driver.user_id = user.id_user 
     LEFT JOIN status_for_driver ON schedule_detail.status = status_for_driver.id_status 
     WHERE schedule_detail.id_schedule = ? `,
    [req.params.id_schedule],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//บันทึกข้อมูลการจองของผู้โดยสาร
app.post("/booking", jsonParser, function (req, res, next) {
  connection.execute(
    "INSERT INTO booking_detail (id_scheduleDetail, id_user_b , number_of_seat , meeting_point , lng , lat ) VALUES (?, ? , ?, ? ,? , ? )",
    [
      req.body.id_scheduleDetail,
      req.body.id_user_b,
      req.body.number_of_seat,
      req.body.meeting_point,
      req.body.longitude,
      req.body.latitude,
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      connection.query(
        "SELECT current_seat FROM schedule_detail WHERE id_scheduleDetail = ?",
        [req.body.id_scheduleDetail],
        function (err, rows, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }

          const currentSeat = parseInt(rows[0].current_seat);
          const addseat = parseInt(req.body.number_of_seat);
          const seat = currentSeat + addseat;

          connection.query(
            "UPDATE schedule_detail SET current_seat = ?   WHERE id_scheduleDetail = ?",
            [seat, req.body.id_scheduleDetail],
            function (err, results, fields) {
              if (err) {
                res.json({ status: "error", message: err });
                return;
              }

              res.json({ status: "Booking success" });
            }
          );
        }
      );
    }
  );
});

//เพิ่มรอบ
app.post("/addRound", jsonParser, function (req, res, next) {
  //insert ข้อมูลลงในตาราง user ก่อน
  connection.execute(
    "INSERT INTO schedule_detail (id_schedule, time ) VALUES (?, ?)",
    [req.body.id_schedule, req.body.time],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "INSERT SUCCESS" });
    }
  );
});

//เพิ่มประวัติการจอง
app.post("/addRecord", jsonParser, function (req, res, next) {
  //insert ข้อมูลลงในตาราง user ก่อน
  connection.execute(
    "INSERT INTO record (id_schedule, time ) VALUES (?, ?)",
    [req.body.id_schedule, req.body.time],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "INSERT SUCCESS" });
    }
  );
});

//เปลี่ยนแปลงรอบเวลา
app.put("/updateRound/:id_scheduleDetail", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET time = ?  WHERE id_scheduleDetail = ?",
    [req.body.time, req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update round success" });
    }
  );
});

app.put("/updateUser", jsonParser, (req, res) => {
  connection.query(
    "UPDATE user SET phoneNumber = ? , fname = ? , password = ?  WHERE id_user = ?",
    [req.body.phoneNumber, req.body.fname, req.body.password, req.body.id_user],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update user success" });
    }
  );
});

//เปลี่ยนที่นั่งสููงสุด
app.put("/updateAllSeat", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET all_seat = ?  WHERE id_scheduleDetail = ?",
    [req.body.all_seat, req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update max seat success" });
    }
  );
});

//เปลี่ยนแปลงสถานะออกเดินทาง
app.put("/updateTravel", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET status_user = ? ,travel_time= ?  WHERE id_scheduleDetail = ?",
    [req.body.status_user,req.body.travel_time, req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update status_user" });
    }
  );
});

//เปลี่ยนแปลงสถานะเดินทางเสร็จสิ้น
app.put("/updateTripSuccess", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET status_user = ?  WHERE id_scheduleDetail = ?",
    [req.body.status_user, req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      connection.query(
        "UPDATE schedule_detail SET status_user = ? ,current_seat = ? WHERE id_scheduleDetail = ?",
        [1, 0, req.body.id_scheduleDetail],

        function (err, results, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }

          res.json({ status: "REGISTER SUCCESS" });
        }
      );
    }
  );
});

//ถอนรอบ
app.put("/updateCancelRound", jsonParser, (req, res) => {
  connection.query(
    "UPDATE driver SET check_driver = ?  WHERE id_driver = ?",
    [1, req.body.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      connection.query(
        "UPDATE schedule_detail SET status = ?, id_driver = ? , all_seat = ? ,current_seat = ? WHERE id_scheduleDetail = ?",
        [req.body.status, null, 14, 0, req.body.id_scheduleDetail],

        function (err, results, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }

          res.json({ status: "REGISTER SUCCESS" });
        }
      );
    }
  );
});



app.put("/updateAfterCancel", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET current_seat = current_seat - ? WHERE id_scheduleDetail = ?  ",
    [req.body.number_of_seat,req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update current_seat" });
    }
  );
});

//อัพเดทข้อมูลวัน
app.put("/updateDate", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET date = ?  ",
    [req.body.date],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update date" });
    }
  );
});

app.put("/setDefaultMarker", jsonParser, (req, res) => {
  connection.query(
    "UPDATE user SET lat_user = ? ,lng_user = ? WHERE id_user =? ",
    [req.body.lat_user ,req.body.lng_user ,req.body.id_user ],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json({ status: "Update default marker" });
    }
  );
});

//เปลี่ยนสถานะเป็นไม่ว่างรอบรถวิ่งเมื่อมีคนขับมาลงรอบ
app.put("/updateRegisConfirm", jsonParser, (req, res) => {
  connection.query(
    "UPDATE schedule_detail SET status = ?, id_driver = ? WHERE id_scheduleDetail = ?",
    [req.body.status, req.body.id_driver, req.body.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      connection.execute(
        "UPDATE driver SET check_driver = ? WHERE id_driver = ?",
        [2, req.body.id_driver],
        function (err, results, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "REGISTER SUCCESS" });
        }
      );
    }
  );
});

//ยกเลิกการจองของ user
app.delete("/cancelBooking/:id_bookingDetail", jsonParser, (req, res) => {
  connection.query(
    "DELETE FROM booking_detail WHERE id_bookingDetail = ?",
    [req.params.id_bookingDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        // res.json({ status: "cancel SUCCESS" });
        res.send(result);
      }
    }
  );
});


//ลบรอบรถ
app.delete("/delete/:id_scheduleDetail", jsonParser, (req, res) => {
  connection.query(
    "DELETE FROM schedule_detail WHERE id_scheduleDetail = ?",
    [req.params.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ลบช้อมูลการปัจจุบันจองหลังจากการเดินทางเสร็จสิ้น
app.delete("/deleteBooking/:id_scheduleDetail", jsonParser, (req, res) => {
  connection.query(
    "DELETE FROM booking_detail WHERE id_scheduleDetail = ? ",
    [req.params.id_scheduleDetail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//เพิ่ม driver
app.post("/addDriver", jsonParser, function (req, res, next) {
  //insert ข้อมูลลงในตาราง user ก่อน
  connection.execute(
    "INSERT INTO user (username, password, phoneNumber, fname, role) VALUES (?, ?, ?, ?, 'driver')",
    [
      req.body.username,
      req.body.password,
      req.body.phoneNumber,
      req.body.fname,
    ],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      // ถ้า insert ข้อมูลลงในตาราง user ได้ ให้ insert ข้อมูลลงในตาราง driver ต่อ
      connection.execute(
        "INSERT INTO driver (user_id, identificationNumber, carNumber) SELECT id_user, ?, ? FROM user WHERE username = ?",
        [req.body.identificationNumber, req.body.carNumber, req.body.username],
        function (err, results, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "INSERT SUCCESS" });
        }
      );
    }
  );
});

// แสดง driverในหน้าadmin
app.get("/user", (req, res) => {
  connection.query(
    "SELECT * From user INNER JOIN driver ON user.id_user = driver.user_id  WHERE role = 'driver'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//ดึงข้อมูลสำหรับตาราง Driver
app.get("/scheduleDriver", (req, res) => {
  connection.query(
    "SELECT * FROM schedule_detail LEFT JOIN schedule ON schedule_detail.id_schedule = schedule.id_schedule LEFT JOIN status_for_driver ON schedule_detail.status = id_status",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/scheduleUser", (req, res) => {
  connection.query(
    "SELECT * From schedule_detail LEFT JOIN schedule ON schedule_detail.id_schedule = schedule.id_schedule ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/bookingdetail/:id_user", (req, res) => {
  connection.query(
    `SELECT * 
    FROM booking_detail 
    LEFT JOIN schedule_detail ON booking_detail.id_scheduleDetail = schedule_detail.id_scheduleDetail 
    LEFT JOIN schedule ON schedule_detail.id_schedule = schedule.id_schedule 
    LEFT JOIN driver ON driver.id_driver = schedule_detail.id_driver 
    LEFT JOIN user ON driver.user_id = user.id_user 
    LEFT JOIN status_for_user ON schedule_detail.status_user = status_for_user.id_status
    WHERE booking_detail.id_user_b = ? 
    `,
    [req.params.id_user],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//เช็คว่าคนขับลงรอบไปแล้วหรือยัง
app.get("/check/:id_driver", jsonParser, (req, res) => {
  connection.query(
    "SELECT * FROM driver LEFT JOIN schedule_detail ON driver.id_driver = schedule_detail.id_driver WHERE driver.id_driver = ? ",
    [req.params.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//เช็คว่าคนขับลงรอบไหนไปแล้วบ้าง
app.get("/checkRegisterRound/:id_driver", jsonParser, (req, res) => {
  connection.query(
    "SELECT id_schedule FROM schedule_detail where id_driver = ?",
    [req.params.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ส่งข้อมูลรอบให้คนขับ
app.get("/MyRound/:id_driver", jsonParser, (req, res) => {
  connection.query(
    "SELECT * FROM schedule_detail WHERE id_driver = ?",
    [req.params.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ส่งข้อมูลรอบให้คนขับ
app.get("/customer/:id_driver", jsonParser, (req, res) => {
  connection.query(
    `SELECT * FROM booking_detail 
    LEFT JOIN schedule_detail ON booking_detail.id_scheduleDetail = schedule_detail.id_scheduleDetail
    LEFT JOIN user ON user.id_user = booking_detail.id_user_b  
    WHERE id_driver = ?`,
    [req.params.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ส่งข้อมูล user คนนั้นๆ
app.get("/userData/:id_user", jsonParser, (req, res) => {
  connection.query(
    "SELECT * FROM user WHERE id_user = ?",
    [req.params.id_user],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ส่งข้อมูล driver คนนั้นๆ
app.get("/driverData/:id_driver", jsonParser, (req, res) => {
  connection.query(
    "SELECT * FROM user LEFT JOIN driver ON user.id_user = driver.user_id WHERE id_driver = ?",
    [req.params.id_driver],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ดึงข้อมูลวันที่
app.get("/scheduleDate", jsonParser, (req, res) => {
  connection.query(
    "SELECT id_scheduleDetail,date FROM schedule_detail ",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});

//ดึงข้อมูลรอบเวลา
app.get("/checkRoundTime/:id_schedule", jsonParser, (req, res) => {
  connection.query(
    "SELECT time FROM `schedule_detail` WHERE id_schedule = ?",
    [req.params.id_schedule],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error");
      } else {
        res.send(result);
      }
    }
  );
});

//เช็ค username ว่าซ้ำไหม
app.get("/checkDuplicate/", jsonParser, (req, res) => {
  connection.query(
    "SELECT username FROM user ",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error");
      } else {
        res.send(result);
      }
    }
  );
});




app.listen(3333, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
