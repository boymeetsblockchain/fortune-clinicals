import React from 'react'
import Auth from './screens/Auth'
import Homescreen from './screens/Homescreen'
import Dashboard from './screens/Dashboard'
import Patients from './screens/Patients'
import ProductDetail from './screens/ProductDetail'
import PatientDetail from './screens/PatientDetail'
import EshProduct from './screens/esh/EshProduct'
import EshPatient from './screens/esh/EshPatient'
import { Toaster } from 'react-hot-toast'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Profile from './screens/Profile'
import PrivateRoute from './components/PrivateRoute'
import Products from './screens/Products'
import AddNewPatient from './screens/AddNewPatient'
import AddNewProduct from './screens/AddNewProduct'
import Message from './screens/Message'
import EshPatients from './screens/esh/EshPatients'
import AddEshPatient from './screens/esh/AddEshPatient'
import EshProfile from './screens/esh/EshProfile'
import AddNewEshProduct from './screens/esh/AddNewEshProduct'
import EshProductDetail from './screens/esh/EshProductDetail'
import Calender from './screens/Calender'
import Daily from './screens/Daily'
import EshDaily from './screens/esh/EshDaily'
import UpdatePatient from './screens/UpdatePatient'
import EshUpdatePatient from './screens/esh/EshUpdatePatient'
import Admin from './screens/admin/Admin'
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
        <Route path='/dashboard/product/:id' element={<ProductDetail/>}/>
        <Route path='/dashboard/profile' element={<Profile/>}/>
        <Route path='/dashboard/patients' element={<Patients/>}/>
        <Route path='/add-new' element={<AddNewPatient/>}/>
        <Route path='/daily' element={<Daily/>}/>
        <Route path='/esh-daily' element={<EshDaily/>}/>
        <Route path='/dashboard/products' element={<Products/>}/>
        <Route path='/dashboard/calender' element={<Calender/>}/>
        <Route path='/add-new-product' element={<AddNewProduct/>}/>
        <Route path='/update/:id' element={<UpdatePatient/>}/>
        <Route path='/update/esh/:id' element={<EshUpdatePatient/>}/>
        <Route path='/message' element={<Message/>}/>
         <Route path='/esh-patient/:id' element={<EshPatient/>}/>
         <Route path='/add-esh-patients' element={<AddEshPatient/>}/>
         <Route path='/esh/patients' element={<EshPatients/>}/>
         <Route path='/esh/profile' element={<EshProfile/>}/>
         <Route path='/esh/products' element={<EshProduct/>}/>
         <Route path='/esh/add-new-product' element={<AddNewEshProduct/>}/>
         <Route path='/esh/product/:id' element={<EshProductDetail/>}/>
         <Route path='/admin' element={<Admin/>}/>
    </Routes>
    <Toaster/>
   </BrowserRouter>
   
  )
}

export default App