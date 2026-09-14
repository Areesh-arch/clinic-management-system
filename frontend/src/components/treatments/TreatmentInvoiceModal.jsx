import { useEffect, useMemo, useState } from "react";

import "../../styles/TreatmentInvoiceModal.css";

import {
  FiDownload,
  FiLoader,
  FiPrinter,
  FiX,
} from "react-icons/fi";

import jsPDF from "jspdf";

import cmsService from "../../services/cmsService";

import {
  getPayments,
  getVisitOutstanding,
} from "../../services/invoiceService";

import TreatmentInvoicePrint from "./TreatmentInvoicePrint";

const API_BASE_URL = "http://127.0.0.1:8000";

/* ==========================================================
   HELPERS
   ========================================================== */

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `PKR ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function getInvoiceStatus(charge, paid) {
  const total = Number(charge || 0);
  const received = Number(paid || 0);

  if (total <= 0) return "unpaid";
  if (received >= total) return "paid";
  if (received > 0) return "partial";

  return "unpaid";
}

/*
 * FIX:
 * This function was missing from TreatmentInvoiceModal.jsx.
 * The PDF generator uses it for payment history.
 */
function getPaymentMethodLabel(method) {
  const normalized = String(method || "")
    .trim()
    .toLowerCase();

  const labels = {
    cash: "Cash",
    card: "Card",
    bank_transfer: "Bank Transfer",
    mobile_wallet: "Mobile Wallet",
  };

  return labels[normalized] || method || "—";
}

/*
 * Load an image for jsPDF.
 *
 * If the backend image has a CORS problem, return null instead
 * of crashing the entire PDF generation process.
 */
async function imageToDataUrl(url) {
  if (!url) return null;

  try {
    const response = await fetch(url, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load image: ${response.status}`
      );
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(
      "Invoice logo could not be loaded. Continuing without logo.",
      error
    );

    return null;
  }
}

function formatPdfDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ==========================================================
   COMPONENT
   ========================================================== */

