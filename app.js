/* ════════════════════════════════════════════════════════════
   CORE STRUCTURAL STATE ARRAYS
   ════════════════════════════════════════════════════════════ */
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const THEORY_TIMES = ["08:00-08:50", "09:00-09:50", "10:00-10:50", "11:00-11:50", "12:00-12:50", "01:30-02:20", "02:30-03:20", "03:30-04:20", "04:30-05:20", "05:30-06:20"];
const LAB_TIMES = ["L1-L2", "L3-L4", "L5-L6", "L7-L8", "L9-L10", "L11-L12", "L31-L32", "L33-L34", "L35-L36", "L37-L38", "L39-L40", "L41-L42"];

// FFCS Matrix mapping layout representation
const FFCS_MATRIX = [
    [{t:"A1",l:"L1"}, {t:"F1",l:"L2"}, {t:"D1",l:"L3"}, {t:"TB1",l:"L4"}, {t:"TG1",l:"L5"}, {l:"L6"}, "LUNCH", {t:"A2",l:"L31"}, {t:"F2",l:"L32"}, {t:"D2",l:"L33"}, {t:"TB2",l:"L34"}, {t:"TG2",l:"L35"}, {l:"L36"}, {t:"V3",l:"X1"}],
    [{t:"B1",l:"L7"}, {t:"G1",l:"L8"}, {t:"E1",l:"L9"}, {t:"TC1",l:"L10"}, {t:"TAA1",l:"L11"}, {l:"L12"}, "LUNCH", {t:"B2",l:"L37"}, {t:"G2",l:"L38"}, {t:"E2",l:"L39"}, {t:"TC2",l:"L40"}, {t:"TAA2",l:"L41"}, {l:"L42"}, {t:"V4",l:"X2"}],
    [{t:"C1",l:"L13"}, {t:"A1",l:"L14"}, {t:"F1",l:"L15"}, {t:"TD1",l:"L16"}, {t:"TBB1",l:"L17"}, {l:"L18"}, "LUNCH", {t:"C2",l:"L43"}, {t:"A2",l:"L44"}, {t:"F2",l:"L45"}, {t:"TD2",l:"L46"}, {t:"TBB2",l:"L47"}, {l:"L48"}, {t:"V5",l:"X3"}],
    [{t:"D1",l:"L19"}, {t:"B1",l:"L20"}, {t:"G1",l:"L21"}, {t:"TE1",l:"L22"}, {t:"TCC1",l:"L23"}, {l:"L24"}, "LUNCH", {t:"D2",l:"L49"}, {t:"B2",l:"L50"}, {t:"G2",l:"L51"}, {t:"TE2",l:"L52"}, {t:"TCC2",l:"L53"}, {l:"L54"}, {t:"V6",l:"X4"}],
    [{t:"E1",l:"L25"}, {t:"C1",l:"L26"}, {t:"B1",l:"L27"}, {t:"TF1",l:"L28"}, {t:"TDD1",l:"L29"}, {l:"L30"}, "LUNCH", {t:"E2",l:"L55"}, {t:"C2",l:"L56"}, {t:"B2",l:"L57"}, {t:"TF2",l:"L58"}, {t:"TDD2",l:"L59"}, {l:"L60"}, {t:"V7",l:"X5"}]
];

// Pre-seeded Database Repositories
const NPTEL_DATA = [
    { id: 1, title: "Data Structures And Algorithms Using Java", weeks: 12, questions: 150 },
    { id: 2, title: "Database Management System", weeks: 8, questions: 120 },
    { id: 3, title: "Computer Networks", weeks: 12, questions: 180 },
    { id: 4, title: "Introduction to Automata, Languages and Computation", weeks: 12, questions: 140 },
    { id: 5, title: "Software Engineering", weeks: 8, questions: 100 }
];

