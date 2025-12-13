import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

    const loginWrapper = document.getElementById("loginWrapper");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const elemLoginBtn = document.getElementById("elemLoginBtn");
    const hsLoginBtn = document.getElementById("hsLoginBtn");
    const loginMsg = document.getElementById("loginMsg");

    const dashboard = document.getElementById("dashboard");
    const dashboardTitle = document.getElementById("dashboardTitle");
    const teachersGrid = document.getElementById("teachersGrid");
    const searchBar = document.getElementById("searchBar");
    const backBtn = document.getElementById("backBtn");
    const dashboardLogo = document.getElementById("dashboardLogo");

    const teacherView = document.getElementById("teacherView");
    const teacherTitle = document.getElementById("teacherTitle");
    const teacherStudentList = document.getElementById("teacherStudentList");
    const teacherBackBtn = document.getElementById("teacherBackBtn");

    const editForm = document.getElementById("editForm");
    const editStudentID = document.getElementById("editStudentID");
    const editName = document.getElementById("editName");
    const editDob = document.getElementById("editDob");
    const editAddress = document.getElementById("editAddress");
    const editGuardian = document.getElementById("editGuardian");
    const editContact = document.getElementById("editContact");
    const editStudentType = document.getElementById("editStudentType");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    let currentDept = "";
    let teachers = [];
    let editContext = { docId: null };

    const creds = { elem: { username: "elemadmin", password: "2025" }, hs: { username: "hsadmin", password: "2025" } };

    // Define teacher lists
    const elementaryTeachers = [
        { id: "G1", gradeLabel: "Grade 1", name: "Ms. Angela Ramos" },
        { id: "G2", gradeLabel: "Grade 2", name: "Mr. Carlo Dizon" },
        { id: "G3", gradeLabel: "Grade 3", name: "Ms. Jessa Ramirez" },
        { id: "G4", gradeLabel: "Grade 4", name: "Mrs. Liza Delos Reyes" },
        { id: "G5", gradeLabel: "Grade 5", name: "Mr. Albert Santos" },
        { id: "G6", gradeLabel: "Grade 6", name: "Ms. Hannah Torres" }
    ];

    const highSchoolTeachers = [
        { id: "G7O", gradeLabel: "Grade 7 - Orion", name: "Ms. Cristy Joy L. Echavez" },
        { id: "G7S", gradeLabel: "Grade 7 - Sirius", name: "Mr. Pedro G. Bag-o Jr." },
        { id: "G8A", gradeLabel: "Grade 8 - Antares", name: "Mrs. Eva V. Cuizon" },
        { id: "G8Ar", gradeLabel: "Grade 8 - Arcturus", name: "Mrs. Mary Joy V. Bardillas" },
        { id: "G9C", gradeLabel: "Grade 9 - Centaurus", name: "Mr. Daniel Gabriel B. Gornez" },
        { id: "G9P", gradeLabel: "Grade 9 - Pollux", name: "Mrs. Celerina A. Bedrijo" },
        { id: "G10A", gradeLabel: "Grade 10 - Andromeda", name: "Ms. Rowe V. Abalayan" },
        { id: "G10P", gradeLabel: "Grade 10 - Polaris", name: "Mrs. April Jane S. Balili" }
    ];

    // Login handlers
    elemLoginBtn.addEventListener("click", () => loginHandler("elem"));
    hsLoginBtn.addEventListener("click", () => loginHandler("hs"));

    function loginHandler(type) {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        if (user === creds[type].username && pass === creds[type].password) {
            loginWrapper.style.display = "none";
            dashboard.style.display = "block";
            currentDept = type === "elem" ? "elementary" : "highschool";
            dashboardTitle.innerText = type === "elem" ? "Elementary Dashboard" : "High School Dashboard";
            dashboardLogo.src = type === "elem" ? "prof.jpg" : "l0g0.png";
            teachers = type === "elem" ? [...elementaryTeachers] : [...highSchoolTeachers];
            renderTeachers();
        } else {
            loginMsg.innerText = "Invalid login!";
        }
    }

    backBtn.addEventListener("click", () => {
        dashboard.style.display = "none";
        loginWrapper.style.display = "block";
        usernameInput.value = "";
        passwordInput.value = "";
        loginMsg.innerText = "";
        dashboardLogo.src = "";
    });

    // Render teachers grid
    async function renderTeachers() {
        teachersGrid.innerHTML = "";
        for (let i = 0; i < teachers.length; i++) {
            const teacher = teachers[i];
            const count = await countStudentsByTeacher(teacher.name);
            const card = document.createElement("div");
            card.className = "teacher-card";
            card.innerHTML = `<h3>${teacher.gradeLabel} — ${teacher.name}</h3><div><strong>${count}/40</strong></div>`;
            const btn = document.createElement("button");
            btn.className = "btn small";
            btn.textContent = "View Students";
            btn.onclick = () => showTeacherView(teacher);
            card.appendChild(btn);
            teachersGrid.appendChild(card);
        }
    }

    async function countStudentsByTeacher(teacherName) {
        const q = query(collection(db, "registrations"), where("teacher", "==", teacherName));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }

    async function showTeacherView(teacher) {
        dashboard.style.display = "none";
        teacherView.style.display = "block";
        teacherTitle.innerText = `${teacher.gradeLabel} — ${teacher.name} Students`;
        await renderTeacherStudents(teacher.name);
    }

    teacherBackBtn.addEventListener("click", () => {
        teacherView.style.display = "none";
        dashboard.style.display = "block";
        renderTeachers();
    });

    async function renderTeacherStudents(teacherName) {
        teacherStudentList.innerHTML = "";
        const q = query(collection(db, "registrations"), where("teacher", "==", teacherName));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            teacherStudentList.innerHTML = '<div class="empty-state">No students assigned yet</div>';
            return;
        }

        const table = document.createElement("table");
        table.className = "student-table";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>NAME</th>
                    <th>DOB</th>
                    <th>ADDRESS</th>
                    <th>CONTACT NO.</th>
                    <th>ID</th>
                    <th>TYPE</th>
                    <th class="actions">ACTIONS</th>
                </tr>
            </thead>
            <tbody id="studentTableBody"></tbody>
        `;
        teacherStudentList.appendChild(table);
        const tbody = table.querySelector("#studentTableBody");

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${data.name}</strong></td>
                <td>${data.dob || "N/A"}</td>
                <td>${data.address || "N/A"}</td>
                <td>${data.contact || "N/A"}</td>
                <td><span style="color:#2d7cf0; font-weight:bold;">${data.studentID || "N/A"}</span></td>
                <td><em>${data.studentType || "N/A"}</em></td>
                <td class="actions"></td>
            `;
            const actionsCell = tr.querySelector(".actions");

            // Edit button
            const editBtn = document.createElement("button");
            editBtn.className = "btn small";
            editBtn.textContent = "Edit";
            editBtn.onclick = () => {
                editContext.docId = docSnap.id;
                editStudentID.value = data.studentID;
                editName.value = data.name;
                editDob.value = data.dob;
                editAddress.value = data.address;
                editGuardian.value = data.guardian;
                editContact.value = data.contact;
                editStudentType.value = data.studentType;
                editForm.style.display = "block";
            };

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn small danger";
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                if (confirm("Are you sure you want to delete this student?")) {
                    await deleteDoc(doc(db, "registrations", docSnap.id));
                    renderTeacherStudents(teacherName);
                }
            };

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            tbody.appendChild(tr);
        });
    }

    // Save edits
    saveEditBtn.addEventListener("click", async () => {
        if (!editContext.docId) return;
        const updated = {
            name: editName.value,
            dob: editDob.value,
            address: editAddress.value,
            guardian: editGuardian.value,
            contact: editContact.value,
            studentType: editStudentType.value
        };
        await updateDoc(doc(db, "registrations", editContext.docId), updated);
        editForm.style.display = "none";
        // Refresh teacher view
        const teacherName = teacherTitle.innerText.split(" — ")[1];
        renderTeacherStudents(teacherName);
    });

    cancelEditBtn.addEventListener("click", () => {
        editForm.style.display = "none";
    });

    // Optional: Search functionality
    searchBar.addEventListener("input", async () => {
        const filter = searchBar.value.toLowerCase();
        teachersGrid.querySelectorAll(".teacher-card").forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(filter) ? "" : "none";
        });
    });

});
