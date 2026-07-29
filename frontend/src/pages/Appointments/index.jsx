import { useState } from "react";
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

        <AppointmentHeader />

        <AppointmentStats />

        <div className="flex flex-col lg:flex-row justify-between gap-4">

          <AppointmentSearch />

          <AppointmentFilters />

        </div>

        <AppointmentTable />

      </div>

    </Layout>
  );
}

export default Appointments;