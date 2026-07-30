import { useState } from "react";

import AppointmentModal from "../../components/appointments/AppointmentModal";
import AppointmentForm from "../../components/appointments/AppointmentForm";

import Layout from "../../components/layout/Layout";

import AppointmentHeader from "../../components/appointments/AppointmentHeader";
import AppointmentStats from "../../components/appointments/AppointmentStats";
import AppointmentSearch from "../../components/appointments/AppointmentSearch";
import AppointmentFilters from "../../components/appointments/AppointmentFilters";
import AppointmentTable from "../../components/appointments/AppointmentTable";

function Appointments() {

  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState("All");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("All");
  const [showModal, setShowModal] = useState(false);
  return (
    <Layout>

      <div className="space-y-8">

        <AppointmentHeader
              onAddAppointment={() => setShowModal(true)}
        />

        <AppointmentSearch
          search={search}
          setSearch={setSearch}
      />

        <div className="flex flex-col lg:flex-row justify-between gap-4">

  <AppointmentFilters
    doctor={doctor}
    setDoctor={setDoctor}
    status={status}
    setStatus={setStatus}
    date={date}
    setDate={setDate}
  />

</div>

        <AppointmentTable
  search={search}
  doctor={doctor}
  status={status}
  date={date}
/>

      </div>

      {showModal && (

  <AppointmentModal
    open={showModal}
    onClose={() => setShowModal(false)}
  >

    <AppointmentForm />

  </AppointmentModal>

)}

    </Layout>
  );
}

export default Appointments;