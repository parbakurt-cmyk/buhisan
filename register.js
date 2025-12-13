import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJ8MmtD9GuQ7Qp1qfbqmK_EtNPpMG8W1g",
  authDomain: "enrolless.firebaseapp.com",
  projectId: "enrolless",
  storageBucket: "enrolless.firebasestorage.app",
  messagingSenderId: "934026913526",
  appId: "1:934026913526:web:fd30cd4a136b0e8a346ed7",
  measurementId: "G-4TBHV5VV6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const message = document.getElementById("message");

    // Teachers mapping remains the same
    const elementaryTeachers = [
        { id: "G1", name: "Ms. Angela Ramos" },
        { id: "G2", name: "Mr. Carlo Dizon" },
        { id: "G3", name: "Ms. Jessa Ramirez" },
        { id: "G4", name: "Mrs. Liza Delos Reyes" },
        { id: "G5", name: "Mr. Albert Santos" },
        { id: "G6", name: "Ms. Hannah Torres" }
    ];

    const highSchoolTeachers = [
        { id: "G7O", name: "Ms. Cristy Joy L. Echavez" },
        { id: "G7S", name: "Mr. Pedro G. Bag-o Jr." },
        { id: "G8A", name: "Mrs. Eva V. Cuizon" },
        { id: "G8Ar", name: "Mrs. Mary Joy V. Bardillas" },
        { id: "G9C", name: "Mr. Daniel Gabriel B. Gornez" },
        { id: "G9P", name: "Mrs. Celerina A. Bedrijo" },
        { id: "G10A", name: "Ms. Rowe V. Abalayan" },
        { id: "G10P", name: "Mrs. April Jane S. Balili" }
    ];

    function generateStudentID() {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `BH-${randomNum}`;
    }

    registerBtn.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const dob = document.getElementById("dob").value;
        const address = document.getElementById("address").value.trim();
        const guardian = document.getElementById("guardian").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const grade = parseInt(document.getElementById("grade").value);
        const studentType = document.getElementById("studentType").value;

        if (!name || !dob || !address || !guardian || !contact || !grade || !studentType) {
            message.style.color = "red";
            message.innerText = "Please fill in all fields.";
            return;
        }

        const studentID = generateStudentID();

        // Assign teacher
        let dept = grade <= 6 ? "elementary" : "highschool";
        let teachers = grade <= 6 ? elementaryTeachers : highSchoolTeachers;

        let teacher;
        if (dept === "elementary") {
            teacher = teachers.find(t => t.id === "G" + grade);
        } else {
            const mapping = {
                7: ["G7O", "G7S"],
                8: ["G8A", "G8Ar"],
                9: ["G9C", "G9P"],
                10: ["G10A", "G10P"]
            };
            const ids = mapping[grade];
            const id = ids[Math.floor(Math.random() * ids.length)];
            teacher = teachers.find(t => t.id === id);
        }

        // Save student in Firebase
        try {
            await addDoc(collection(db, "registrations"), {
                studentID,
                name,
                dob,
                address,
                guardian,
                contact,
                grade,
                studentType,
                department: dept,
                teacher: teacher.name,
                dateRegistered: new Date()
            });
            message.style.color = "green";
            message.innerText = `Successfully Enrolled! Your ID: ${studentID}`;

            // Clear fields
            document.getElementById("name").value = "";
            document.getElementById("dob").value = "";
            document.getElementById("address").value = "";
            document.getElementById("guardian").value = "";
            document.getElementById("contact").value = "";
            document.getElementById("grade").value = "";
            document.getElementById("studentType").value = "";
        } catch (error) {
            console.error("Error saving student: ", error);
            message.style.color = "red";
            message.innerText = "Failed to enroll. Try again.";
        }
    });
});
