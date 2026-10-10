//selecting the html element using javascript
const registered=document.querySelector('#registered');
const totalRegistered=document.querySelector('#totalRegistered');
const totalAttended=document.querySelector('#totalAttended');
const totalPending=document.querySelector('#totalPending');
const totalCourse=document.querySelector('#totalCourse');
const submitForm=document.querySelector('#submitForm');
const seachStudent=document.querySelector('#seachStudent');
const filterByGender=document.querySelector('#filterByGender');
const filterByYear=document.querySelector('#filterByYear');
const exportCSV=document.querySelector('#exportCSV');
const studentList=document.querySelector('#studentList');

//The edit modal on the hidden select 
const editModal = document.querySelector('#editModal');
const editForm = document.querySelector('#editForm');
const editFullName = document.querySelector('#editFullName');
const editRegNo = document.querySelector('#editRegNo');
const editCourse = document.querySelector('#editCourse');
const editStudyYear = document.querySelector('#editStudyYear');
const editEmailInfo = document.querySelector('#editEmailInfo');
const editPhone = document.querySelector('#editPhone');
const editDOB = document.querySelector('#editDOB');
const editGenderInfo = document.querySelector('#editGenderInfo');
const editDietaryInfo = document.querySelector('#editDietaryInfo');
const cancelEdit = document.querySelector('#cancelEdit');
const saveEdit = document.querySelector('#saveEdit');

let registeredStudent=[];
let editingId=null;


//Fuction checking the response from the server after making the request 
function checkingServer(response) {
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('The no student register. Please try again later');
        } else if (response.status === 429) {
            throw new Error(`Too many requests. Please wait a moment and try later.`);
        } else if (response.status >= 500) {
            throw new Error(`The server is currently overloaded. Please try again later.`);
        } else {
            throw new Error(`Server Error (${response.status}). Please try again.`);
        }
    }
}

//Updating the summary cards
function updateSummaryCards(student){
    //1.card displaying total registerd students
    const totalStudent=student.length;
    totalRegistered.textContent=totalStudent;

    //2.card displaying the total that have checked in 
    const checked=student.filter(confirm=>confirm.attended===true);
    const studentAttended=checked.length;
    totalAttended.textContent=studentAttended;

    //3.card displaying the student that have not yet confirmed attendance
    const notChecked=student.filter(notConfirm=>notConfirm.attended===false);
    const studentNotConfirm=notChecked.length;
    totalPending.textContent=studentNotConfirm;

    //4.card displaying filter the student by course
    const courses=new Set(student.map(set=> set.studentInfo.course));
    totalCourse.textContent=courses.size

    registered.textContent=totalStudent + '\u00A0'
}

//The function that handle the filter by gender
function filterGenderHandler(gender){
    //Select filter by gender select value
    if(gender==='All'){
        renderContent(registeredStudent);
    }else{
    const studentGender=registeredStudent.filter(student=>student.studentInfo.genderInfo===gender)
    renderContent(studentGender);
    }
}

//The function that handles the filter by year
function filterYearHandler(year){
   if(year==='All'){
    renderContent(registeredStudent)
   }else{
        const studentYear=registeredStudent.filter(student=>student.studentInfo.studyYear===year)
        renderContent(studentYear);
   }
}


//Fuction that renders the student on the list once they have registered on student registration form
function renderContent(info){
    studentList .innerHTML='';

    info.forEach((student)=>{
        const newLi=document.createElement('li');
        newLi.dataset.id=`${student.id}`;

        const profileDiv=document.createElement('div');
        profileDiv.className='profile-label';

        const infoDiv=document.createElement('div');
        infoDiv.className='student-info';

        const heading4=document.createElement('h4');
        heading4.textContent=student.studentInfo.fullName;

        const firstP=document.createElement('p');

        const regSpan=document.createElement('span');
        regSpan.className='reg-num';
        regSpan.textContent=student.studentInfo.regNo;

        const courseSpan=document.createElement('span');
        courseSpan.className='course-name';
        courseSpan.textContent=student.studentInfo.course;

        const secondP=document.createElement('p');
        
        const spanEmail=document.createElement('span');
        spanEmail.className='email-info';
        spanEmail.textContent=student.studentInfo.emailInfo;

        const spanPhone=document.createElement('span');
        spanPhone.className='phone-number';
        spanPhone.textContent=student.studentInfo.phone;
        
        const mainDiv=document.createElement('div');
        mainDiv.className='main-button';

        const markButton=document.createElement('button');
        markButton.classList.add('mark-attendance');
        markButton.textContent=student.attended ? 'Unmark Attendance' : 'Mark Attendance';

        const editButton=document.createElement('button');
        editButton.className='edit-attendance';
        editButton.textContent='Edit';

        const deleteButton=document.createElement('button');
        deleteButton.className='delete-attendance'
        deleteButton.textContent='Delete';

        const iconDiv=document.createElement('div');

        const verifySpan=document.createElement('span');
        verifySpan.classList.add('verify-attendance');
        if(!student.attended){
            verifySpan.classList.add('pending');
        }
        verifySpan.textContent=student.attended? 'Attended' : 'Pending';

        iconDiv.append(verifySpan);
        mainDiv.append(markButton,editButton,deleteButton);
        secondP.append(spanEmail,spanPhone);
        firstP.append(regSpan,courseSpan);
        infoDiv.append(heading4,firstP,secondP);
        newLi.append(profileDiv,infoDiv,mainDiv,iconDiv);
        studentList.append(newLi);
    });
}

