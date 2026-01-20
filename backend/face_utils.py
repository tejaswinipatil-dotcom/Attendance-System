import face_recognition
import os

def load_known_faces():
    encodings = []
    names = []
    roles = []
    years = []

    base_path = "known_faces"

    for role in os.listdir(base_path):
        role_path = os.path.join(base_path, role)

        if role == "staff":
            for img in os.listdir(role_path):
                image = face_recognition.load_image_file(f"{role_path}/{img}")
                encoding = face_recognition.face_encodings(image)[0]
                encodings.append(encoding)
                names.append(img.split(".")[0])
                roles.append("staff")
                years.append("NA")

        else:  # students
            for year in os.listdir(role_path):
                year_path = os.path.join(role_path, year)
                for img in os.listdir(year_path):
                    image = face_recognition.load_image_file(f"{year_path}/{img}")
                    encoding = face_recognition.face_encodings(image)[0]
                    encodings.append(encoding)
                    names.append(img.split(".")[0])
                    roles.append("student")
                    years.append(year)

    return encodings, names, roles, years
