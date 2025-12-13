document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const message = document.getElementById("message");
    const studentIDField = document.getElementById("studentID");

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

    // Generate a random student ID in format BH-123456
    function generateStudentID() {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `BH-${randomNum}`;
    }

    // Check if student ID already exists across both departments
    function isIDUnique(id) {
        const elemData = JSON.parse(localStorage.getItem("elementary")) || [];
        const hsData = JSON.parse(localStorage.getItem("highschool")) || [];
        
        for (let t of elemData) {
            if (t.students && t.students.some(s => s.id === id)) return false;
        }
        for (let t of hsData) {
            if (t.students && t.students.some(s => s.id === id)) return false;
        }
        return true;
    }

    // Generate unique student ID
    function generateUniqueStudentID() {
        let id;
        do {
            id = generateStudentID();
        } while (!isIDUnique(id));
        return id;
    }

    registerBtn.addEventListener("click", () => {
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
            studentIDField.value = "";
            return;
        }

        // Generate unique student ID
        const studentID = generateUniqueStudentID();

        // Determine department
        let dept = grade <= 6 ? "elementary" : "highschool";
        let teachers = grade <= 6 ? elementaryTeachers : highSchoolTeachers;

        // Pick teacher
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

        // Load saved data from localStorage
        let saved = JSON.parse(localStorage.getItem(dept)) || [];
        let tData = saved.find(t => t.id === teacher.id);
        if (!tData) {
            tData = { id: teacher.id, students: [] };
            saved.push(tData);
        }

        // Add student with generated ID
        tData.students.push({
            id: studentID,
            name,
            dob,
            address,
            guardian,
            contact,
            studentType
        });        

        localStorage.setItem(dept, JSON.stringify(saved));

        // Display success message with student ID
        message.style.color = "green";
        message.innerText = `Successfully Enrolled!`;
        studentIDField.value = studentID;

        // Clear other form fields but keep the ID visible
        document.getElementById("name").value = "";
        document.getElementById("dob").value = "";
        document.getElementById("address").value = "";
        document.getElementById("guardian").value = "";
        document.getElementById("contact").value = "";
        document.getElementById("grade").value = "";
        document.getElementById("studentType").value = "";
    });
});