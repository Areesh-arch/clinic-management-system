import { useEffect, useState } from "react";
import {
  FiDownload,
  FiLoader,
  FiPrinter,
  FiX,
} from "react-icons/fi";
import jsPDF from "jspdf";

import { getPrescription } from "../../services/prescriptionService";

export default function MedicineIssueSlip({
  record,
  onClose,
}) {
  const [prescription, setPrescription] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadPrescription =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getPrescription(
              record.prescription_id
            );

          if (mounted) {
            setPrescription(data);
          }
        } catch (err) {
          console.error(
            "Failed to load medicine slip:",
            err
          );

          if (mounted) {
            setError(
              err?.message ||
                "Failed to load medicine slip."
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    if (record?.prescription_id) {
      loadPrescription();
    } else {
      setLoading(false);
      setError(
        "Prescription information is not available."
      );
    }

    return () => {
      mounted = false;
    };
  }, [record]);

  const items =
    prescription?.items || [];

  const medicineTotal =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.total_amount || 0),
      0
    );

  const formatMoney = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date =
      new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );

    if (!printWindow) {
      return;
    }

    const rows = items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <strong>${item.medicine_name || "—"}</strong>
            </td>
            <td>
              ${item.quantity || 0}
              ${item.medicine_unit || ""}
            </td>
            <td>${item.dosage || "—"}</td>
            <td>${item.frequency || "—"}</td>
            <td>${item.duration || "—"}</td>
            <td>${formatMoney(
              item.total_amount
            )}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medicine Issue Slip</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 32px;
              background: #ffffff;
              color: #173c32;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            .page {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 18px;
              border-bottom: 3px solid #173c32;
            }

            .brand {
              font-size: 24px;
              font-weight: 700;
              letter-spacing: 0.3px;
            }

            .subtitle {
              margin-top: 5px;
              color: #718078;
              font-size: 12px;
            }

            .title {
              text-align: right;
              font-size: 18px;
              font-weight: 700;
            }

            .gold {
              width: 55px;
              height: 3px;
              margin: 8px 0 0 auto;
              background: #b4935a;
            }

            .patient {
              margin-top: 22px;
              padding: 16px;
              background: #f7f4ec;
              border: 1px solid #e7e1d5;
              border-radius: 10px;
            }

            .patient-grid {
              display: grid;
              grid-template-columns:
                repeat(3, 1fr);
              gap: 16px;
            }

            .label {
              color: #718078;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.7px;
              margin-bottom: 5px;
            }

            .value {
              font-size: 13px;
              font-weight: 600;
              color: #173c32;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
              font-size: 10px;
            }

            th {
              padding: 10px 7px;
              background: #173c32;
              color: white;
              text-align: left;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.4px;
            }

            td {
              padding: 10px 7px;
              border-bottom: 1px solid #e7e1d5;
              vertical-align: top;
            }

            .total {
              margin-top: 18px;
              display: flex;
              justify-content: flex-end;
            }

            .total-box {
              min-width: 230px;
              padding: 14px 18px;
              border-top: 2px solid #b4935a;
              background: #f7f4ec;
              text-align: right;
            }

            .total-label {
              color: #718078;
              font-size: 11px;
            }

            .total-value {
              margin-top: 4px;
              font-size: 19px;
              font-weight: 700;
              color: #173c32;
            }

            .footer {
              margin-top: 45px;
              padding-top: 14px;
              border-top: 1px solid #e7e1d5;
              text-align: center;
              color: #718078;
              font-size: 10px;
            }

            @media print {
              body {
                padding: 15px;
              }

              @page {
                size: A4;
                margin: 12mm;
              }
            }
          </style>
        </head>

        <body>
          <div class="page">

            <div class="header">
              <div>
                <div class="brand">
                  Clinic Book
                </div>

                <div class="subtitle">
                  Medicine Issue Record
                </div>
              </div>

              <div>
                <div class="title">
                  MEDICINE SLIP
                </div>

                <div class="gold"></div>
              </div>
            </div>

            <div class="patient">
              <div class="patient-grid">

                <div>
                  <div class="label">
                    Patient
                  </div>

                  <div class="value">
                    ${record.patient_name || "—"}
                  </div>
                </div>

                <div>
                  <div class="label">
                    Medical Record No.
                  </div>

                  <div class="value">
                    ${
                      record.medical_record_number ||
                      "—"
                    }
                  </div>
                </div>

                <div>
                  <div class="label">
                    Date
                  </div>

                  <div class="value">
                    ${formatDate(
                      record.date
                    )}
                  </div>
                </div>

              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                ${rows}
              </tbody>
            </table>

            <div class="total">
              <div class="total-box">
                <div class="total-label">
                  Medicine Total
                </div>

                <div class="total-value">
                  ${formatMoney(
                    medicineTotal
                  )}
                </div>
              </div>
            </div>

            <div class="footer">
              This slip is generated from the clinic medicine log.
            </div>

          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // =========================================================
  // SAVE PDF
  // =========================================================

  const handleDownload = () => {
    if (!items.length) {
      return;
    }

    const doc =
      new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const margin = 15;

    // Header
    doc.setTextColor(
      23,
      60,
      50
    );

    doc.setFontSize(19);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Clinic Book",
      margin,
      20
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.setTextColor(
      113,
      128,
      120
    );

    doc.text(
      "Medicine Issue Record",
      margin,
      27
    );

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");

    doc.setTextColor(
      23,
      60,
      50
    );

    doc.text(
      "MEDICINE SLIP",
      pageWidth - margin,
      20,
      {
        align: "right",
      }
    );

    doc.setDrawColor(
      180,
      147,
      90
    );

    doc.setLineWidth(1);

    doc.line(
      pageWidth - 42,
      25,
      pageWidth - margin,
      25
    );

    doc.setDrawColor(
      23,
      60,
      50
    );

    doc.setLineWidth(0.7);

    doc.line(
      margin,
      34,
      pageWidth - margin,
      34
    );

    // Patient information box

    doc.setFillColor(
      247,
      244,
      236
    );

    doc.setDrawColor(
      231,
      225,
      213
    );

    doc.roundedRect(
      margin,
      42,
      pageWidth -
        margin * 2,
      30,
      3,
      3,
      "FD"
    );

    const col1 = margin + 5;
    const col2 =
      margin + 68;
    const col3 =
      margin + 130;

    doc.setFontSize(7);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      113,
      128,
      120
    );

    doc.text(
      "PATIENT",
      col1,
      50
    );

    doc.text(
      "MEDICAL RECORD NO.",
      col2,
      50
    );

    doc.text(
      "DATE",
      col3,
      50
    );

    doc.setFontSize(9);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      23,
      60,
      50
    );

    doc.text(
      String(
        record.patient_name ||
          "—"
      ),
      col1,
      57
    );

    doc.text(
      String(
        record.medical_record_number ||
          "—"
      ),
      col2,
      57
    );

    doc.text(
      formatDate(record.date),
      col3,
      57
    );

    // Table

    let y = 84;

    const columns = [
      {
        label: "#",
        x: margin,
        width: 9,
      },
      {
        label: "Medicine",
        x: margin + 9,
        width: 39,
      },
      {
        label: "Qty",
        x: margin + 48,
        width: 18,
      },
      {
        label: "Dosage",
        x: margin + 66,
        width: 28,
      },
      {
        label: "Frequency",
        x: margin + 94,
        width: 29,
      },
      {
        label: "Duration",
        x: margin + 123,
        width: 28,
      },
      {
        label: "Amount",
        x: margin + 151,
        width: 29,
      },
    ];

    const tableWidth =
      pageWidth -
      margin * 2;

    doc.setFillColor(
      23,
      60,
      50
    );

    doc.rect(
      margin,
      y,
      tableWidth,
      9,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(6.5);
    doc.setFont(
      "helvetica",
      "bold"
    );

    columns.forEach(
      (column) => {
        doc.text(
          column.label,
          column.x + 2,
          y + 5.8
        );
      }
    );

    y += 9;

    doc.setFont(
      "helvetica",
      "normal"
    );

    items.forEach(
      (item, index) => {
        const rowHeight = 13;

        doc.setFillColor(
          255,
          253,
          248
        );

        doc.setDrawColor(
          231,
          225,
          213
        );

        doc.rect(
          margin,
          y,
          tableWidth,
          rowHeight,
          "FD"
        );

        doc.setTextColor(
          23,
          60,
          50
        );

        doc.setFontSize(7);

        doc.text(
          String(index + 1),
          margin + 3,
          y + 7
        );

        const medicine =
          doc.splitTextToSize(
            String(
              item.medicine_name ||
                "—"
            ),
            35
          );

        doc.text(
          medicine,
          margin + 11,
          y + 5
        );

        doc.text(
          `${item.quantity || 0} ${
            item.medicine_unit || ""
          }`,
          margin + 50,
          y + 7
        );

        doc.text(
          String(
            item.dosage || "—"
          ),
          margin + 68,
          y + 7
        );

        doc.text(
          String(
            item.frequency || "—"
          ),
          margin + 96,
          y + 7
        );

        doc.text(
          String(
            item.duration || "—"
          ),
          margin + 125,
          y + 7
        );

        doc.text(
          formatMoney(
            item.total_amount
          ),
          margin + 153,
          y + 7
        );

        y += rowHeight;
      }
    );

    // Total

    y += 8;

    doc.setFillColor(
      247,
      244,
      236
    );

    doc.setDrawColor(
      180,
      147,
      90
    );

    doc.setLineWidth(0.8);

    doc.rect(
      pageWidth - 75,
      y,
      60,
      22,
      "FD"
    );

    doc.setTextColor(
      113,
      128,
      120
    );

    doc.setFontSize(7);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "MEDICINE TOTAL",
      pageWidth - 70,
      y + 7
    );

    doc.setTextColor(
      23,
      60,
      50
    );

    doc.setFontSize(13);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      formatMoney(
        medicineTotal
      ),
      pageWidth - 20,
      y + 16,
      {
        align: "right",
      }
    );

    // Footer

    doc.setFontSize(7);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      113,
      128,
      120
    );

    doc.text(
      "This slip is generated from the clinic medicine log.",
      pageWidth / 2,
      285,
      {
        align: "center",
      }
    );

    doc.save(
      `medicine-slip-${record.medical_record_number || "patient"}.pdf`
    );
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-[#173C32]/55 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#E7E1D5] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#173C32]">
              Medicine Issue Slip
            </h2>

            <p className="mt-0.5 text-xs text-[#718078]">
              Review, print, or save this medicine record.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#718078] transition-colors hover:bg-[#F3F0E8] hover:text-[#173C32]"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-5 sm:p-7">

          {loading && (
            <div className="flex min-h-75 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-[#607068]">
                <FiLoader
                  className="animate-spin"
                  size={18}
                />
                Loading medicine slip...
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] p-5 text-sm font-medium text-[#8B554D]">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            prescription && (
              <div
                id="medicine-slip-preview"
                className="mx-auto max-w-3xl rounded-xl border border-[#E7E1D5] bg-white p-5 shadow-sm sm:p-8"
              >
                {/* SLIP HEADER */}

                <div className="flex flex-col gap-4 border-b-2 border-[#173C32] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#173C32]">
                      Clinic Book
                    </h1>

                    <p className="mt-1 text-xs text-[#718078]">
                      Medicine Issue Record
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-[#173C32]">
                      MEDICINE SLIP
                    </p>

                    <div className="ml-0 mt-2 h-1 w-14 rounded-full bg-[#B4935A] sm:ml-auto" />
                  </div>
                </div>

                {/* PATIENT */}

                <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-[#E7E1D5] bg-[#F7F4EC] p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#718078]">
                      Patient
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#173C32]">
                      {record.patient_name ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#718078]">
                      Medical Record No.
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#173C32]">
                      {record.medical_record_number ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#718078]">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#173C32]">
                      {formatDate(
                        record.date
                      )}
                    </p>
                  </div>
                </div>

                {/* MEDICINES */}

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-180 border-collapse">
                    <thead>
                      <tr className="bg-[#173C32] text-left text-[10px] uppercase tracking-wide text-white">
                        <th className="px-3 py-3">
                          #
                        </th>

                        <th className="px-3 py-3">
                          Medicine
                        </th>

                        <th className="px-3 py-3">
                          Qty
                        </th>

                        <th className="px-3 py-3">
                          Dosage
                        </th>

                        <th className="px-3 py-3">
                          Frequency
                        </th>

                        <th className="px-3 py-3">
                          Duration
                        </th>

                        <th className="px-3 py-3 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map(
                        (
                          item,
                          index
                        ) => (
                          <tr
                            key={
                              item.id ||
                              index
                            }
                            className="border-b border-[#E7E1D5] text-xs text-[#52635B]"
                          >
                            <td className="px-3 py-3">
                              {index + 1}
                            </td>

                            <td className="px-3 py-3 font-semibold text-[#173C32]">
                              {
                                item.medicine_name
                              }
                            </td>

                            <td className="px-3 py-3">
                              {
                                item.quantity
                              }{" "}
                              {
                                item.medicine_unit
                              }
                            </td>

                            <td className="px-3 py-3">
                              {
                                item.dosage
                              }
                            </td>

                            <td className="px-3 py-3">
                              {
                                item.frequency
                              }
                            </td>

                            <td className="px-3 py-3">
                              {
                                item.duration
                              }
                            </td>

                            <td className="px-3 py-3 text-right font-semibold text-[#173C32]">
                              {formatMoney(
                                item.total_amount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL */}

                <div className="mt-6 flex justify-end">
                  <div className="min-w-55 border-t-2 border-[#B4935A] bg-[#F7F4EC] px-5 py-4 text-right">
                    <p className="text-xs text-[#718078]">
                      Medicine Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#173C32]">
                      {formatMoney(
                        medicineTotal
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-8 border-t border-[#E7E1D5] pt-4 text-center text-[10px] text-[#718078]">
                  This slip is generated from the clinic medicine log.
                </p>
              </div>
            )}
        </div>

        {/* FOOTER ACTIONS */}

        {!loading &&
          !error &&
          prescription && (
            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] bg-[#F7F4EC]/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={
                  handlePrint
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#173C32] px-5 py-2.5 text-sm font-semibold text-[#173C32] transition-colors hover:bg-[#EAF0EB]"
              >
                <FiPrinter size={16} />
                Print
              </button>

              <button
                type="button"
                onClick={
                  handleDownload
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C32] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#245346]"
              >
                <FiDownload size={16} />
                Save PDF
              </button>
            </div>
          )}
      </div>
    </div>
  );
}