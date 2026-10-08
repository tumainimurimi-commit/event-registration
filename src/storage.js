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
    getAllRegistrations,
    findByRegNo,
    findByEmail
};