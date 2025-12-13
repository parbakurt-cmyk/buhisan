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
    let editContext = {tIndex:null, sIndex:null};

    const elementaryTeachers = [
        { id: "G1", gradeLabel: "Grade 1", name: "Ms. Angela Ramos", students: [] },
        { id: "G2", gradeLabel: "Grade 2", name: "Mr. Carlo Dizon", students: [] },
        { id: "G3", gradeLabel: "Grade 3", name: "Ms. Jessa Ramirez", students: [] },
        { id: "G4", gradeLabel: "Grade 4", name: "Mrs. Liza Delos Reyes", students: [] },
        { id: "G5", gradeLabel: "Grade 5", name: "Mr. Albert Santos", students: [] },
        { id: "G6", gradeLabel: "Grade 6", name: "Ms. Hannah Torres", students: [] }
    ];

    const highSchoolTeachers = [
        { id: "G7O", gradeLabel: "Grade 7 - Orion", name: "Ms. Cristy Joy L. Echavez", students: [] },
        { id: "G7S", gradeLabel: "Grade 7 - Sirius", name: "Mr. Pedro G. Bag-o Jr.", students: [] },
        { id: "G8A", gradeLabel: "Grade 8 - Antares", name: "Mrs. Eva V. Cuizon", students: [] },
        { id: "G8Ar", gradeLabel: "Grade 8 - Arcturus", name: "Mrs. Mary Joy V. Bardillas", students: [] },
        { id: "G9C", gradeLabel: "Grade 9 - Centaurus", name: "Mr. Daniel Gabriel B. Gornez", students: [] },
        { id: "G9P", gradeLabel: "Grade 9 - Pollux", name: "Mrs. Celerina A. Bedrijo", students: [] },
        { id: "G10A", gradeLabel: "Grade 10 - Andromeda", name: "Ms. Rowe V. Abalayan", students: [] },
        { id: "G10P", gradeLabel: "Grade 10 - Polaris", name: "Mrs. April Jane S. Balili", students: [] }
    ];

    const creds = {elem:{username:"elemadmin", password:"2025"}, hs:{username:"hsadmin", password:"2025"}};

    // Elementary login
    elemLoginBtn.addEventListener("click", ()=>{
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        if(user===creds.elem.username && pass===creds.elem.password){
            loginWrapper.style.display="none";
            dashboard.style.display="block";
            dashboardTitle.innerText="Elementary Dashboard";
            currentDept="elementary";
            teachers = JSON.parse(JSON.stringify(elementaryTeachers));
            dashboardLogo.src = "prof.jpg";
            loadData();
            renderTeachers();
        } else { loginMsg.innerText="Invalid login!"; }
    });

    // High School login
    hsLoginBtn.addEventListener("click", ()=>{
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        if(user===creds.hs.username && pass===creds.hs.password){
            loginWrapper.style.display="none";
            dashboard.style.display="block";
            dashboardTitle.innerText="High School Dashboard";
            currentDept="highschool";
            teachers = JSON.parse(JSON.stringify(highSchoolTeachers));
            dashboardLogo.src = "l0g0.png";
            loadData();
            renderTeachers();
        } else { loginMsg.innerText="Invalid login!"; }
    });

    function loadData(){
        const saved = JSON.parse(localStorage.getItem(currentDept))||[];
        teachers.forEach(t=>{
            const found = saved.find(s=>s.id===t.id);
            t.students = found?found.students:[];
        });
    }

    function saveData(){
        const toSave = teachers.map(t=>({id:t.id,students:t.students}));
        localStorage.setItem(currentDept,JSON.stringify(toSave));
    }

    function renderTeachers(){
        teachersGrid.innerHTML="";
        teachers.forEach((t,tIndex)=>{
            const card = document.createElement("div");
            card.className="teacher-card";
            card.innerHTML=`<h3>${t.gradeLabel} — ${t.name}</h3><div><strong>${t.students.length}/40</strong></div>`;
            const btn = document.createElement("button");
            btn.className="btn small";
            btn.textContent="View Students";
            btn.onclick = ()=>showTeacherView(tIndex);
            card.appendChild(btn);
            teachersGrid.appendChild(card);
        });
        saveData();
    }

    function showTeacherView(tIndex){
        const teacher = teachers[tIndex];
        dashboard.style.display="none";
        teacherView.style.display="block";
        teacherTitle.innerText=`${teacher.gradeLabel} — ${teacher.name} Students`;
        renderTeacherStudents(teacher,tIndex);
    }

    function renderTeacherStudents(teacher,tIndex){
        teacherStudentList.innerHTML = "";
        
        if(teacher.students.length === 0){
            teacherStudentList.innerHTML = '<div class="empty-state">No students assigned yet</div>';
            return;
        }

        // Create table
        const table = document.createElement("table");
        table.className = "student-table";
        
        // Table header
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
        const tbody = document.getElementById("studentTableBody");

        // Add student rows
        teacher.students.forEach((s, sIdx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td>${s.dob || "N/A"}</td>
                <td>${s.address || "N/A"}</td>
                <td>${s.contact || "N/A"}</td>
                <td><span style="color:#2d7cf0; font-weight:bold;">${s.id || "N/A"}</span></td>
                <td><em>${s.studentType || "N/A"}</em></td>
                <td class="actions"></td>
            `;
            
            // Create buttons separately to avoid innerHTML issues
            const actionsCell = tr.querySelector('.actions');
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn small';
            editBtn.textContent = 'Edit';
            editBtn.setAttribute('data-t', tIndex);
            editBtn.setAttribute('data-s', sIdx);
            editBtn.setAttribute('data-action', 'edit');
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn small danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.setAttribute('data-t', tIndex);
            deleteBtn.setAttribute('data-s', sIdx);
            deleteBtn.setAttribute('data-action', 'delete');
            
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            
            tbody.appendChild(tr);
        });

        // Add event listeners
        tbody.querySelectorAll("button").forEach(btn => {
            btn.onclick = ()=>{
                const tI = parseInt(btn.dataset.t);
                const sI = parseInt(btn.dataset.s);
                const action = btn.dataset.action;
                if(action==="delete"){
                    if(confirm("Are you sure you want to delete this student?")){
                        teachers[tI].students.splice(sI,1);
                        saveData();
                        renderTeacherStudents(teachers[tI], tI);
                    }
                } else if(action==="edit"){
                    editContext = {tIndex:tI, sIndex:sI};
                    const s = teachers[tI].students[sI];
                    editStudentID.value = s.id || "";
                    editName.value = s.name;
                    editDob.value = s.dob || "";
                    editAddress.value = s.address || "";
                    editGuardian.value = s.guardian || "";
                    editContact.value = s.contact || "";
                    editStudentType.value = s.studentType || "";
                    editForm.style.display = "block";
                }
            }
        });
    }

    teacherBackBtn.addEventListener("click", ()=>{
        teacherView.style.display="none";
        dashboard.style.display="block";
        renderTeachers();
    });

    backBtn.addEventListener("click", ()=>{
        dashboard.style.display="none";
        loginWrapper.style.display="block";
        usernameInput.value="";
        passwordInput.value="";
        loginMsg.innerText="";
        dashboardLogo.src="";
    });

    saveEditBtn.addEventListener("click", ()=>{
        const {tIndex,sIndex} = editContext;
        teachers[tIndex].students[sIndex] = {
            id: editStudentID.value,
            name: editName.value,
            dob: editDob.value,
            address: editAddress.value,
            guardian: editGuardian.value,
            contact: editContact.value,
            studentType: editStudentType.value
        };
        saveData();
        editForm.style.display="none";
        renderTeacherStudents(teachers[tIndex], tIndex);
    });

    cancelEditBtn.addEventListener("click", ()=>{ editForm.style.display="none"; });

    searchBar.addEventListener("input", ()=>{
        const filter = searchBar.value.toLowerCase();
        teachersGrid.querySelectorAll(".teacher-card").forEach(card=>{
            const cardIndex = Array.from(teachersGrid.children).indexOf(card);
            const teacher = teachers[cardIndex];
            
            // Search in student names
            const hasMatchingStudent = teacher.students.some(student => 
                student.name.toLowerCase().includes(filter)
            );
            
            // Also search in teacher/grade label as fallback
            const teacherText = card.innerText.toLowerCase();
            
            // Show card if student name matches OR if search is empty OR if teacher/grade matches
            card.style.display = (hasMatchingStudent || teacherText.includes(filter) || filter === "") ? "" : "none";
        });
    });

});