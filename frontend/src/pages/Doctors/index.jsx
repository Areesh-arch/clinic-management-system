import { useState } from "react";

import Layout from "../../components/layout/Layout";

import DoctorHeader from "../../components/doctors/DoctorHeader";
import DoctorStats from "../../components/doctors/DoctorStats";
import DoctorSearch from "../../components/doctors/DoctorSearch";
import DoctorFilters from "../../components/doctors/DoctorFilters";
import DoctorTable from "../../components/doctors/DoctorTable";
import DoctorModal from "../../components/doctors/DoctorModal";
import DoctorForm from "../../components/doctors/DoctorForm";

function Doctors() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">

        <DoctorHeader
          onAddDoctor={() => setShowModal(true)}
        />

        <DoctorStats />

        <DoctorSearch
          search={search}
          setSearch={setSearch}
        />

        <DoctorFilters
          status={status}
          setStatus={setStatus}
        />

        <DoctorTable
          search={search}
          status={status}
        />

      </div>

      {showModal && (
        <DoctorModal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <DoctorForm />
        </DoctorModal>
      )}
    </Layout>
  );
}

export default Doctors;