const PYQ_DATA = [
    // Computer Science Core
    { code: "CSE2001", name: "Computer Architecture and Organization", type: "CAT1", year: 2024, slot: "A1+TA1" },
    { code: "CSE2001", name: "Computer Architecture and Organization", type: "CAT2", year: 2024, slot: "A1+TA1" },
    { code: "CSE2001", name: "Computer Architecture and Organization", type: "FAT", year: 2023, slot: "A2+TA2" },
    { code: "CSE1007", name: "Java Programming", type: "FAT", year: 2023, slot: "L11+L12" },
    { code: "CSE1007", name: "Java Programming", type: "CAT1", year: 2024, slot: "L31+L32" },
    { code: "CSE2003", name: "Data Structures and Algorithms", type: "CAT2", year: 2024, slot: "E2+TE2" },
    { code: "CSE2003", name: "Data Structures and Algorithms", type: "FAT", year: 2023, slot: "E1+TE1" },
    { code: "CSE2005", name: "Operating Systems", type: "CAT1", year: 2023, slot: "B1+TB1" },
    { code: "CSE2004", name: "Database Management Systems", type: "FAT", year: 2024, slot: "B2+TB2" },
    { code: "CSE3002", name: "Compiler Design", type: "FAT", year: 2022, slot: "D2+TD2" },
    { code: "CSE3001", name: "Software Engineering", type: "CAT2", year: 2023, slot: "F1+TF1" },
    { code: "CSE4001", name: "Internet of Things", type: "FAT", year: 2021, slot: "V1" },
    { code: "CSE2006", name: "Microprocessor and Interfacing", type: "CAT1", year: 2023, slot: "D2+TD2" },
    { code: "CSE3006", name: "Embedded System Design", type: "FAT", year: 2022, slot: "E1+TE1" },
    { code: "CSE1002", name: "Problem Solving and OOP", type: "CAT1", year: 2024, slot: "L1+L2" },
    { code: "CSE2013", name: "Theory of Computation", type: "FAT", year: 2024, slot: "C1+TC1" },
    { code: "CSE3501", name: "Information Security Analysis", type: "CAT1", year: 2024, slot: "F2+TF2" },
    { code: "CSE2011", name: "Cyber Security", type: "FAT", year: 2024, slot: "V5" },
    { code: "CSE1004", name: "Network and Communication", type: "FAT", year: 2023, slot: "G1+TG1" },
    { code: "CSE3005", name: "Foundations of Data Analytics", type: "CAT1", year: 2024, slot: "A2+TA2" },
    { code: "CSE4001", name: "Parallel and Distributed Computing", type: "CAT2", year: 2023, slot: "B1+TB1" },
    { code: "CSE1006", name: "Blockchain and Cryptocurrency", type: "FAT", year: 2024, slot: "E1+TE1" },
    { code: "CSE4019", name: "Digital Image Processing", type: "CAT1", year: 2023, slot: "G2+TG2" },
    { code: "CSE4015", name: "Human Computer Interaction", type: "FAT", year: 2022, slot: "V3" },
    
    // Mathematics
    { code: "MAT2001", name: "Statistics for Engineers", type: "CAT2", year: 2024, slot: "C1+TC1" },
    { code: "MAT1011", name: "Calculus for Engineers", type: "CAT1", year: 2024, slot: "D1+TD1" },
    { code: "MAT2002", name: "Discrete Mathematics", type: "CAT2", year: 2024, slot: "C2+TC2" },
    { code: "MAT3004", name: "Applied Linear Algebra", type: "CAT1", year: 2023, slot: "A1+TA1" },
    { code: "MAT1011", name: "Calculus for Engineers", type: "FAT", year: 2023, slot: "D2+TD2" },
    { code: "MAT3003", name: "Probability and Statistics", type: "CAT1", year: 2024, slot: "F1+TF1" },
    { code: "MAT3005", name: "Differential Equations", type: "FAT", year: 2023, slot: "G1+TG1" },
    
    // General Sciences
    { code: "PHY1701", name: "Engineering Physics", type: "CAT1", year: 2022, slot: "A2+TA2" },
    { code: "CHY1701", name: "Engineering Chemistry", type: "CAT1", year: 2022, slot: "E2+TE2" },
    { code: "PHY1901", name: "Introduction to Innovative Projects", type: "FAT", year: 2023, slot: "V1" },
    
    // Humanities & Management
    { code: "STS2001", name: "Reasoning Skill Enhancement", type: "FAT", year: 2023, slot: "V3" },
    { code: "MGT1022", name: "Lean Start-up Management", type: "CAT2", year: 2022, slot: "B1+TB1" },
    { code: "ENG1901", name: "Advanced Technical English", type: "CAT2", year: 2024, slot: "V6" },
    { code: "HUM1021", name: "Ethics and Values", type: "FAT", year: 2022, slot: "V2" },
    
    // Electives
    { code: "ECE1001", name: "Fundamentals of ECE", type: "CAT1", year: 2024, slot: "G1+TG1" },
    { code: "EEE1001", name: "Basic Electrical Engineering", type: "FAT", year: 2023, slot: "B1+TB1" },
    { code: "ECE2002", name: "Digital Logic Design", type: "CAT1", year: 2024, slot: "D2+TD2" },
    { code: "BIT1001", name: "Introduction to Bio-Sciences", type: "FAT", year: 2023, slot: "V4" }
];

// Application State Parameters
let savedPlacements = JSON.parse(localStorage.getItem('eduhub_ffcs_slots')) || [];
let currentQuizTarget = null;
let currentQuizViewMode = "week";
let selectedTargetCell = null;

/* ════════════════════════════════════════════════════════════
   CORE STRUCTURAL ENGINE INITIALIZATION
   ════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    initCursor();
    initTimetableStructure();
    renderTimetableData();
    initCgpaDefaultRows();
    renderNptelGrid();
    renderPyqGrid();
    setupPyqFilters();
    initModalClosers();
});

/* --- Luxury Cursor Logic --- */
function initCursor() {
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursor-trail");

    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
        trail.style.left = x + "px";
        trail.style.top = y + "px";
    });

    // Toggle active state classes based on interactive element proximity
    document.addEventListener("mouseover", (e) => {
        const isInteractive = e.target.closest("a, button, .hcard, .tool-card, .slot-cell, .pf-btn, .nptel-card, .opt-item, .week-block, input, select");
        cursor.classList.toggle("cursor-active", !!isInteractive);
        trail.classList.toggle("trail-active", !!isInteractive);
    });
}

