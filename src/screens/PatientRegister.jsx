import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../firebase.config';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';

function PatientRegister() {
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientRef = collection(db, "patients");
        const querySnapshot = await getDocs(patientRef);

        let fetchedPatients = [];
        querySnapshot.forEach((doc) => {
          fetchedPatients.push(doc.data());
        });

        setPatient(fetchedPatients);
        setLoading(false);
        console.log(patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
        toast.error("Error fetching patient data");
      }
    };

    fetchPatient();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {patient.map((patientData, index) => (
            <div key={index}>
              {/* Display patient data */}
              {/* Example: <p>{patientData.name}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientRegister;
