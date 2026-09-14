import React from "react";
import "../../styles/TreatmentInvoicePrint.css";

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `PKR ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPaymentMethodLabel(method) {
  const labels = {
    cash: "Cash",
    card: "Card",
    bank_transfer: "Bank Transfer",
    mobile_wallet: "Mobile Wallet",
  };

  return (
    labels[String(method || "").toLowerCase()] ||
    method ||
    "—"
  );
}

function getStatusLabel(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "paid") return "PAID";
  if (normalized === "partial") return "PARTIALLY PAID";

  return "UNPAID";
}

function InfoItem({ label, value }) {
  return (
    <div className="invoice-info-item">
      <div className="invoice-info-label">{label}</div>

      <div className="invoice-info-value">
        {value || "—"}
      </div>
    </div>
  );
}

export default function TreatmentInvoicePrint({
  invoiceData,
  settings,
  payments = [],
  logoUrl = "",
}) {
  if (!invoiceData) return null;

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

  const treatmentName =
    invoiceData.treatmentName ||
    invoiceData.title ||
    "Dermatology Treatment";

  return (
    <div className="invoice-print-page">
      <div className="invoice-header">
        <div className="invoice-header-left">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Clinic logo"
              className="invoice-logo"
            />
          ) : (
            <div className="invoice-logo-placeholder">
              {clinicName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="invoice-eyebrow">
              {eyebrow}
            </div>

            <h1 className="invoice-clinic-name">
              {clinicName}
            </h1>

            {(phone || email) && (
              <div className="invoice-contact">
                {[phone, email]
                  .filter(Boolean)
                  .join(" • ")}
              </div>
            )}

            {address && (
              <div className="invoice-address">
                {address}
              </div>
            )}
          </div>
        </div>

        <div className="invoice-header-right">
          <h2 className="invoice-title">
            INVOICE
          </h2>

          <div className="invoice-number">
            {invoiceData.invoiceNumber}
          </div>

          <div className="invoice-status">
            {getStatusLabel(invoiceData.status)}
          </div>
        </div>
      </div>

      <div className="invoice-gold-line" />

      <div className="invoice-meta-grid">
        <InfoItem
          label="Invoice Date"
          value={formatDateTime(invoiceData.date)}
        />

        <InfoItem
          label="Treatment Date"
          value={formatDate(invoiceData.treatmentDate)}
        />

        <InfoItem
          label="Patient"
          value={invoiceData.patientName}
        />

        <InfoItem
          label="Medical Record No."
          value={
            invoiceData.medicalRecordNumber || "—"
          }
        />
      </div>

      <section className="invoice-section">
        <h3 className="invoice-section-title">
          Treatment Details
        </h3>

        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: "46%" }}>
                Treatment / Description
              </th>

              <th style={{ width: "34%" }}>
                Diagnosis
              </th>

              <th style={{ width: "20%" }}>
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <div className="invoice-treatment-name">
                  {treatmentName}
                </div>

                {invoiceData.chiefComplaint && (
                  <div className="invoice-treatment-description">
                    {invoiceData.chiefComplaint}
                  </div>
                )}
              </td>

              <td>
                {invoiceData.diagnosis || "—"}
              </td>

              <td>
                {formatCurrency(invoiceData.charge)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {payments.length > 0 && (
        <section className="invoice-section">
          <h3 className="invoice-section-title">
            Payment History
          </h3>

          <table className="invoice-table invoice-payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Notes</th>
                <th>Paid</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => {
                const paymentDate =
                  payment?.payment_date ||
                  payment?.created_at ||
                  payment?.date;

                return (
                  <tr
                    key={
                      payment?.id ||
                      `payment-${index}`
                    }
                  >
                    <td>
                      {formatDate(paymentDate)}
                    </td>

                    <td>
                      {getPaymentMethodLabel(
                        payment?.payment_method
                      )}
                    </td>

                    <td>
                      <div className="invoice-payment-note">
                        {payment?.notes ||
                          payment?.description ||
                          "—"}
                      </div>
                    </td>

                    <td>
                      {formatCurrency(
                        payment?.amount
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      <div className="invoice-summary-wrap">
        <div className="invoice-summary">
          <div className="invoice-summary-row">
            <span>Total Charge</span>

            <strong>
              {formatCurrency(invoiceData.charge)}
            </strong>
          </div>

          <div className="invoice-summary-row">
            <span>Paid</span>

            <strong>
              {formatCurrency(invoiceData.paid)}
            </strong>
          </div>

          <div className="invoice-summary-divider" />

          <div className="invoice-summary-row invoice-summary-outstanding">
            <span>Outstanding</span>

            <strong>
              {formatCurrency(
                invoiceData.outstanding
              )}
            </strong>
          </div>
        </div>
      </div>

      <footer className="invoice-footer">
        <div>
          <div className="invoice-footer-thanks">
            Thank you for choosing {clinicName}.
          </div>

          <div>
            Generated from Clinic Management System
          </div>

          <div>
            Professional Care • Trusted Results
          </div>
        </div>

        {phone && (
          <div className="invoice-footer-right">
            {phone}
          </div>
        )}
      </footer>
    </div>
  );
}