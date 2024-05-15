import React,{useEffect,useState} from "react";
import "../css/waiting.css";
 // นำเข้าไฟล์ CSS ที่มีโค้ด spinner

function Waiting() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  ) : null;
}

export default Waiting;
