//Server side validation
function validateRegistration(data){
    const errors={};

    //full name validation
    const fullName=(data.fullName || '').trim().toUpperCase();
    const name=/^[A-Z][A-Z\s'-]*$/
    if(fullName===''){
       errors.fullName='Full name is required.';
    }else if(fullName.length<3){
        errors.fullName='Full name must be at least 3 characters';
    }else if(!name.test(fullName)){
        errors.fullName='Full name may only contain letters, spaces, hyphens, and apostrophes';
    }

    //Registration number validation
    const regNo=(data.regNo || '').trim().toUpperCase();
    const number=/^[A-Z]{2}\d{3}\/[A-Z0-9]+\/\d{5}\/\d{2}$/
    if(regNo===''){
        errors.regNo='Registration number is required'
    }else if(!number.test(regNo)){
        errors.regNo='Registration number must look like this CT100/G/26252/25.'
    }

    //Course validation
    const course=(data.course || '').trim().toUpperCase();
    const courseName=/^[A-Z0-9\s.&,'-]+$/
    if(course===''){
        errors.course='Course is required';
    }else if(course.length<3){
        errors.course='Course name must be atleast 3 characters';
    }else if(!courseName.test(course)){
        errors.course='Course name contain invalid characters'
    }
    
    //study year validation
    const studyYear=(data.studyYear || '').trim();
    if(studyYear===''){
        errors.studyYear='Year of study is required'
    }else if(!['1', '2', '3', '4'].includes(studyYear)){
        errors.studyYear='Year of study must be 1, 2, 3, 4'
    }

    //email validation
    const emailInfo=(data.emailInfo || '').trim().toLowerCase();
    const info=/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/
    if(email===''){
        errors.emailInfo='Email is required';
    }else if(!info.test(emailInfo)){
        errors.emailInfo='Email format is invalid'
    }

    //Phone number validation
    const phone=(data.phone || '').trim();
    const pNumber=/^(?:\+254|254|0)[71]\d{8}$/;
    if(phone===''){
        errors.phone='Phone number is required';
    }else if(!pNumber.test(phone)){
        errors.phone='Phone number must be a valid kenyan number';
    }

    //Validate date of birth
    const DOB=(data.DOB || '').trim();
    if(DOB!==''){
        const date=new Date(DOB);
        const now=new Date();
        if(isNaN(date.getTime())){
            errors.DOB='Date of birth is invalid';
        }else if(date>now){
            errors.DOB='Date of birth cannot be in the future';
        }else if(date.getFullYear()<1940){
            errors.DOB='Date of birth is too far in the past';
        }
    }

    //Validate gender 
    const genderInfo=(data.genderInfo || '').trim();
     if(genderInfo===''){
        errors.genderInfo='Gender info is required'
    }else if(!['Male', 'Female', 'Prefer not to say'].includes(gender)){
        errors.genderInfo='Gender selection is invalid';
    }
    //validate dietry requirement
    const dietaryInfo=(data.dietaryInfo || '').trim();
    if(dietaryInfo.length>200){
        errors.dietaryInfo='Dietry requirement must be 200 characters or fewer';
    };

    //Validate agreement policy
    if(data.agreedToPolicy!==true){
        errors.agreedToPolicy='You must agree to the data usage policy';
    }

    //final validated student data
    const studentData={
        fullName,
        regNo,
        course,
        studyYear,
        emailInfo,
        phone,
        DOB,
        genderInfo,
        dietaryInfo,
        agreementPolicy
    };

    //source of true in the validator 
    const validated={
        isValid: Object.keys(errors).length===0,
        errors,
        studentData
    }

    return validated;
}

module.exports={validateRegistration};