import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";

function Map() {
  const getLatitude = parseFloat(localStorage.getItem("lat"));
  const getLongitude = parseFloat(localStorage.getItem("lng"));
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [latitude, setLatitude] = useState(getLatitude); // ค่าละติจูดเริ่มต้น
  const [longitude, setLongitude] = useState(getLongitude); // ค่าลองจิจูดเริ่มต้น


  useEffect(() => {

  
    const loadMap = () => {
      const googleMap = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
        }
      );

      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: googleMap,
        title: "Bangkok",
      });


      setMap(googleMap);
      setMarker(marker);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;

      script.onload = loadMap;

      document.body.appendChild(script);
    } else {
      loadMap();
    }
  }, [latitude, longitude]); // เรียกใช้ useEffect เมื่อ latitude หรือ longitude เปลี่ยนแปลง
  return (
    <div>
     <div id="map" style={{ width: "100%", height: "50vh" }} />
      

    </div>
  );
}

export default Map;
