import React, { useState } from "react";
import FaceAttendance from "./components/FaceAttendance";
import AttendanceTable from "./components/AttendanceTable";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);

  return (
    <div className="container">
      <h1 className="title">Smart Attendance System</h1>

      <div className="card">
        <FaceAttendance setRecords={setRecords} />
      </div>

      <div className="card">
        <AttendanceTable records={records} />
      </div>
    </div>
  );
}

export default App;