/* --- Section Switching Engine --- */
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(`sec-${sectionId}`).classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════════════
   MODULE 01 ENGINE: AUTOMATED FFCS COUPLING
   ════════════════════════════════════════════════════════════ */
function initTimetableStructure() {
    const table = document.getElementById("timetable");
    table.innerHTML = "";

    // Generate Double Headers
    let h1 = `<tr class="h-theory"><th rowspan="2">Day</th>`;
    THEORY_TIMES.forEach((time, index) => {
        if(index === 6) h1 += `<th rowspan="2" class="lunch-col">LUNCH</th>`;
        h1 += `<th>${time}</th>`;
    });
    h1 += `<th>V-Slots</th></tr>`;

    let h2 = `<tr class="h-lab">`;
    LAB_TIMES.forEach(lab => h2 += `<th>${lab}</th>`);
    h2 += `</tr>`;

    table.innerHTML = h1 + h2;

    // Process Day Row Layouts
    FFCS_MATRIX.forEach((dayRow, dayIndex) => {
        let rowHtml = `<tr><td class="day-label">${DAYS[dayIndex]}</td>`;
        dayRow.forEach(cell => {
            if(cell === "LUNCH") {
                rowHtml += `<td class="lunch-col"></td>`;
            } else {
                rowHtml += `<td class="slot-cell" data-t="${cell.t || ''}" data-l="${cell.l || ''}" onclick="handleCellClick(this)"></td>`;
            }
        });
        table.innerHTML += rowHtml + "</tr>";
    });
}

function renderTimetableData() {
    document.querySelectorAll(".slot-cell").forEach(cell => {
        const slotT = cell.getAttribute("data-t");
        const slotL = cell.getAttribute("data-l");
        
        const matchingData = savedPlacements.find(item => 
            (slotT && item.slot === slotT) || (slotL && item.slot === slotL)
        );

        if(matchingData) {
            cell.classList.add("cell-filled");
            cell.innerHTML = `
                <div class="cell-inner-box" ondblclick="event.stopPropagation(); triggerEditModal('${matchingData.slot}')">
                    <span class="cell-code">${matchingData.code}</span>
                    <span class="cell-venue">${matchingData.venue || ''}</span>
                </div>
            `;
        } else {
            cell.classList.remove("cell-filled");
            cell.innerHTML = `
                <div class="cell-inner-box">
                    <span class="cell-slot-name">${slotT || slotL}</span>
                </div>
            `;
        }
    });
    renderCourseRegistryTable();
}

function handleCellClick(element) {
    if(element.classList.contains("cell-filled")) return;
    const tSlot = element.getAttribute("data-t");
    const lSlot = element.getAttribute("data-l");
    
    selectedTargetCell = tSlot || lSlot;
    
    document.getElementById("modal-slot-tag").innerText = (tSlot && lSlot) ? `${tSlot} / ${lSlot}` : selectedTargetCell;
    document.getElementById("modal-times").innerText = "Assign course values to this structural block.";
    
    // Clear Input Parameters
    document.getElementById("m-code").value = "";
    document.getElementById("m-title").value = "";
    document.getElementById("m-faculty").value = "";
    document.getElementById("m-venue").value = "";
    document.getElementById("m-credits").value = "3";

    openCustomModal("modal-add");
}

// Modal Interactivity Framework
function openCustomModal(id) {
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById(id).classList.remove("hidden");
}

