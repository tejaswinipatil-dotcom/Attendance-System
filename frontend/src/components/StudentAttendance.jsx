import React, { useState } from "react";
import { markAttendance } from "../services/api";

export default function StudentAttendance({ setRecords }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("1");
  const [type, setType] = useState("IN");

  const submit = async () => {
    const data = {
      role: "Student",
      name,
      year,
      type
    };

    try {
      const res = await markAttendance(data);

      if (res) {
        setRecords(prev => [...prev, res]);
      }
    } catch (err) {
      alert("Attendance failed");
      console.error(err);
    }

    setName("");
  };

  return (
    <div>
      <h2>Student Attendance</h2>

      <input
        placeholder="Student Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select onChange={e => setYear(e.target.value)}>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <select onChange={e => setType(e.target.value)}>
        <option value="IN">In-Time</option>
        <option value="OUT">Exit-Time</option>
      </select>

      <button onClick={submit}>Submit</button>
    </div>
  );
}
