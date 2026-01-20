import React, { useState } from "react";
import { markAttendance } from "../services/api";

export default function StaffAttendance({ setRecords }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("IN");

  const submit = async () => {
    const data = {
      role: "Staff",
      name,
      year: "NA",
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
      <h2>Staff Attendance</h2>

      <input
        placeholder="Staff Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select onChange={e => setType(e.target.value)}>
        <option value="IN">In-Time</option>
        <option value="OUT">Exit-Time</option>
      </select>

      <button onClick={submit}>Submit</button>
    </div>
  );
}