//The export CSV file handler that deals with the CSV export
function exportStudentsToCSV() {
    if (registeredStudent.length === 0) {
        alert('No students to export.');
        return;
    }

    const header = 'Name,RegNo,Course,Year,Email,Phone,DOB,Gender,Dietary,Attended';

    const rows = registeredStudent.map(student => {
        const s = student.studentInfo;
        return [
            s.fullName,
            s.regNo,
            s.course,
            s.studyYear,
            s.emailInfo,
            s.phone,
            s.DOB,
            s.genderInfo,
            s.dietaryInfo,
            student.attended ? 'Yes' : 'No'
        ].join(',');
    });

    const csvString = header + '\n' + rows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
};
//fetch the registerd student from the server
async function fetchRegisteredStudent(){
   try{
     const response=await fetch('http://localhost:3000/api/registrations')
     checkingServer(response);
     const data=await response.json();
     if( data.length===0){
        throw new Error('No student information found')
     } 
     
    registeredStudent=data;
     renderContent( registeredStudent);
     updateSummaryCards(registeredStudent);
   }catch(error){
    console.log('Fetch error:',error.message);
    studentList.innerHTML=`<li style="padding:20px;text-align:center;color:#a71d2a;">${error.message}</li>`;
   }
   
}
    //Adding the user input after the edit click
    function fillModuleForm(info){ 
        editFullName.value=info.studentInfo.fullName;
        editRegNo.value=info.studentInfo.regNo;
        editCourse.value=info.studentInfo.course;
        editStudyYear.value=info.studentInfo.studyYear;
        editEmailInfo.value=info.studentInfo.emailInfo;
        editPhone.value=info.studentInfo.phone;
        editDOB.value=info.studentInfo.DOB;
        editGenderInfo.value=info.studentInfo.genderInfo;
        editDietaryInfo.value=info.studentInfo.dietaryInfo;
    }
    //Retrieving the values from the module after Edit
    function saveChangeEdit(){
        const student=registeredStudent.find(info=>info.id===editingId);
        if(!student)return;

        student.studentInfo.fullName=editFullName.value.trim();
        student.studentInfo.regNo=editRegNo.value.trim();
        student.studentInfo.course=editCourse.value.trim();
        student.studentInfo.studyYear=editStudyYear.value.trim();
        student.studentInfo.emailInfo=editEmailInfo.value.trim();
        student.studentInfo.phone=editPhone.value.trim();
        student.studentInfo.DOB=editDOB.value.trim();
        student.studentInfo.genderInfo=editGenderInfo.value.trim();
        student.studentInfo.dietaryInfo=editDietaryInfo.value.trim();

        renderContent(registeredStudent);
        updateSummaryCards(registeredStudent);

        editModal.hidden=true;
        editingId=null;
    }

    //Fuction that handle the delect of student
    function deleteStudent(id){
        const index=registeredStudent.findIndex(student=>student.id===id)
        if(index===-1)return;
        registeredStudent.splice(index,1);
        renderContent(registeredStudent);
        updateSummaryCards(registeredStudent);
    }
    //Event listener that listen to the gender input and update the list on the admin screen
    filterByGender.addEventListener('input',()=>{
        const gender=filterByGender.value;
        filterGenderHandler(gender)
    })

    //Eventlistener that listen to the year input and update the list on admin screen
    filterByYear.addEventListener('input',()=>{
        const year=filterByYear.value;
        filterYearHandler(year);
    })

    //Event listener that handles the mark attendance button
    studentList.addEventListener('click', (event) => {
        const mark = event.target.closest('[data-id]');
        if (!mark) return;

        const markBtn = event.target.closest('.mark-attendance');
        if (!markBtn) return;

        const id = mark.dataset.id;
        const markId = registeredStudent.find(student => student.id === id);
        if (!markId) return;

        markId.attended = !markId.attended;
        const verifyAttendance = mark.querySelector('.verify-attendance');

    if (markId.attended) {
        verifyAttendance.classList.remove('pending');
        verifyAttendance.textContent = 'Attended';
        markBtn.textContent = 'Unmark Attendance';
    } else {
        verifyAttendance.classList.add('pending');
        verifyAttendance.textContent = 'Pending';
        markBtn.textContent = 'Mark Attendance';
    }
    updateSummaryCards(registeredStudent);
});

    //Event listener on the CSV export button
    exportCSV.addEventListener('click',exportStudentsToCSV);
    //Event listener that handles the edit button on the list
     studentList.addEventListener('click', (event)=>{
        const editLi=event.target.closest('[data-id]');
        if(!editLi)return;
        const editBtn=event.target.closest('.edit-attendance');
        if(!editBtn)return;
        editModal.hidden = false;

        editingId=editLi.dataset.id;
        const editObject=registeredStudent.find(student=>student.id===editingId)
        fillModuleForm(editObject)
     })

     //Event listerner that handle the save change button on the module over display
     editForm.addEventListener('submit', (event)=>{
        event.preventDefault()
       saveChangeEdit()
     })

     //Event listener that handle the cancel button on the module edit display
     cancelEdit.addEventListener('click',()=>{
        editModal.hidden=true;
        editingId=null;
     })

    //Event Listener that handle the delete button
    studentList.addEventListener('click',(event)=>{
        const deletBtn=event.target.closest('.delete-attendance');
        const card=event.target.closest('[data-id]');
        if(!card)return;
        const id=card.dataset.id;
        if(deletBtn){
            if(window.confirm('Delete this student? This cannot be undone.')){
                deleteStudent(id)
            }
        }
    })
fetchRegisteredStudent();
