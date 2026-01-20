from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import os
import numpy as np
from PIL import Image
import io
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

KNOWN_DIR = "backend/known_faces/student"

@app.post("/face-attendance")
async def face_attendance(type: str, file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(image)

    encodings = face_recognition.face_encodings(img_np)
    if not encodings:
        raise HTTPException(status_code=400, detail="No face detected")

    unknown = encodings[0]

    if not os.path.exists(KNOWN_DIR):
        raise HTTPException(status_code=500, detail="Known faces folder missing")

    for fname in os.listdir(KNOWN_DIR):
        path = os.path.join(KNOWN_DIR, fname)
        known_img = face_recognition.load_image_file(path)
        known_enc = face_recognition.face_encodings(known_img)

        if not known_enc:
            continue

        match = face_recognition.compare_faces([known_enc[0]], unknown)
        if match[0]:
            return {
                "role": "Student",
                "name": os.path.splitext(fname)[0],
                "year": "",
                "type": type,
                "time": datetime.now().strftime("%H:%M:%S")
            }

    raise HTTPException(status_code=404, detail="Face not recognized")
