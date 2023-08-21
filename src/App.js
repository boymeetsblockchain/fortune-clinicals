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
import ProductDetails from './screens/ProductDetails'
import AddNewPatient from './screens/AddNewPatient'
const App = () => {
  return (
    
   <BrowserRouter>
   <Routes>
        <Route path='/' index element={<Homescreen/>}/>
        <Route path='/auth' element={<Auth/>}/> 
         <Route path='/dashboard' element={<PrivateRoute/>}>
         <Route path='/dashboard' element={<Dashboard/>}/>
         </Route>
        <Route path='/dashboard/patient/:id' element={<PatientDetail/>}/>
        <Route path='/dashboard/profile' element={<Profile/>}/>
        <Route path='/dashboard/patients' element={<Patients/>}/>
        <Route path='/add-new' element={<AddNewPatient/>}/>
        <Route path='/dashboard/products' element={<ProductDetails/>}/>
        
    </Routes>
    <Toaster/>
   </BrowserRouter>
   
  )
}

export default App