
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
        item?.patient_name ||
        item?.patient?.name ||
        [
          item?.patient?.first_name,
          item?.patient?.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        "";

      const patientMrn =
        item?.medical_record_number ||
        item?.patient_mrn ||
        item?.patient?.medical_record_number ||
        item?.patient?.mrn ||
        "";

      const treatmentName =
        item?.treatment ||
        item?.diagnosis ||
        "";

      const searchValue = String(search || "")
        .toLowerCase()
        .trim();

      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(searchValue) ||
        String(patientMrn)
          .toLowerCase()
          .includes(searchValue) ||
        treatmentName
          .toLowerCase()
          .includes(searchValue);

      const normalizedStatus = String(item?.status || "")
        .trim()
        .toUpperCase()
        .replace(/-/g, "_");

      const normalizedFilter = String(status || "All")
        .trim()
        .toUpperCase()
        .replace(/-/g, "_");

      const matchesStatus =
        normalizedFilter === "ALL" ||
        normalizedStatus === normalizedFilter;

      return matchesSearch && matchesStatus;
    });

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#E3DED2]
        bg-[#FFFDF8]
        shadow-[0_4px_18px_rgba(23,59,50,0.05)]
      "
    >
      {/* =================================================
          TABLE HEADER
          ================================================= */}
      <div
        className="
          flex
          flex-col
          gap-1
          border-b
          border-[#E7E1D5]
          px-5
          py-4
          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-1
            sm:flex-row
            sm:items-center
          "
        >
          <div>
            <h3
              className="
                text-base
                font-bold
                text-[#173B32]
              "
            >
              Treatment Records
            </h3>

            {/* Gold accent line */}
            <div
              className="
                mt-2
                h-0.5
                w-16
                rounded-full
                bg-[#B4935A]
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-[#87918C]
              "
            >
              Patient treatment and visit history
            </p>
          </div>

          <span
            className="
              w-fit
              rounded-full
              border
              border-[#D9E2DC]
              bg-[#F1F5F2]
              px-3
              py-1
              text-[11px]
              font-bold
              text-[#527565]
            "
          >
            {filteredTreatments.length}{" "}
            {filteredTreatments.length === 1
              ? "record"
              : "records"}
          </span>
        </div>
      </div>

      {/* =================================================
          RESPONSIVE TABLE
          ================================================= */}
      <div className="overflow-x-auto">
        <table
          className="
            w-full
            min-w-225
            border-collapse
          "
        >
          <thead
            className="
              bg-[#173B32]
            "
          >
            <tr>
              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-6
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Patient
              </th>

              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-5
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Treatment
              </th>

              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-5
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Date
              </th>

              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-5
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Cost
              </th>

              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-5
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Status
              </th>

              <th
                className="
                  whitespace-nowrap
                  border-b
                  border-[#B4935A]
                  px-5
                  py-4
                  text-left
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#FFFDF8]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTreatments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-16
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      max-w-sm
                      flex-col
                      items-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#F1F5F2]
                        text-xl
                        text-[#6F8F7D]
                      "
                    >
                      ✦
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        font-bold
                        text-[#30453D]
                      "
                    >
                      No treatments found
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-[#8A948F]
                      "
                    >
                      Try changing your search or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTreatments.map((treatment) => (
                <TreatmentRow
                  key={treatment.id}
                  treatment={treatment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =================================================
          MOBILE HINT
          ================================================= */}
      {filteredTreatments.length > 0 && (
        <div
          className="
            border-t
            border-[#E7E1D5]
            bg-[#FAF8F2]
            px-5
            py-2.5
            text-center
            text-[10px]
            font-medium
            text-[#89938E]
            sm:hidden
          "
        >
          Swipe horizontally to view all columns
        </div>
      )}
    </div>
  );
}

export default TreatmentTable;
