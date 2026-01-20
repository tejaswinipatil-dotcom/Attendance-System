import React, { useRef, useState } from "react";

function FaceAttendance({ setRecords }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  // 🎥 Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraStarted(true);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // 📸 Capture Face (THIS WAS MISSING / BROKEN)
  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      alert("Camera not ready");
      return;
    }

    if (video.videoWidth === 0) {
      alert("Please wait for camera to load");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setImageSrc(canvas.toDataURL("image/jpeg"));
  };

  // ✅ Mark Attendance
  const markAttendance = async (type) => {
    if (!imageSrc) {
      alert("Please capture face first");
      return;
    }

    const blob = await fetch(imageSrc).then((r) => r.blob());

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

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

    setRecords((prev) => [...prev, res]);
    alert(`${res.role} ${res.name} marked ${res.type} at ${res.time}`);
  };

  return (
  <div
    style={{
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
    }}
  >
    <video
      ref={videoRef}
      autoPlay
      width="320"
      height="240"
      style={{
        borderRadius: "12px",
        background: "#000",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    />

    <canvas ref={canvasRef} style={{ display: "none" }} />

    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureFace} disabled={!cameraStarted}>
        Capture Face
      </button>
    </div>

    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={() => markAttendance("IN")}>IN-Time</button>
      <button onClick={() => markAttendance("OUT")}>OUT-Time</button>
    </div>
  </div>

  );
}

export default FaceAttendance;
