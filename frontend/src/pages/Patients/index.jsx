import { useState } from "react";

import PatientModal from "../../components/patients/PatientModal";
import PatientForm from "../../components/patients/PatientForm";
import Layout from "../../components/layout/Layout";

import PatientHeader from "../../components/patients/PatientHeader";
import PatientStats from "../../components/patients/PatientStats";
import PatientSearch from "../../components/patients/PatientSearch";
import PatientFilters from "../../components/patients/PatientFilters";
import PatientTable from "../../components/patients/PatientTable";
function Patients() {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [gender, setGender] = useState("All");
  const [showModal, setShowModal] = useState(false);
  return (
    <Layout>

      <div className="space-y-8">

        <PatientHeader
         onAddPatient={() => setShowModal(true)}
        />

        <PatientStats />

        <div className="flex flex-col lg:flex-row justify-between gap-4">

          <PatientSearch
            search={search}
            setSearch={setSearch}
          />

          <PatientFilters
            status={status}
            setStatus={setStatus}
            gender={gender}
            setGender={setGender}
          />

        </div>

        <PatientTable
          search={search}
          status={status}
          gender={gender}
        />

      </div>
      {showModal && (
        <PatientModal onClose={() => setShowModal(false)}>
          <PatientForm />
        </PatientModal>
      )}
    </Layout>
    
  );
}

export default Patients;