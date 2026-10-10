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
const termsError=document.querySelector('#termsError');
const submitButton=registrationForm.querySelector('button[type="submit"]');

//Validate the student Full name
function validateFullName(name){
    const studentName=name.trim();
    if(studentName===''){
        return 'Full Name is required.'
    }

    if(studentName.length<=3){
        return 'Full Name must be atleast 3 characters.'
    }
    
    const words=studentName.split(/\s+/);
    for(const word of words){
        if(!/^[A-Za-z]+$/.test(word)){
            return 'Name should contain only letters and space';
        }
    }
    return '';//no error
}
//function showing error on the full name
function showFullNameError(message){
    fullnameError.textContent=message;
    fullName.classList.toggle('Invalid', message!=='');
    fullName.setAttribute('aria-invalid', message?'true' : 'false');
}

//Validate the student registration number
function validateregistrationNumber(regNo){
    const studentRegNo=regNo.trim();
    if(studentRegNo===''){
        return 'Registration Number is required';
    }
    
    if(studentRegNo.length<4){
        return 'Registration Number must be atleast 4 characters';
    }
    const REG_NUMBER_REGEX=/^[A-Z]{2}\d{3}\/[A-Z0-9]+\/\d{5}\/\d{2}$/;
    if(!REG_NUMBER_REGEX.test(studentRegNo)){
        return 'Format must be like CT100/G/26252/25'
    }
    return '';//no error
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
    
    const words=studentName.split(/\s+/);
    for(const word of words){
        if(!/^[A-Za-z]+$/.test(word)){
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
    return '';//no error
}
//fuction show error for the email
function showEmailError(message){
    emailError.textContent=message;
    email.classList.toggle('Invalid', message!=='');
    email.setAttribute('aria-invalid', message?'true' : 'false');
}
//Validate phone number
function validatePhoneNumber(phoneNum){
    const PHONE_REGEX = /^(?:\+254|254|0)[71]\d{8}$/;
    const phone=phoneNum.trim();
    if(phone===''){
        return 'Please enter your phone number'
    }
     if (!/^\+?\d+$/.test(phone)){
        return 'Phone number can only contain digits and an optional leading +.'
    }
    if(PHONE_REGEX.test(phone)){
        return '';
    }
    if (!/^(?:\+254|254|0)/.test(phone)){
        return 'Kenyan numbers must start with 07, 01, +254, or 254.';
    }
    const expected=phone.startsWith('+254') ? 13
                    :phone.startsWith('254') ? 12
                    :10;
    if (phone.length < expected) {
    return `That number is too short — a Kenyan number is ${expected} characters.`;
    }
    if (phone.length > expected) {
    return `That number is too long — a Kenyan number is ${expected} characters.`;
    }

    return 'Enter a valid Kenyan number, e.g. 0712345678 or +254712345678.';
}
//Fuction that show phone number error
function showPhoneNumberError(message){
    phoneNumError.textContent=message;
    phoneNumber.classList.toggle('Invalid', message!=='');
    phoneNumber.setAttribute('aria-invalid', message?'true' : 'false');
}
//The policy consent checkbox
function validateCheckbox(checked){
    if(!checked){
        return 'Please accept the terms and conditions to continue.';
    }
    return '';
}
//Function that shows policy terms error
function showTermsError(message){
  termsError.textContent = message;
  agreementPolicy.setAttribute('aria-invalid', message ? 'true' : 'false');
}

//Function that maps a server error key to the correct show function
function showServerError(field, msg){
    switch(field){
        case 'fullName': showFullNameError(msg); break;
        case 'regNo': showRegistrationError(msg); break;
        case 'course': showCourseError(msg); break;
        case 'emailInfo': showEmailError(msg); break;
        case 'phone': showPhoneNumberError(msg); break;
        case 'agreedToPolicy': showTermsError(msg); break;
        default:
            message.textContent += msg + ' ';
            message.className = 'message-error';
    }
}

//Function that clears all errors before a new submit
function clearAllErrors(){
    showFullNameError('');
    showRegistrationError('');
    showCourseError('');
    showEmailError('');
    showPhoneNumberError('');
    showTermsError('');
    message.textContent = '';
    message.className = '';
}

//submit function and create a user input object and send it to the server
async function submitFormHandler(){
    clearAllErrors();
    const studentInfo={
        fullName:fullName.value.trim().toUpperCase(),
        regNo:registrationNumber.value.trim().toUpperCase(),
        course:courseName.value.trim().toUpperCase(),
        studyYear:yearOfStudy.value,
        emailInfo:email.value.trim(),
        phone:phoneNumber.value.trim(),
        DOB:dateOfBirth.value,
        genderInfo:gender.value,
        dietaryInfo:dietary.value.trim(),
        agreedToPolicy: agreementPolicy.checked
    }
    
    submitButton.disabled=true;
    submitButton.textContent='Registering...';
    try{
        const response=await fetch('http://localhost:3000/api/register',{
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(studentInfo)
        });
        const data=await response.json();
        if(!response.ok){
            if(data.errors){
                Object.keys(data.errors).forEach((key)=>{
                    showServerError(key, data.errors[key]);
                });
                return;
            }
            if(data.error){
                message.textContent=data.error;
                message.className='message-error';
                return;
            }
            message.textContent=`Submit failed: Server response ${response.status}`;
            message.className='message-error';
            return;
        }
        message.textContent='Registration successful.';
        message.className='message-success';
        alert('The form was succefully submited');
        registrationForm.reset();
    }catch (error){
        message.textContent=`Submit failed: ${error.message}`;
        message.className='message-error';
    }finally{
        submitButton.disabled=false;
        submitButton.textContent='Register';
    }
}
//eventlistener for the full name input
    fullName.addEventListener('input',()=>{
    const inputMessage=validateFullName(fullName.value);
    showFullNameError(inputMessage);

})
//eventlistener for the registration number input 
registrationNumber.addEventListener('input',()=>{
    const cursorPos = registrationNumber.selectionStart;
    registrationNumber.value = registrationNumber.value.toUpperCase();
    registrationNumber.setSelectionRange(cursorPos, cursorPos);
    const inputMessage=validateregistrationNumber(registrationNumber.value);
    showRegistrationError(inputMessage);
})
//eventlisterner for the course input
courseName.addEventListener('input',()=>{
    const inputMessage=validateCourseName(courseName.value);
    showCourseError(inputMessage);
})
//eventlistener for the the email input
email.addEventListener('input', ()=>{
    const inputMessage=validateEmail(email.value);
    showEmailError(inputMessage);
})
//eventlistener for phone number
phoneNumber.addEventListener('input',()=>{
    const inputMessage=validatePhoneNumber(phoneNumber.value);
    showPhoneNumberError(inputMessage);
})
//eventlistener for agreement policy
agreementPolicy.addEventListener('change', ()=>{
    showTermsError(validateCheckbox(agreementPolicy.checked))
})
//Form submit listener
registrationForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    submitFormHandler();
})