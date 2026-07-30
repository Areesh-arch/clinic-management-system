import { useState } from "react";

import Layout from "../../components/layout/Layout";

import MedicineHeader from "../../components/inventory/MedicineHeader";
import MedicineStats from "../../components/inventory/MedicineStats";
import MedicineSearch from "../../components/inventory/MedicineSearch";
import MedicineFilters from "../../components/inventory/MedicineFilters";
import MedicineTable from "../../components/inventory/MedicineTable";
import MedicineModal from "../../components/inventory/MedicineModal";


export default function Inventory() {

  const [showModal, setShowModal] = useState(false);


  return (

    <Layout>

      <div className="space-y-8">


        <MedicineHeader
          onAddMedicine={() => setShowModal(true)}
        />


        <MedicineStats />


        <div className="flex justify-between items-center mb-6 gap-4">

          <div className="flex-1">
            <MedicineSearch />
          </div>


          <MedicineFilters />

        </div>


        <MedicineTable />


      </div>


      {showModal && (

        <MedicineModal
          onClose={() => setShowModal(false)}
        />

      )}


    </Layout>

  );
}