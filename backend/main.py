import cv2
import face_recognition
import csv
from datetime import datetime
from face_utils import load_known_faces

known_encodings, known_names, known_roles, known_years = load_known_faces()

cap = cv2.VideoCapture(0)
marked_today = set()

while True:
    ret, frame = cap.read()
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    locations = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, locations)

    for encoding, location in zip(encodings, locations):
        matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.5)

        if True in matches:
            idx = matches.index(True)
            name = known_names[idx]
            role = known_roles[idx]
            year = known_years[idx]

            key = f"{name}-{datetime.now().date()}"
            if key not in marked_today:
                entry_type = input(f"{name} (IN/OUT): ").upper()
                time = datetime.now().strftime("%H:%M:%S")

                file = "data/staff_attendance.csv" if role == "staff" else "data/student_attendance.csv"

                with open(file, "a", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerow([name, role, year, entry_type, time])

                marked_today.add(key)
                print(f"[MARKED] {name} {entry_type} at {time}")

        top, right, bottom, left = location
        cv2.rectangle(frame, (left, top), (right, bottom), (0,255,0), 2)

    cv2.imshow("Smart Attendance", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
