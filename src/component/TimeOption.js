import { useState, useEffect } from "react";
import React from "react";
import Axios from "axios";

function TimeOptions() {
  const options = [];
  const [time, setTime] = useState([]);

  useEffect(() => {
    getRoundTime();
  }, []);

  // useEffect(() => {
  //   console.log(time[0]);

  // }, [time]);

  const getRoundTime = () => {
    const a = 1;
    Axios.get(`http://localhost:3333/checkRoundTime/${a}`).then((response) => {
      setTime(response.data);
      
    });
  };

  for (let hour = 5; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      for (let second = 0; second < 60; second += 60) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const formattedSecond = second.toString().padStart(2, "0");
        const timeString = `${formattedHour}:${formattedMinute}`;

        console.log(parseInt(time[0]));
        if (time[0] !== timeString) {
          console.log("dsfkd"+timeString);
          options.push(<option key={timeString} value={timeString}>{timeString}</option>);
        }
      }
    }
  }
  console.log(options);
  return options;
}

export default TimeOptions;
