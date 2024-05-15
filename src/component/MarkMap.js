import React, { useState, useEffect } from 'react';

function MarkMap() {
  const userLat = parseFloat(localStorage.getItem('lat_user'));
  const userLng = parseFloat(localStorage.getItem('lng_user'));
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [latitude, setLatitude] = useState(userLat); // ค่าละติจูดเริ่มต้น
  const [longitude, setLongitude] = useState(userLng); // ค่าลองจิจูดเริ่มต้น

  console.log(userLat+"/"+userLng)
  useEffect(() => {
    const loadMap = () => {
      const googleMap = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: googleMap,
        title: 'Bangkok',
      });

      googleMap.addListener('click', (event) => {
        const clickedLocation = event.latLng;
        const clickedLat = clickedLocation.lat();
        const clickedLng = clickedLocation.lng();
        
        // console.log('Clicked Latitude:', clickedLat);
        // console.log('Clicked Longitude:', clickedLng);
        setLatitude(clickedLat);
        setLongitude(clickedLng);
        setMarkerPosition();
        // ส่งค่าตำแหน่งที่เลือกไปยังคอมโพเนนต์อื่น ๆ โดยเรียกใช้ prop onLocationChange
        localStorage.setItem('lastClickedLocation', JSON.stringify({ latitude: clickedLat, longitude: clickedLng }));

      });

      setMap(googleMap);
      setMarker(marker);
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;

      script.onload = loadMap;

      document.body.appendChild(script);
    } else {
      loadMap();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลล่าสุดใน localStorage หรือไม่
    const lastClickedLocation = localStorage.getItem('lastClickedLocation');
    if (lastClickedLocation) {
      const { latitude, longitude } = JSON.parse(lastClickedLocation);
      // อัพเดตค่าละติจูดและลองจิจูด
      setLatitude(latitude);
      setLongitude(longitude);
    }
  }, []);
  

  // ฟังก์ชันสำหรับปรับตำแหน่งของมาร์คเกอร์บนแผนที่
  const setMarkerPosition = () => {
    if (marker) {
      marker.setPosition({ lat: latitude, lng: longitude }); // อัพเดตตำแหน่งของมาร์คเกอร์
      console.log("check")
    }
  };
  

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }} />
      {/* <div>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
      </div> */}
    </div>
  );
}

export default MarkMap;

