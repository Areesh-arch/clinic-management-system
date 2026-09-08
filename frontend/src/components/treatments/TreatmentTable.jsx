import TreatmentRow from "./TreatmentRow";


function TreatmentTable({
  treatments,
  search,
  status,
  onEdit,
  onDelete,
}) {

  const filteredTreatments =
    treatments.filter((item) => {

      const patientName =
        item.patient_name ||
        item.patient?.name ||
        [
          item.patient?.first_name,
          item.patient?.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        "";


      const patientMrn =
        item.medical_record_number ||
        item.patient_mrn ||
        item.patient?.medical_record_number ||
        item.patient?.mrn ||
        "";


      const treatmentName =
        item.treatment ||
        item.diagnosis ||
        "";


      const searchValue =
        search.toLowerCase().trim();


      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(searchValue) ||

        patientMrn
          .toLowerCase()
          .includes(searchValue) ||

        treatmentName
          .toLowerCase()
          .includes(searchValue);


      const matchesStatus =
        status === "All" ||
        item.status === status;


      return (
        matchesSearch &&
        matchesStatus
      );

    });


  return (

    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E6E1D8]">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#F6F4EF]">

            <tr>

              <th className="text-left p-4">
                Patient
              </th>

              <th className="text-left p-4">
                Treatment
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Cost
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredTreatments.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-10 text-gray-500"
                >
                  No treatments found.
                </td>

              </tr>

            ) : (

              filteredTreatments.map(
                (treatment) => (

                  <TreatmentRow
                    key={
                      treatment.id
                    }

                    treatment={
                      treatment
                    }

                    onEdit={
                      onEdit
                    }

                    onDelete={
                      onDelete
                    }
                  />

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}


export default TreatmentTable;