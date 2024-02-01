
import Auth from './screens/Auth'
import Dashboard from './screens/Dashboard'
import Patients from './screens/Patients'
import ProductDetail from './screens/ProductDetail'
import PatientDetail from './screens/PatientDetail'
import EshProduct from './screens/esh/EshProduct'
import EshPatient from './screens/esh/EshPatient'
import { Toaster } from 'react-hot-toast'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Profile from './screens/Profile'
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
import AdminPatients from './screens/admin/AdminPatients'
import AdminNotes from './screens/admin/AdminNotes'
import BreakDown from './components/BreakDown'
import NewBreakDown from './components/NewBreakDown'
import AdminMessage from './screens/admin/AdminMessage'
import AdminProfile from './screens/admin/AdminProfile'
import AdminPatientDetails from './screens/admin/AdminPatientDetails'
import AdminEshPatient from './screens/admin/AdminEshPatient'
import ESH from './screens/esh/Esh'
import EshMessage from './screens/esh/EshMessage'
import AddNew from './screens/admin/admincomponents/AddNew'
import AddNewEsh from './screens/admin/admincomponents/AddNewEsh'
import AdminProducts from './screens/admin/AdminProducts'
import AdminStaff from './screens/admin/AdminStaff'
import AdminAddStaff from './screens/admin/AdminAddStaff'
import AdminStaffDetail from './screens/admin/AdminStaffDetail'
import AdminUser from './screens/admin/AdminUser'
import ProductsMoney from './screens/ProductsMoney'
import AdminProductFund from './screens/admin/AdminProductFunds'
import EshProductsFunds from './screens/esh/EshProductsFunds'
import AdminProductFundEsh from './screens/admin/AdminProductFundsEsh'
import NewCalender from './screens/NewCalender'
import EshData from './screens/admin/EshData'
import EshBreakDown from './components/EshBreakDown'
import PrivateRoute from './components/AdminRoute'
const App = () => {
  return (
    
   <BrowserRouter>
   <Routes>
        {/* <Route path='/' index element={<Homescreen/>}/> */}
        <Route path='/' index element={<Auth/>}/> 
        
         <Route path='/dashboard' element={<Dashboard/>}/>
        
        <Route path='/dashboard/patient/:id' element={<PatientDetail/>}/>
        <Route path='/dashboard/product/:id' element={<ProductDetail/>}/>
        <Route path='/dashboard/profile' element={<Profile/>}/>
        <Route path='/dashboard/patients' element={<Patients/>}/>
        <Route path='/add-new' element={<AddNewPatient/>}/>
        <Route path='/daily' element={<Daily/>}/>
        <Route path='/esh-daily' element={<EshDaily/>}/>
        <Route path='/dashboard/products' element={<Products/>}/>
        {/* <Route path='/dashboard/calender' element={<Calender/>}/> */}
        <Route path='/add-new-product' element={<AddNewProduct/>}/>
        <Route path='/add-new-product-money' element={<ProductsMoney/>}/>
        <Route path='/update/:id' element={<UpdatePatient/>}/>
        <Route path='/update/esh/:id' element={<EshUpdatePatient/>}/>
        <Route path='/message' element={<Message/>}/>
         <Route path='/esh-patient/:id' element={<EshPatient/>}/>
         <Route path='/add-esh-patients' element={<AddEshPatient/>}/>
         <Route path='/esh/patients' element={<EshPatients/>}/>
         <Route path='/esh/profile' element={<EshProfile/>}/>
         <Route path='/esh/products' element={<EshProduct/>}/>
         <Route path='/esh/message' element={<EshMessage/>}/>
         <Route path='/esh' element={<ESH/>}/>
         <Route path='/esh/add-new-product' element={<AddNewEshProduct/>}/>
         <Route path='add-new-product-esh-money' element={<EshProductsFunds/>}/>
         <Route path='/esh/product/:id' element={<EshProductDetail/>}/>
           <Route path='/admin' element={<PrivateRoute/>}>
           <Route path='/admin' element={<Admin/>}/>
           <Route path='/admin/patients' element={<AdminPatients/>}/>
         <Route path='/admin/patient/:id' element={<AdminPatientDetails/>}/>
         <Route path='/admin/patient/esh/:id' element={<AdminEshPatient/>}/>
         <Route path='/admin/profile' element={<AdminProfile/>}/>
         <Route path='/admin/calender' element={<Calender/>}/>
         <Route path='/admin/calender/new' element={<NewCalender/>}/>
         <Route path='/admin/notes' element={<AdminNotes/>}/>
         <Route path='/admin/messages' element={<AdminMessage/>}/>
         <Route path='/admin/add-new' element={<AddNew/>}/>
         <Route path='/admin/add-new-esh' element={<AddNewEsh/>}/>
         <Route path='/admin/products' element={<AdminProducts/>}/>
         <Route path='/admin/products/add-money' element={<AdminProductFund/>}/>
         <Route path='/admin/staff' element={<AdminStaff/>}/>
         <Route path='/admin/staff/:month' element={<AdminStaffDetail/>}/>
         <Route path='/admin/add-staff' element={<AdminAddStaff/>}/>
         <Route path='/admin/user' element={<AdminUser/>}/>
         <Route path='/admin/eshdata' element={<EshData/>}/>
           </Route>
        
         <Route path='/payments/:monthName' element={<BreakDown/>}/>
         <Route path='/payments/new/:monthName' element={<NewBreakDown/>}/>
         <Route path='/esh/:monthName' element={<EshBreakDown/>}/>
       
         <Route path='/add-new-product-esh-money' element={<AdminProductFundEsh/>}/>
    </Routes>
    <Toaster/>
   </BrowserRouter>
   
  )
}

export default App