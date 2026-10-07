//selecting the HTML element using using Javascript methods
const registrationForm=document.querySelector('#registrationForm');
const fullName=document.querySelector('#fullName');
const registrationNumber=document.querySelector('#registrationNumber');
const courseName=document.querySelector('#courseName');
const yearOfStudy=document.querySelector('#yearOfStudy');
const email=document.querySelector('#email');
const phoneNumber=document.querySelector('#phoneNumber');
const dateOfBirth=document.querySelector('#dateOfBirth');
const gender=document.querySelector('#gender');
const dietary=document.querySelector('#dietary');
const agreementPolicy=document.querySelector('#agreementPolicy');
const message=document.querySelector('#message');
const fullnameError=document.querySelector('#fullnameError');
const regNoError=document.querySelector('#regNoError');
const courseNameError=document.querySelector('#courseNameError');
const emailError=document.querySelector('#emailError');
const phoneNumError=document.querySelector('#phoneNumError');

//Validate the student Full name
function validateFullName(name){
    const studentName=name.trim();
    if(studentName===''){
        return 'Full Name is required.'
    }

    if(studentName.length<=3){
        return 'Full Name must be atleast 3 characters.'
    }
    
    const words=studentName.split(/\s/);
    for(const word of words){
        if(!/^[A-Za-z]+$/.test(words)){
            return 'Name should contain only letters and space';
        }
    }
    return '';//no error
}
//function showing error on the full name
function showFullNameError(message){
    fullnameError.textContent=message;
    fullName.classList.toggle('Invalid', message!=='');
    fullName.setAttribute('aria-invalid', message?'true' : 'false')
}

//Validate the student registration number
function validateregistrationNumber(regNo){
    const studentRegNo=regNo.trim();
    if(studentRegNo===''){
        return 'Registration Number is required';
    }
    
    if(regNo.length<4){
        return 'Registration Number must be atleast 4 characters';
    }
    const REG_NUMBER_REGEX=/^[A-Z]{2}\d{3}\/[A-Z0-9]+\/\d{5\/\d{2}$/;
    if(!REG_NUMBER_REGEX.test(studentRegNo)){
        return 'Format must be like CT100/G/26252/25'
    }
}
//function showing error for the registration number
function showRegistrationError(message){
    regNoError.textContent=message;
    registrationNumber.classList.toggle('Invalid', message!=='');
    registrationNumber.setAttribute('aria-invalid', message?'true' : 'false');
}
//Validate the course name
function validateCourseName(name){
    const studentName=name.trim();
    if(studentName===''){
        return 'Course name is required.'
    }

    if(studentName.length<=3){
        return 'Course Name must be atleast 3 characters.'
    }
    
    const words=studentName.split(/\s/);
    for(const word of words){
        if(!/^[A-Za-z]+$/.test(words)){
            return 'Name should only contain letters and space';
        }
    }
    return '';//no error
}
//function showing error for the course name
function showCourseError(message){
    courseNameError.textContent=message;
    courseName.classList.toggle('Invalid', message!=='');
    courseName.setAttribute('aria-invalid', message?'true' : 'false');

}
//Validate the email
function validateEmail(email){
    const studentEmail=email.trim();
    const EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    if(studentEmail===''){
        return 'Email is required';
    }
    if(!EMAIL_REGEX.test(studentEmail)){
        return 'Enter a valid email, e.g. name@example.com';
    }
}
//fuction show error for the email

//eventlistener for the full name input
fullName.addEventListener('input',()=>{
    const inputMessage=validateFullName(fullName.value);
    showFullNameError(inputMessage);

})
//eventlistener for the registration number input 
registrationNumber.addEventListener('input',()=>{
    const inputMessage=validateregistrationNumber(registrationNumber.value);
    showRegistrationError(inputMessage);
})
//eventlisterner for the course input
courseName.addEventListener('input',()=>{
    const inputMessage=validateCourseName(courseName.value);
    showCourseError(inputMessage);
})