function closeActiveModals() {
    document.getElementById("overlay").classList.add("hidden");
    document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

function initModalClosers() {
    document.getElementById("overlay").addEventListener("click", closeActiveModals);
    document.getElementById("modal-add-close").addEventListener("click", closeActiveModals);
    document.getElementById("modal-add-cancel").addEventListener("click", closeActiveModals);
    document.getElementById("modal-edit-close").addEventListener("click", closeActiveModals);
    document.getElementById("modal-edit-cancel").addEventListener("click", closeActiveModals);
    document.getElementById("conflict-ok").addEventListener("click", closeActiveModals);
    document.getElementById("reset-cancel").addEventListener("click", closeActiveModals);
    document.getElementById("dl-cancel").addEventListener("click", closeActiveModals);

    // Form Submissions
    document.getElementById("modal-add-save").addEventListener("click", executeCourseSave);
    document.getElementById("modal-edit-save").addEventListener("click", executeCourseUpdate);
    document.getElementById("modal-edit-remove").addEventListener("click", executeCourseRemoval);
    document.getElementById("btn-reset").addEventListener("click", () => openCustomModal("modal-reset-confirm"));
    document.getElementById("reset-ok").addEventListener("click", purgeAllTimetableData);
    document.getElementById("btn-download-tt").addEventListener("click", () => openCustomModal("modal-dl"));
    document.getElementById("dl-print").addEventListener("click", () => { closeActiveModals(); window.print(); });
    document.getElementById("dl-csv").addEventListener("click", exportDataCSV);
    document.getElementById("pv-close").addEventListener("click", closeActiveModals);
}

function executeCourseSave() {
    const code = document.getElementById("m-code").value.trim().toUpperCase();
    const title = document.getElementById("m-title").value.trim();
    const faculty = document.getElementById("m-faculty").value.trim();
    const venue = document.getElementById("m-venue").value.trim().toUpperCase();
    const credits = parseInt(document.getElementById("m-credits").value) || 0;

    if(!code) { showSystemToast("Course Code is mandatory"); return; }

    // Conflict Parsing Check
    const exists = savedPlacements.some(c => c.slot === selectedTargetCell);
    if(exists) {
        closeActiveModals();
        document.getElementById("conflict-msg").innerText = `Slot ${selectedTargetCell} produces an explicit overlap flag.`;
        openCustomModal("modal-conflict");
        return;
    }

    savedPlacements.push({ slot: selectedTargetCell, code, title, faculty, venue, credits });
    syncFFCSState();
    closeActiveModals();
    showSystemToast(`Added operational code ${code}`);
}

let activeEditSlotKey = null;
function triggerEditModal(slotKey) {
    activeEditSlotKey = slotKey;
    const target = savedPlacements.find(c => c.slot === slotKey);
    if(!target) return;

    document.getElementById("edit-slot-tag").innerText = slotKey;
    document.getElementById("e-code").value = target.code;
    document.getElementById("e-title").value = target.title || '';
    document.getElementById("e-faculty").value = target.faculty || '';
    document.getElementById("e-venue").value = target.venue || '';
    document.getElementById("e-credits").value = target.credits || 0;

    openCustomModal("modal-edit");
}

function executeCourseUpdate() {
    const target = savedPlacements.find(c => c.slot === activeEditSlotKey);
    if(target) {
        target.code = document.getElementById("e-code").value.trim().toUpperCase();
        target.title = document.getElementById("e-title").value.trim();
        target.faculty = document.getElementById("e-faculty").value.trim();
        target.venue = document.getElementById("e-venue").value.trim().toUpperCase();
        target.credits = parseInt(document.getElementById("e-credits").value) || 0;
        syncFFCSState();
    }
    closeActiveModals();
}

function executeCourseRemoval() {
    savedPlacements = savedPlacements.filter(c => c.slot !== activeEditSlotKey);
    syncFFCSState();
    closeActiveModals();
    showSystemToast("Slot reference scrubbed.");
}

function purgeAllTimetableData() {
    savedPlacements = [];
    syncFFCSState();
    closeActiveModals();
    showSystemToast("Timetable state cleared.");
}

function syncFFCSState() {
    localStorage.setItem('eduhub_ffcs_slots', JSON.stringify(savedPlacements));
    renderTimetableData();
}

function renderCourseRegistryTable() {
    const tbody = document.getElementById("cl-body");
    tbody.innerHTML = "";
    let totalCredits = 0;

    savedPlacements.forEach(c => {
        totalCredits += c.credits;
        tbody.innerHTML += `
            <tr>
                <td><strong>${c.slot}</strong></td>
                <td>${c.code}</td>
                <td>${c.title || '—'}</td>
                <td>${c.faculty || '—'}</td>
                <td>${c.venue || '—'}</td>
                <td>${c.credits}</td>
                <td><button class="cl-del-btn" onclick="triggerDirectRemoval('${c.slot}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });

    document.getElementById("credit-badge").innerText = `${totalCredits} Credits`;
    document.getElementById("cl-total").innerText = totalCredits;
}

function triggerDirectRemoval(slotKey) {
    savedPlacements = savedPlacements.filter(c => c.slot !== slotKey);
    syncFFCSState();
}

function exportDataCSV() {
    if(savedPlacements.length === 0) { showSystemToast("No active courses inside registry."); return; }
    let csvContent = "data:text/csv;charset=utf-8,Slot,Course Code,Title,Faculty,Venue,Credits\n";
    savedPlacements.forEach(c => {
        csvContent += `"${c.slot}","${c.code}","${c.title || ''}","${c.faculty || ''}","${c.venue || ''}",${c.credits}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vit_ffcs_timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeActiveModals();
}

/* ════════════════════════════════════════════════════════════
   MODULE 02 ENGINE: CONTINUOUS RECURSIVE GRADIENT MATH
   ════════════════════════════════════════════════════════════ */
const GRADE_POINTS = { "S": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0 };

function initCgpaDefaultRows() {
    const gpaBox = document.getElementById("gpa-courses");
    gpaBox.innerHTML = "";
    for(let i=0; i<5; i++) addGpaInputRow();

    const cgpaBox = document.getElementById("cgpa-sems");
    cgpaBox.innerHTML = "";
    for(let i=0; i<3; i++) addCgpaInputRow();
}

// Attach listeners for structural runtime extensions
document.getElementById("btn-add-gpa-course").addEventListener("click", addGpaInputRow);
document.getElementById("btn-add-sem").addEventListener("click", addCgpaInputRow);

function addGpaInputRow() {
    const container = document.getElementById("gpa-courses");
    const div = document.createElement("div");
    div.className = "calc-row";
    div.innerHTML = `
        <input type="text" class="calc-input gpa-c-name" placeholder="Course Name/Code"/>
        <input type="number" class="calc-input gpa-c-cr" placeholder="Credits" min="1" max="10"/>
        <select class="calc-select gpa-c-gr">
            <option value="">Grade</option>${Object.keys(GRADE_POINTS).map(g => `<option value="${g}">${g}</option>`).join('')}
        </select>
        <button class="btn-row-del" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;
    container.appendChild(div);
}

function addCgpaInputRow() {
    const container = document.getElementById("cgpa-sems");
    const div = document.createElement("div");
    div.className = "calc-row";
    const nextSem = container.children.length + 1;
    div.innerHTML = `
        <input type="text" class="calc-input sem-name" value="Semester ${nextSem}"/>
        <input type="number" class="calc-input sem-gpa" placeholder="GPA" step="0.01" min="0" max="10"/>
        <input type="number" class="calc-input sem-cr" placeholder="Credits" min="1"/>
        <button class="btn-row-del" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;
    container.appendChild(div);
}

function calcGPA() {
    const rows = document.querySelectorAll("#gpa-courses .calc-row");
    let totalPoints = 0, totalCredits = 0;
    
    rows.forEach(row => {
        const cr = parseFloat(row.querySelector(".gpa-c-cr").value);
        const grade = row.querySelector(".gpa-c-gr").value;
        if(!isNaN(cr) && grade in GRADE_POINTS) {
            totalPoints += cr * GRADE_POINTS[grade];
            totalCredits += cr;
        }
    });

    if(totalCredits === 0) {
        document.getElementById("gpa-result").innerText = "—";
        document.getElementById("gpa-credits").innerText = "0";
        document.getElementById("gpa-grade").innerText = "—";
        return;
    }

    const gpa = totalPoints / totalCredits;
    document.getElementById("gpa-result").innerText = gpa.toFixed(2);
    document.getElementById("gpa-credits").innerText = totalCredits;
    
    // Abstracted evaluation boundary mappings
    let primaryEst = "C";
    if(gpa >= 9.0) primaryEst = "S";
    else if(gpa >= 8.0) primaryEst = "A";
    else if(gpa >= 7.0) primaryEst = "B+";
    else if(gpa >= 6.0) primaryEst = "B";
    
    document.getElementById("gpa-grade").innerText = primaryEst;
}

function calcCGPA() {
    const rows = document.querySelectorAll("#cgpa-sems .calc-row");
    let cumulativeProduct = 0, totalCredits = 0;

    rows.forEach(row => {
        const gpa = parseFloat(row.querySelector(".sem-gpa").value);
        const cr = parseFloat(row.querySelector(".sem-cr").value);
        if(!isNaN(gpa) && !isNaN(cr)) {
            cumulativeProduct += gpa * cr;
            totalCredits += cr;
        }
    });

    if(totalCredits === 0) {
        document.getElementById("cgpa-result").innerText = "—";
        document.getElementById("cgpa-total-cr").innerText = "0";
        document.getElementById("cgpa-class").innerText = "—";
        return;
    }

    const cgpa = cumulativeProduct / totalCredits;
    document.getElementById("cgpa-result").innerText = cgpa.toFixed(2);
    document.getElementById("cgpa-total-cr").innerText = totalCredits;

    let classification = "Second Class";
    if(cgpa >= 8.5) classification = "First Class (Honours)";
    else if(cgpa >= 6.5) classification = "First Class";
    
    document.getElementById("cgpa-class").innerText = classification;
}

function calcPredictor() {
    const curCgpa = parseFloat(document.getElementById("pred-curr").value);
    const completedCr = parseFloat(document.getElementById("pred-done-cr").value);
    const targetCgpa = parseFloat(document.getElementById("pred-target").value);
    const remainingCr = parseFloat(document.getElementById("pred-rem-cr").value);

    const resultBox = document.getElementById("pred-result-box");
    resultBox.classList.remove("hidden", "danger-state");

    if(isNaN(curCgpa) || isNaN(completedCr) || isNaN(targetCgpa) || isNaN(remainingCr)) {
        showSystemToast("Please compute complete predictive variables.");
        return;
    }

    const totalCredits = completedCr + remainingCr;
    const requiredTotalPoints = targetCgpa * totalCredits;
    const currentEarnedPoints = curCgpa * completedCr;
    const missingPoints = requiredTotalPoints - currentEarnedPoints;
    const targetGpa = missingPoints / remainingCr;

    const valDisplay = document.getElementById("pred-res-val");
    const msgDisplay = document.getElementById("pred-res-msg");

    if(targetGpa > 10.0) {
        resultBox.classList.add("danger-state");
        valDisplay.innerText = targetGpa.toFixed(2);
        msgDisplay.innerText = "Mathematically impossible. Re-evaluate structural target settings.";
    } else if(targetGpa < 0) {
        valDisplay.innerText = "0.00";
        msgDisplay.innerText = "Target exceeded based on your existing cumulative trajectory.";
    } else {
        valDisplay.innerText = targetGpa.toFixed(2);
        msgDisplay.innerText = "Maintain this focus over remaining semester operations.";
    }
}

/* ════════════════════════════════════════════════════════════
   MODULE 03 ENGINE: INTERACTIVE QUIZ METRICS (NPTEL)
   ════════════════════════════════════════════════════════════ */
function renderNptelGrid() {
    const grid = document.getElementById("nptel-grid");
    grid.innerHTML = "";
    NPTEL_DATA.forEach(course => {
        grid.innerHTML += `
            <div class="nptel-card" onclick="openNptelQuiz(${course.id})">
                <h4>${course.title}</h4>
                <div class="nc-bottom">
                    <span class="nc-weeks">${course.weeks} Weeks</span>
                    <span>${course.questions} Questions</span>
                </div>
            </div>
        `;
    });
}

function filterNptel() {
    const query = document.getElementById("nptel-search").value.toLowerCase();
    const cards = document.querySelectorAll("#nptel-grid .nptel-card");
    NPTEL_DATA.forEach((course, index) => {
        const isMatch = course.title.toLowerCase().includes(query);
        cards[index].style.display = isMatch ? "flex" : "none";
    });
}

function openNptelQuiz(courseId) {
    currentQuizTarget = NPTEL_DATA.find(c => c.id === courseId);
    document.getElementById("nptel-home").classList.add("hidden");
    const quizView = document.getElementById("nptel-quiz-view");
    quizView.classList.remove("hidden");
    
    document.getElementById("quiz-course-title").innerText = currentQuizTarget.title;
    setQuizViewMode(currentQuizViewMode);
}

function closeNptelQuiz() {
    document.getElementById("nptel-quiz-view").classList.add("hidden");
    document.getElementById("nptel-home").classList.remove("hidden");
}

function setQuizMode(mode) {
    currentQuizViewMode = mode;
    document.querySelectorAll(".qmode-btn").forEach(btn => btn.classList.remove("active"));
    if(mode === 'week') document.getElementById("qm-week").classList.add("active");
    else document.getElementById("qm-full").classList.add("active");
    setQuizViewMode(mode);
}

function setQuizViewMode(mode) {
    const body = document.getElementById("quiz-body");
    body.innerHTML = "";

    if(mode === "week") {
        for(let i = 1; i <= currentQuizTarget.weeks; i++) {
            body.innerHTML += `
                <div class="week-block" onclick="loadWeekQuestions(${i})">
                    <div class="wb-left">
                        <h4>Assignment Week 0${i}</h4>
                        <p>Core algorithmic evaluation models and solutions</p>
                    </div>
                    <div class="wb-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        }
    } else {
        loadComprehensiveQuiz();
    }
}

function loadWeekQuestions(weekNum) {
    const body = document.getElementById("quiz-body");
    body.innerHTML = `<button class="back-btn" style="margin-bottom:20px" onclick="setQuizViewMode('week')"><i class="fa-solid fa-arrow-left"></i> Back to Weeks</button>`;
    
    // Render standard deterministic synthetic tracking loops
    for(let i=1; i<=5; i++) {
        body.appendChild(buildQuestionElement(i, weekNum));
    }
}

function loadComprehensiveQuiz() {
    const body = document.getElementById("quiz-body");
    for(let i=1; i<=10; i++) {
        body.appendChild(buildQuestionElement(i, "Global"));
    }
}

function buildQuestionElement(index, context) {
    const div = document.createElement("div");
    div.className = "q-box";
    div.innerHTML = `
        <div class="q-text">Q${index}. [${context} Matrix Variable] Which of the following functional options is structurally valid for this computing framework?</div>
        <div class="opt-list">
            <div class="opt-item" onclick="evaluateOption(this, true)">Structural Option A (Optimized configuration execution parameter)</div>
            <div class="opt-item" onclick="evaluateOption(this, false)">Structural Option B (Fallback execution dependency layer)</div>
            <div class="opt-item" onclick="evaluateOption(this, false)">Structural Option C (De-allocated memory space trace block)</div>
            <div class="opt-item" onclick="evaluateOption(this, false)">Structural Option D (Asynchronous termination sequence handle)</div>
        </div>
    `;
    return div;
}

function evaluateOption(element, isCorrect) {
    const list = element.parentElement;
    // Lock additional choice execution arrays
    if(list.querySelector(".correct-state") || list.querySelector(".wrong-state")) return;

    if(isCorrect) {
        element.classList.add("correct-state");
    } else {
        element.classList.add("wrong-state");
        // Locate true configuration state mapping target references
        const items = list.querySelectorAll(".opt-item");
        items[0].classList.add("correct-state"); 
    }
    
    const explain = document.createElement("div");
    explain.className = "q-explain-panel";
    explain.innerHTML = `<strong>Explanation:</strong> Option A defines the highly optimized standard path confirmed under standard institutional test vectors.`;
    list.parentElement.appendChild(explain);
}

/* ════════════════════════════════════════════════════════════
   MODULE 04 ENGINE: HISTORICAL ARCHIVE DATA REPO (PYQ)
   ════════════════════════════════════════════════════════════ */
let selectedExamTypeFilter = "all";
let selectedYearFilter = "all";

function setupPyqFilters() {
    document.querySelectorAll("#pf-type .pf-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll("#pf-type .pf-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedExamTypeFilter = e.target.getAttribute("data-val");
            renderPyqGrid();
        });
    });

    document.querySelectorAll("#pf-year .pf-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll("#pf-year .pf-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedYearFilter = e.target.getAttribute("data-val");
            renderPyqGrid();
        });
    });
}

function renderPyqGrid() {
    const grid = document.getElementById("pyq-grid");
    grid.innerHTML = "";
    const searchVal = document.getElementById("pyq-search").value.toLowerCase();

    PYQ_DATA.forEach(paper => {
        const matchesType = (selectedExamTypeFilter === "all" || paper.type === selectedExamTypeFilter);
        const matchesYear = (selectedYearFilter === "all" || paper.year.toString() === selectedYearFilter);
        const matchesSearch = (paper.code.toLowerCase().includes(searchVal) || paper.name.toLowerCase().includes(searchVal));

        if(matchesType && matchesYear && matchesSearch) {
            grid.innerHTML += `
                <div class="pyq-card">
                    <div>
                        <div class="pyq-c-code">${paper.code}</div>
                        <h4>${paper.name}</h4>
                        <div class="pyq-meta-row">
                            <span class="p-meta m-type">${paper.type}</span>
                            <span class="p-meta">${paper.year}</span>
                            <span class="p-meta">Slot: ${paper.slot}</span>
                        </div>
                    </div>
                    <button onclick="openPaperViewer('${paper.code}', '${paper.type}', '${paper.year}')" class="pyq-dl-btn">
                        <i class="fa-solid fa-cloud-arrow-down"></i> View Document
                    </button>
                </div>
            `;
        }
    });

    if(grid.innerHTML === "") {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">No exact paper matches found within localized index sets.</div>`;
    }
}

function openPaperViewer(code, type, year) {
    const viewer = document.getElementById("modal-paper-viewer");
    if(viewer) {
        document.getElementById("pv-title").innerText = `${code} - ${type} (${year})`;
        document.getElementById("pv-subtitle").innerText = "Internal Secure Document Stream • VIT Vellore";
        
        // Dynamic content generation based on course code to simulate "extraction"
        const docSim = document.querySelector(".pv-doc-sim");
        let questionsHtml = `<h2>${code} QUESTION PAPER - ${type}</h2>`;
        
        let questions = [];
        
        // Robust Subject-Specific Question Repository
        if (code.startsWith("CSE")) {
            questions = [
                { q: "Analyze architectural differences between Von Neumann and Harvard architectures in high-performance computing.", m: 5 },
                { q: "Explain the concept of cache coherence using the MESI protocol in multiprocessor systems.", m: 5 },
                { q: "Implement memory management using segmentation and paging. Discuss the impact on fragmentation.", m: 10 },
                { q: "Explain synchronization primitives in distributed systems. Describe Lamport’s logical clock mechanism.", m: 10 },
                { q: "Design a finite state machine (FSM) that accepts strings containing an even number of 1s.", m: 10 },
                { q: "Compare RISC and CISC architectures regarding instruction set complexity and execution cycles.", m: 10 },
                { q: "Describe pipeline hazards (Structural, Data, Control) and suggest hardware/software mitigation strategies.", m: 15 },
                { q: "Analyze the performance metrics of different disk scheduling algorithms (SSTF, SCAN, C-LOOK).", m: 15 }
            ];
        } else if (code.startsWith("MAT")) {
            questions = [
                { q: "Solve the second-order non-homogeneous differential equation using the method of undetermined coefficients.", m: 5 },
                { q: "Evaluate the double integral of f(x,y) over the specified region in polar coordinates.", m: 5 },
                { q: "Prove the uniqueness of the solution for a given Initial Value Problem (IVP) using Picard's Iteration.", m: 10 },
                { q: "Calculate Eigenvalues and Eigenvectors for the provided 3x3 matrix and verify diagonalization properties.", m: 10 },
                { q: "Verify Green's theorem for the given vector field over a closed region C in the XY plane.", m: 10 },
                { q: "Find the Fourier series expansion for the periodic function f(x) = x in the interval (-π, π).", m: 10 },
                { q: "Apply the Newton-Raphson method to find the roots of f(x) = x^3 - x - 1 correct to three decimals.", m: 15 },
                { q: "Solve the system of linear equations using the Gauss-Seidel iterative method for four iterations.", m: 15 }
            ];
        } else if (code.startsWith("ECE") || code.startsWith("EEE")) {
            questions = [
                { q: "Determine the Thevenin and Norton equivalent circuits for the given complex bridge network.", m: 5 },
                { q: "Explain the operation and transfer characteristics of a Schmitt trigger using an Operational Amplifier.", m: 5 },
                { q: "Design a synchronous MOD-12 counter using JK flip-flops and provide the state transition table.", m: 10 },
                { q: "Calculate the output voltage and voltage gain for a multi-stage BJT common-emitter amplifier.", m: 10 },
                { q: "Compare AM, FM, and PM modulation techniques in terms of bandwidth efficiency and noise immunity.", m: 10 },
                { q: "Analyze the frequency response and roll-off rate of a second-order Butterworth low-pass filter.", m: 10 },
                { q: "Describe the internal architecture, register set, and interrupt structure of the 8051 microcontroller.", m: 15 },
                { q: "Implement a 3-variable logic function using a 4:1 Multiplexer and explain the mapping process.", m: 15 }
            ];
        } else if (code.startsWith("PHY")) {
            questions = [
                { q: "Derive Maxwell's equations in differential form and explain the significance of Displacement Current.", m: 5 },
                { q: "Explain the principle of Laser action and the necessity of Population Inversion for light amplification.", m: 5 },
                { q: "Solve the Schrodinger wave equation for a particle trapped in a 1D infinite potential well.", m: 10 },
                { q: "Discuss the Meissner effect and distinguish between Type-I and Type-II superconductors.", m: 10 },
                { q: "Analyze the interference pattern produced by Newton's rings and calculate the radius of curvature.", m: 10 },
                { q: "Explain the Hall effect and how it determines charge carrier concentration and mobility.", m: 10 },
                { q: "Describe the Kronig-Penney model and the formation of energy bands in crystalline solids.", m: 15 },
                { q: "Calculate the numerical aperture, acceptance angle, and V-number for a step-index optical fiber.", m: 15 }
            ];
        } else if (code.startsWith("CHY")) {
            questions = [
                { q: "Explain Molecular Orbital Theory (MOT) for the O2 and N2 molecules. Determine bond order.", m: 5 },
                { q: "Discuss the electrochemical mechanism of corrosion and the application of sacrificial anode protection.", m: 5 },
                { q: "Derive the Clausius-Clapeyron equation and discuss its significance in phase transitions.", m: 10 },
                { q: "Analyze the mechanisms of Addition vs. Condensation polymerization with suitable chemical examples.", m: 10 },
                { q: "Describe the working principle of UV-Visible spectroscopy and verify the Beer-Lambert law.", m: 10 },
                { q: "Explain industrial water treatment processes including Reverse Osmosis and Ion Exchange resin method.", m: 10 },
                { q: "Compare the chemistry and efficiency of Lithium-ion batteries vs. traditional Lead-acid cells.", m: 15 },
                { q: "Discuss the phase diagram of a two-component lead-silver system and define the eutectic point.", m: 15 }
            ];
        } else if (code.startsWith("STS")) {
            questions = [
                { q: "Solve the syllogism: All engineers are logical; Some logical people are artists. Conclude the relationship.", m: 5 },
                { q: "A train crosses a 300m platform in 20s. Find the speed of the train if its length is 100m.", m: 5 },
                { q: "Find the missing number in the sequence: 5, 11, 23, 47, 95, ____.", m: 10 },
                { q: "Decode the logic: If 'COMPUTER' is written as 'RFUVQNPC', how is 'ENGINEER' coded?", m: 10 },
                { q: "Calculate the probability of getting exactly two heads when tossing three unbiased coins simultaneously.", m: 10 },
                { q: "Identify logical fallacies in the provided corporate statement regarding market expansion.", m: 10 },
                { q: "Solve the Work-Time problem: A takes 10 days, B takes 15 days. How long if they work together?", m: 15 },
                { q: "Interpret the data trend in the provided bar chart representing export-import growth over five years.", m: 15 }
            ];
        } else {
            questions = [
                { q: "Summarize the core ethical implications of AI development in modern engineering society.", m: 5 },
                { q: "Define the SWOT analysis framework and apply it to a hypothetical tech startup case study.", m: 5 },
                { q: "Discuss the barriers to effective communication in multicultural and global team environments.", m: 10 },
                { q: "Analyze the impact of globalization on local supply chain and logistics management strategies.", m: 10 },
                { q: "Compare democratic and autocratic leadership styles and their impact on long-term project performance.", m: 10 },
                { q: "Describe the various stages of the project lifecycle from initiation and planning to closure.", m: 10 },
                { q: "Develop a detailed project timeline using PERT/CPM for a lean startup scenario.", m: 15 },
                { q: "Analyze the '4Ps' of the marketing mix for a newly launched educational technology product.", m: 15 }
            ];
        }

        questions.forEach((item, index) => {
            questionsHtml += `
                <div class="q-line">
                    <span class="q-num">${index + 1}.</span>
                    <div>${item.q} [${item.m} Marks]</div>
                </div>
            `;
        });

        docSim.innerHTML = questionsHtml;

        openCustomModal("modal-paper-viewer");
        showSystemToast(`Loading ${code} internal archive...`);
    }
}

function filterPYQ() {
    renderPyqGrid();
}

/* ════════════════════════════════════════════════════════════
   GLOBAL SYSTEM UTILITIES
   ════════════════════════════════════════════════════════════ */
function showSystemToast(message) {
    const toast = document.getElementById("toast");
    document.getElementById("toast-msg").innerText = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}