export default function TreatmentInvoiceModal({
  open,
  treatment,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [payments, setPayments] = useState([]);
  const [outstanding, setOutstanding] = useState(null);
  const [error, setError] = useState("");

  /* ==========================================================
     LOAD DATA
     ========================================================== */

  useEffect(() => {
    if (!open || !treatment?.id) {
      return;
    }

    let cancelled = false;

    const loadInvoiceData = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          cmsService.getSiteSettings(),
          getPayments(),
          getVisitOutstanding(treatment.id),
        ]);

        if (cancelled) return;

        const settingsResult = results[0];
        const paymentsResult = results[1];
        const outstandingResult = results[2];

        /* ------------------------------------------------------
           SETTINGS
           ------------------------------------------------------ */

        if (settingsResult.status === "fulfilled") {
          setSettings(settingsResult.value || null);
        } else {
          setSettings(null);
        }

        /* ------------------------------------------------------
           PAYMENTS
           ------------------------------------------------------ */

        let normalizedPayments = [];

        if (paymentsResult.status === "fulfilled") {
          const rawPayments = paymentsResult.value;

          const paymentList = Array.isArray(rawPayments)
            ? rawPayments
            : Array.isArray(rawPayments?.items)
            ? rawPayments.items
            : Array.isArray(rawPayments?.data)
            ? rawPayments.data
            : [];

          normalizedPayments = paymentList.filter(
            (payment) =>
              Number(payment?.visit_id) ===
              Number(treatment.id)
          );
        }

        setPayments(normalizedPayments);

        /* ------------------------------------------------------
           OUTSTANDING
           ------------------------------------------------------ */

        if (outstandingResult.status === "fulfilled") {
          setOutstanding(
            outstandingResult.value || null
          );
        } else {
          setOutstanding(null);
        }

        /*
         * The outstanding endpoint can currently return 500.
         * Do NOT stop invoice generation because of that.
         */
        if (
          paymentsResult.status === "rejected" &&
          outstandingResult.status === "rejected"
        ) {
          setError(
            "Payment information could not be loaded. The invoice can still be generated."
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to load invoice information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInvoiceData();

    return () => {
      cancelled = true;
    };
  }, [open, treatment?.id]);

  /* ==========================================================
     INVOICE DATA
     ========================================================== */

  const invoiceData = useMemo(() => {
    if (!treatment) return null;

    const outstandingCharge = Number(
      outstanding?.total_charge ??
        outstanding?.charge ??
        0
    );

    const treatmentCharge = Number(
      treatment?.charge ??
        treatment?.cost ??
        treatment?.amount ??
        0
    );

    const charge =
      outstandingCharge > 0
        ? outstandingCharge
        : treatmentCharge;

    const paymentTotal = payments.reduce(
      (sum, payment) =>
        sum + Number(payment?.amount || 0),
      0
    );

    const paidFromOutstanding = Number(
      outstanding?.total_paid ?? 0
    );

    const paid =
      paidFromOutstanding > 0
        ? paidFromOutstanding
        : paymentTotal;

    const outstandingFromApi =
      outstanding?.outstanding_amount ??
      outstanding?.remaining_amount;

    const outstandingAmount =
      outstandingFromApi !== undefined &&
      outstandingFromApi !== null
        ? Number(outstandingFromApi)
        : Math.max(charge - paid, 0);

    const treatmentDate =
      treatment?.visit_date ||
      treatment?.date ||
      treatment?.created_at ||
      treatment?.appointment_date ||
      null;

    const invoiceNumber = `INV-${String(
      treatment.id
    ).padStart(6, "0")}`;

    const invoiceDate =
      treatment?.created_at ||
      treatmentDate ||
      new Date().toISOString();

    const patientName =
      treatment?.patient_name ||
      treatment?.patient?.name ||
      "Patient";

    const medicalRecordNumber =
      treatment?.medical_record_number ||
      treatment?.patient_mrn ||
      treatment?.patient?.medical_record_number ||
      "";

    const treatmentName =
      treatment?.treatment_name ||
      treatment?.treatment ||
      treatment?.procedure ||
      treatment?.title ||
      "Dermatology Treatment";

    const diagnosis =
      treatment?.diagnosis ||
      treatment?.diagnosis_name ||
      "";

    const chiefComplaint =
      treatment?.chief_complaint ||
      treatment?.reason ||
      "";

    return {
      invoiceNumber,
      date: invoiceDate,
      treatmentDate,
      patientName,
      medicalRecordNumber,
      treatmentName,
      diagnosis,
      chiefComplaint,
      appointmentId:
        treatment?.appointment_id || null,
      charge,
      paid,
      outstanding: Math.max(
        outstandingAmount,
        0
      ),
      status: getInvoiceStatus(
        charge,
        paid
      ),
    };
  }, [
    treatment,
    outstanding,
    payments,
  ]);

  /* ==========================================================
     LOGO
     ========================================================== */

  const logoUrl = useMemo(() => {
    const rawLogo = settings?.logo_url;

    if (!rawLogo) {
      return "";
    }

    if (
      rawLogo.startsWith("http://") ||
      rawLogo.startsWith("https://")
    ) {
      return rawLogo;
    }

    return `${API_BASE_URL}${
      rawLogo.startsWith("/") ? "" : "/"
    }${rawLogo}`;
  }, [settings]);

  /* ==========================================================
     PRINT
     ========================================================== */

  const handlePrint = () => {
    window.print();
  };

  /* ==========================================================
     DOWNLOAD PDF
     ========================================================== */

  const handleDownloadPdf = async () => {
    if (!invoiceData) return;

    setPdfLoading(true);
    setError("");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      /* ------------------------------------------------------
         A4 DIMENSIONS
         ------------------------------------------------------ */

      const PAGE_WIDTH = 210;
      const PAGE_HEIGHT = 297;
      const MARGIN = 9;
      const CONTENT_WIDTH =
        PAGE_WIDTH - MARGIN * 2;

      let y = MARGIN;

      /* ------------------------------------------------------
         COLORS
         ------------------------------------------------------ */

      const forest = "#173b32";
      const gold = "#a58b52";
      const ivory = "#f7f3e9";
      const card = "#fffdf8";
      const muted = "#687a72";
      const border = "#d9d1bf";

      /* ------------------------------------------------------
         CLINIC INFORMATION
         ------------------------------------------------------ */

      const clinicName =
        settings?.clinic_name ||
        settings?.name ||
        "Aesthetic & Dermatology Clinic";

      const phone =
        settings?.phone ||
        settings?.contact_phone ||
        "";

      const email =
        settings?.email ||
        settings?.contact_email ||
        "";

      const address =
        settings?.address ||
        settings?.clinic_address ||
        settings?.contact_address ||
        "";

      const eyebrow =
        settings?.homepage_eyebrow ||
        "AESTHETIC & DERMATOLOGY CLINIC";

      /* ======================================================
         HEADER
         ====================================================== */

      const logoDataUrl =
        await imageToDataUrl(logoUrl);

      if (logoDataUrl) {
        try {
          pdf.addImage(
            logoDataUrl,
            "AUTO",
            MARGIN,
            y,
            15,
            15
          );
        } catch (logoError) {
          console.warn(
            "Could not embed invoice logo:",
            logoError
          );

          pdf.setFillColor(forest);

          pdf.roundedRect(
            MARGIN,
            y,
            15,
            15,
            2,
            2,
            "F"
          );

          pdf.setTextColor("#ffffff");
          pdf.setFont(
            "helvetica",
            "bold"
          );
          pdf.setFontSize(11);

          pdf.text(
            clinicName
              .charAt(0)
              .toUpperCase(),
            MARGIN + 7.5,
            y + 10,
            {
              align: "center",
            }
          );
        }
      } else {
        pdf.setFillColor(forest);

        pdf.roundedRect(
          MARGIN,
          y,
          15,
          15,
          2,
          2,
          "F"
        );

        pdf.setTextColor("#ffffff");
        pdf.setFont(
          "helvetica",
          "bold"
        );
        pdf.setFontSize(11);

        pdf.text(
          clinicName
            .charAt(0)
            .toUpperCase(),
          MARGIN + 7.5,
          y + 10,
          {
            align: "center",
          }
        );
      }

      const textX = MARGIN + 19;

      pdf.setTextColor(gold);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(5.5);

      pdf.text(
        String(eyebrow).substring(
          0,
          65
        ),
        textX,
        y + 3
      );

      pdf.setTextColor(forest);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(12);

      pdf.text(
        String(clinicName).substring(
          0,
          55
        ),
        textX,
        y + 8
      );

      pdf.setTextColor(muted);
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(5.5);

      const contactText = [
        phone,
        email,
      ]
        .filter(Boolean)
        .join(" • ");

      if (contactText) {
        pdf.text(
          String(contactText).substring(
            0,
            75
          ),
          textX,
          y + 12
        );
      }

      if (address) {
        pdf.text(
          String(address).substring(
            0,
            75
          ),
          textX,
          y + 15
        );
      }

      pdf.setTextColor(forest);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(16);

      pdf.text(
        "INVOICE",
        PAGE_WIDTH - MARGIN,
        y + 5,
        {
          align: "right",
        }
      );

      pdf.setTextColor(muted);
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(6);

      pdf.text(
        invoiceData.invoiceNumber,
        PAGE_WIDTH - MARGIN,
        y + 10,
        {
          align: "right",
        }
      );

      pdf.setTextColor(forest);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(5.8);

      pdf.text(
        getInvoiceStatus(
          invoiceData.charge,
          invoiceData.paid
        ).toUpperCase(),
        PAGE_WIDTH - MARGIN,
        y + 15,
        {
          align: "right",
        }
      );

      y += 19;

      /* ======================================================
         GOLD LINE
         ====================================================== */

      pdf.setDrawColor(gold);
      pdf.setLineWidth(0.35);

      pdf.line(
        MARGIN,
        y,
        PAGE_WIDTH - MARGIN,
        y
      );

      y += 4;

      /* ======================================================
         META BOX
         ====================================================== */

      pdf.setFillColor(ivory);
      pdf.setDrawColor(border);

      pdf.roundedRect(
        MARGIN,
        y,
        CONTENT_WIDTH,
        16,
        1.5,
        1.5,
        "FD"
      );

      const metaWidth =
        CONTENT_WIDTH / 4;

      const invoiceDate =
        formatPdfDate(
          invoiceData.date
        );

      const treatmentDate =
        formatPdfDate(
          invoiceData.treatmentDate
        );

      const metaItems = [
        [
          "INVOICE DATE",
          invoiceDate,
        ],
        [
          "TREATMENT DATE",
          treatmentDate,
        ],
        [
          "PATIENT",
          invoiceData.patientName ||
            "—",
        ],
        [
          "MEDICAL RECORD NO.",
          invoiceData.medicalRecordNumber ||
            "—",
        ],
      ];

      metaItems.forEach(
        ([label, value], index) => {
          const x =
            MARGIN +
            index * metaWidth;

          if (index > 0) {
            pdf.setDrawColor(
              border
            );

            pdf.line(
              x,
              y + 2,
              x,
              y + 14
            );
          }

          pdf.setTextColor(
            "#8a958f"
          );

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(4.8);

          pdf.text(
            label,
            x + 4,
            y + 5
          );

          pdf.setTextColor(
            forest
          );

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(6);

          pdf.text(
            String(value).substring(
              0,
              28
            ),
            x + 4,
            y + 10.5
          );
        }
      );

      y += 21;

      /* ======================================================
         TREATMENT DETAILS
         ====================================================== */

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(6.5);

      pdf.text(
        "Treatment Details",
        MARGIN,
        y
      );

      y += 2.5;

      pdf.setFillColor(forest);

      pdf.roundedRect(
        MARGIN,
        y,
        CONTENT_WIDTH,
        5.5,
        1,
        1,
        "F"
      );

      pdf.setTextColor(
        "#ffffff"
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(4.7);

      pdf.text(
        "TREATMENT / DESCRIPTION",
        MARGIN + 4,
        y + 3.6
      );

      pdf.text(
        "DIAGNOSIS",
        MARGIN + 98,
        y + 3.6
      );

      pdf.text(
        "AMOUNT",
        PAGE_WIDTH - MARGIN - 4,
        y + 3.6,
        {
          align: "right",
        }
      );

      y += 5.5;

      pdf.setFillColor(card);
      pdf.setDrawColor(border);

      pdf.rect(
        MARGIN,
        y,
        CONTENT_WIDTH,
        12,
        "FD"
      );

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(6);

      pdf.text(
        String(
          invoiceData.treatmentName ||
            "Dermatology Treatment"
        ).substring(0, 60),
        MARGIN + 4,
        y + 4.5
      );

      if (invoiceData.chiefComplaint) {
        pdf.setTextColor(muted);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(5);

        pdf.text(
          String(
            invoiceData.chiefComplaint
          ).substring(0, 65),
          MARGIN + 4,
          y + 8
        );
      }

      pdf.setTextColor(
        "#314c43"
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(5.8);

      pdf.text(
        String(
          invoiceData.diagnosis ||
            "—"
        ).substring(0, 40),
        MARGIN + 98,
        y + 5
      );

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(6);

      pdf.text(
        formatCurrency(
          invoiceData.charge
        ),
        PAGE_WIDTH - MARGIN - 4,
        y + 5,
        {
          align: "right",
        }
      );

      y += 16;

      /* ======================================================
         PAYMENT HISTORY
         ====================================================== */

      if (payments.length > 0) {
        pdf.setTextColor(forest);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(6.5);

        pdf.text(
          "Payment History",
          MARGIN,
          y
        );

        y += 2.5;

        pdf.setFillColor(forest);

        pdf.rect(
          MARGIN,
          y,
          CONTENT_WIDTH,
          5.5,
          "F"
        );

        pdf.setTextColor(
          "#ffffff"
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(4.7);

        pdf.text(
          "DATE",
          MARGIN + 4,
          y + 3.6
        );

        pdf.text(
          "METHOD",
          MARGIN + 38,
          y + 3.6
        );

        pdf.text(
          "NOTES",
          MARGIN + 78,
          y + 3.6
        );

        pdf.text(
          "PAID",
          PAGE_WIDTH - MARGIN - 4,
          y + 3.6,
          {
            align: "right",
          }
        );

        y += 5.5;

        payments.forEach(
          (payment) => {
            const paymentDate =
              payment?.payment_date ||
              payment?.created_at ||
              payment?.date;

            const dateText =
              formatPdfDate(
                paymentDate
              );

            /*
             * FIX:
             * getPaymentMethodLabel now exists above.
             */
            const method =
              getPaymentMethodLabel(
                payment?.payment_method
              );

            const notes =
              payment?.notes ||
              payment?.description ||
              "—";

            pdf.setFillColor(
              card
            );

            pdf.setDrawColor(
              border
            );

            pdf.rect(
              MARGIN,
              y,
              CONTENT_WIDTH,
              5.5,
              "FD"
            );

            pdf.setTextColor(
              "#314c43"
            );

            pdf.setFont(
              "helvetica",
              "normal"
            );

            pdf.setFontSize(4.8);

            pdf.text(
              dateText,
              MARGIN + 4,
              y + 3.6
            );

            pdf.text(
              String(method).substring(
                0,
                20
              ),
              MARGIN + 38,
              y + 3.6
            );

            pdf.text(
              String(notes).substring(
                0,
                48
              ),
              MARGIN + 78,
              y + 3.6
            );

            pdf.setTextColor(
              forest
            );

            pdf.setFont(
              "helvetica",
              "bold"
            );

            pdf.text(
              formatCurrency(
                payment?.amount
              ),
              PAGE_WIDTH -
                MARGIN -
                4,
              y + 3.6,
              {
                align: "right",
              }
            );

            y += 5.5;
          }
        );

        y += 3;
      }

      /* ======================================================
         SUMMARY
         ====================================================== */

      const summaryWidth = 65;
      const summaryHeight = 22;

      const summaryX =
        PAGE_WIDTH -
        MARGIN -
        summaryWidth;

      pdf.setFillColor(ivory);
      pdf.setDrawColor(border);

      pdf.roundedRect(
        summaryX,
        y,
        summaryWidth,
        summaryHeight,
        1.5,
        1.5,
        "FD"
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(5.5);

      pdf.setTextColor(muted);

      pdf.text(
        "Total Charge",
        summaryX + 5,
        y + 5.5
      );

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        formatCurrency(
          invoiceData.charge
        ),
        summaryX +
          summaryWidth -
          5,
        y + 5.5,
        {
          align: "right",
        }
      );

      pdf.setTextColor(muted);

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.text(
        "Paid",
        summaryX + 5,
        y + 11
      );

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        formatCurrency(
          invoiceData.paid
        ),
        summaryX +
          summaryWidth -
          5,
        y + 11,
        {
          align: "right",
        }
      );

      pdf.setDrawColor(border);

      pdf.line(
        summaryX + 5,
        y + 13,
        summaryX +
          summaryWidth -
          5,
        y + 13
      );

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        "Outstanding",
        summaryX + 5,
        y + 19
      );

      pdf.setTextColor(gold);

      pdf.text(
        formatCurrency(
          invoiceData.outstanding
        ),
        summaryX +
          summaryWidth -
          5,
        y + 19,
        {
          align: "right",
        }
      );

      y += summaryHeight + 4;

      /* ======================================================
         FOOTER
         ====================================================== */

      pdf.setDrawColor(border);

      pdf.line(
        MARGIN,
        y,
        PAGE_WIDTH - MARGIN,
        y
      );

      y += 3.5;

      pdf.setTextColor(forest);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(5.5);

      pdf.text(
        `Thank you for choosing ${String(
          clinicName
        ).substring(0, 60)}.`,
        MARGIN,
        y
      );

      pdf.setTextColor(muted);

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(4.8);

      pdf.text(
        "Generated from Clinic Management System",
        MARGIN,
        y + 3.5
      );

      pdf.text(
        "Professional Care • Trusted Results",
        MARGIN,
        y + 7
      );

      if (phone) {
        pdf.text(
          String(phone).substring(
            0,
            35
          ),
          PAGE_WIDTH - MARGIN,
          y + 3.5,
          {
            align: "right",
          }
        );
      }

      /* ======================================================
         SAVE
         ====================================================== */

      const safePatientName =
        String(
          invoiceData.patientName ||
            "patient"
        )
          .replace(
            /[^a-z0-9]+/gi,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          )
          .toLowerCase();

      /*
       * IMPORTANT:
       * There is intentionally NO pdf.addPage().
       *
       * This remains a single A4 portrait page.
       */

      pdf.save(
        `${invoiceData.invoiceNumber}-${
          safePatientName || "patient"
        }.pdf`
      );
    } catch (err) {
      console.error(
        "Invoice PDF generation failed:",
        err
      );

      setError(
        "Unable to generate the PDF. Please try printing the invoice instead."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  /* ==========================================================
     CLOSED
     ========================================================== */

  if (!open || !treatment) {
    return null;
  }

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <div className="treatment-invoice-modal">
      <div className="invoice-modal-container">
        {/* HEADER */}
        <div className="invoice-modal-header">
          <div>
            <h2 className="invoice-modal-header-title">
              Invoice
            </h2>

            <div className="invoice-modal-header-subtitle">
              Professional treatment invoice
            </div>
          </div>

          <button
            type="button"
            className="invoice-modal-close"
            onClick={onClose}
            aria-label="Close invoice"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="invoice-modal-body">
          {loading ? (
            <div className="invoice-modal-message">
              <FiLoader
                size={22}
                className="animate-spin"
              />

              <div
                style={{
                  marginTop: 10,
                }}
              >
                Loading invoice...
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="invoice-modal-error">
                  {error}
                </div>
              )}

              <div className="invoice-preview-wrapper">
                <TreatmentInvoicePrint
                  invoiceData={invoiceData}
                  settings={settings}
                  payments={payments}
                  logoUrl={logoUrl}
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="invoice-modal-footer">
          <button
            type="button"
            className="invoice-modal-button invoice-secondary-button"
            onClick={handlePrint}
            disabled={
              loading || !invoiceData
            }
          >
            <FiPrinter size={15} />
            Print
          </button>

          <button
            type="button"
            className="invoice-modal-button invoice-primary-button"
            onClick={handleDownloadPdf}
            disabled={
              loading ||
              pdfLoading ||
              !invoiceData
            }
          >
            {pdfLoading ? (
              <FiLoader
                size={15}
                className="animate-spin"
              />
            ) : (
              <FiDownload size={15} />
            )}

            {pdfLoading
              ? "Generating..."
              : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}