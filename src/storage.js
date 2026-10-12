const crypto = require('node:crypto');
const registerStudents = [];

function addRegistration(regData) {
    const student = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        attended: false,
        studentInfo: regData
    };
    registerStudents.push(student);
    return student;
}

function findById(id) {
    return registerStudents.find(student => student.id === id);
}

function updateRegistrationById(id, newData) {
    const student = findById(id);
    if (!student) return null;

    student.studentInfo = { ...newData };
    return student;
}

function deleteRegistrationById(id) {
    const index = registerStudents.findIndex(student => student.id === id);
    if (index === -1) return null;

    const removed = registerStudents.splice(index, 1)[0];
    return removed;
}

function toggleAttendanceById(id) {
    const student = findById(id);
    if (!student) return null;

    student.attended = !student.attended;
    return student;
}

function getAllRegistrations() {
    return registerStudents;
}

function findByRegNo(regNo) {
    return registerStudents.find(
        student => student.studentInfo.regNo === regNo
    );
}

function findByEmail(email) {
    return registerStudents.find(
        student => student.studentInfo.emailInfo === email
    );
}

module.exports = {
    addRegistration,
    findById,
    updateRegistrationById,
    deleteRegistrationById,
    toggleAttendanceById,
    getAllRegistrations,
    findByRegNo,
    findByEmail
};