const API_URL = "http://127.0.0.1:8000";

/* -----------------------------
   1️⃣ MARK ATTENDANCE (JSON)
-------------------------------- */
export async function markAttendance(data) {
  try {
    const response = await fetch(`${API_URL}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Attendance backend error:", text);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Attendance network error:", error);
    return null;
  }
}

/* -----------------------------
   2️⃣ FACE RECOGNITION (IMAGE)
-------------------------------- */
export async function recognizeFace(file, type) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_URL}/face-recognition?type=${type}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Face recognition error:", text);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Face recognition network error:", error);
    return null;
  }
}
