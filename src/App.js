import React from 'react'
import Auth from './screens/Auth'
import Homescreen from './screens/Homescreen'
import Dashboard from './screens/Dashboard'
import Patients from './screens/Patients'
import PatientDetail from './screens/PatientDetail'
import { Toaster } from 'react-hot-toast'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Profile from './screens/Profile'
import PrivateRoute from './components/PrivateRoute'
import PatientRegister from './screens/PatientRegister'
const App = () => {
  return (
    
   <BrowserRouter>
   <Routes>
        <Route path='/' index element={<Homescreen/>}/>
        <Route path='/auth' element={<Auth/>}/> 
         <Route path='/dashboard' element={<PrivateRoute/>}>
         <Route path='/dashboard' element={<Dashboard/>}/>
         </Route>
        <Route path='/dashboard/patients/:id' element={<PatientDetail/>}/>
        <Route path='/dashboard/profile' element={<Profile/>}/>
        <Route path='/dashboard/patients/patient-details' element={<PatientRegister/>}/>
        <Route path='/dashboard/patients' element={<Patients/>}/>
    </Routes>
    <Toaster/>
   </BrowserRouter>
   
  )
}

export default App