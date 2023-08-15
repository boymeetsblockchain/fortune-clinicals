import React from 'react'
import Navbar from '../components/Navbar'
const PatientDetails= {
    patientName: "Jackson Kelly",
    age: 39,
    gender:"male",
    phoneNumber: "333-333-3333",
    dateRegistered: "2023-08-25",
    registeredBy: "Noah",
    regNumber:'2023/34/9'
  }

function PatientDetail() {
  return (
     <>
     <Navbar/>
     <div className="mx-auto max-w-screen-xl my-5 h-full w-full px-4 md:px-8 lg:px-12">
        {PatientDetails.patientName}
     </div>
     </>
  )
}

export default PatientDetail