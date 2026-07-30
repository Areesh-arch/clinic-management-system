import { useState } from "react";

import Layout from "../../components/layout/Layout";

import TreatmentHeader from "../../components/treatments/TreatmentHeader";
import TreatmentStats from "../../components/treatments/TreatmentStats";
import TreatmentSearch from "../../components/treatments/TreatmentSearch";
import TreatmentFilters from "../../components/treatments/TreatmentFilters";
import TreatmentTable from "../../components/treatments/TreatmentTable";
import TreatmentModal from "../../components/treatments/TreatmentModal";
import TreatmentForm from "../../components/treatments/TreatmentForm";

function Treatments() {

  const [search, setSearch] = useState("");

  const [doctor, setDoctor] = useState("All");

  const [status, setStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);

  return (

    <Layout>

      <div className="space-y-8">

        <TreatmentHeader
          onAddTreatment={() => setShowModal(true)}
        />

        <TreatmentStats />

        <TreatmentSearch
          search={search}
          setSearch={setSearch}
        />

        <TreatmentFilters
          doctor={doctor}
          setDoctor={setDoctor}
          status={status}
          setStatus={setStatus}
        />

        <TreatmentTable
          search={search}
          doctor={doctor}
          status={status}
        />

      </div>

      {showModal && (

        <TreatmentModal
          open={showModal}
          onClose={() => setShowModal(false)}
        >

          <TreatmentForm />

        </TreatmentModal>

      )}

    </Layout>

  );
}

export default Treatments;