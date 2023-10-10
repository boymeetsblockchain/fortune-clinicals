import React, { useState } from 'react';
import Fortune from './admincomponents/Fortune';
import Esh from './admincomponents/Esh';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activePatient, setActivePatient }) => {
    const navigate= useNavigate()
  return (
    <nav className="bg-[#FF5162] w-full text-white h-auto p-4">
        <button onClick={()=>navigate('/admin')}>Back to DashBoard</button>
      <div className="max-w-screen-xl mx-auto">
        <ul className='flex  justify-between '>
          <li
            className={`cursor-pointer mb-2 ${
              activePatient === 'patient1' ? 'font-bold' : ''
            }`}
            onClick={() => setActivePatient('patient1')}
          >
            Fortune
          </li>
          <li
            className={`cursor-pointer mb-2 ${
              activePatient === 'patient2' ? 'font-bold' : ''
            }`}
            onClick={() => setActivePatient('patient2')}
          >
            Esh
          </li>
        </ul>
      </div>
    </nav>
  );
};

const PatientDetail = ({ activePatient }) => {
  return (
    <div className="flex-grow p-4">
      {activePatient === 'patient1' && (
        <div>
          <Fortune />
        </div>
      )}
      {activePatient === 'patient2' && (
        <div>
          <Esh />
        </div>
      )}
    </div>
  );
};

const AdminPatients = () => {
  const [activePatient, setActivePatient] = useState('patient1');

  return (
    <div>
      <Navbar activePatient={activePatient} setActivePatient={setActivePatient} />
      <div className="flex">
        <PatientDetail activePatient={activePatient} />
      </div>
    </div>
  );
};

export default AdminPatients;
