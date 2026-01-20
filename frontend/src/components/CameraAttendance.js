import React, { useRef, useState } from "react";

function FaceAttendance({ setRecords }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Capture image
  const captureFace = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setImageSrc(canvas.toDataURL("image/jpeg"));
  };

  // MARK ATTENDANCE (FIXED)
  
  const markAttendance = async (type) => {
    if (!imageSrc) {
      alert("Please capture face first");
      return;
    }

    const blob = await fetch(imageSrc).then((r) => r.blob());

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg"); // ✅ FIXED

    const response = await fetch(
      `http://127.0.0.1:8000/face-attendance?type=${type}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const res = await response.json();

    if (!response.ok) {
      alert(res.detail || "Attendance failed");
      return;
    }

    // ✅ ADD RECORD TO TABLE
    setRecords((prev) => [...prev, res]);

    alert(`${res.role} ${res.name} marked ${res.type} at ${res.time}`);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="300" />
      <br />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureFace}>Capture Face</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => markAttendance("IN")}>IN-Time</button>
        <button onClick={() => markAttendance("OUT")}>OUT-Time</button>
      </div>
    </div>
  );
}

export default FaceAttendance;
