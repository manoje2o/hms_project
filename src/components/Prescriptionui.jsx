import React, { useRef } from "react";
import stech from "../assets/steth.png";
import { Typography, Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Title } = Typography;

const Prescriptionui = ({ selectedPrescription }) => {
  const pdfRef = useRef();

  const downloadPdf = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("prescription.pdf");
    });
  };

  return (
    <div className="min-vh-100 py-3 px-3" style={{ backgroundColor: "#eef2f5" }}>
      {/* Download Button */}
      <div className="text-end mb-3">
        <Button type="primary" onClick={downloadPdf}>
          Download as PDF
        </Button>
      </div>

      <div
        ref={pdfRef}
        className="bg-white rounded-4 shadow p-4 mx-auto"
        style={{ maxWidth: "900px", fontFamily: "Segoe UI, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <Title level={3} style={{ color: "#0078D4", marginBottom: 0 }}>
            E2o Hospital Management System
          </Title>
          <p className="text-secondary" style={{ fontSize: "14px" }}>
            Patient Prescription Record
          </p>
        </div>

        {/* Doctor Info */}
        <div className="d-flex justify-content-between align-items-center border-top pt-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle text-primary fs-1 me-3"></i>
            <div>
              <h5 className="mb-1 fw-bold">Dr. John Dino</h5>
              <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                MBBS, MS – General Surgery
              </p>
            </div>
          </div>
          <img src={stech} alt="Stethoscope" style={{ maxWidth: "80px" }} />
        </div>

        {/* Patient Info */}
        {selectedPrescription && (
          <div className="border-top pt-4 mt-3">
            <Title level={5} className="text-dark mb-3">
              Patient Information
            </Title>
            <div className="row text-dark">
              <div className="col-md-6 mb-2">
                <strong>Name:</strong> {selectedPrescription.patientName || "Jane Doe"}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Age / Gender:</strong> {selectedPrescription.age || 29} / {selectedPrescription.gender || "Male"}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Contact:</strong> {selectedPrescription.contact || "+91 98765 43210"}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Date:</strong> {selectedPrescription.date || "29-May-2025"}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Patient ID:</strong> {selectedPrescription.patientId || "P102938"}
              </div>
            </div>
          </div>
        )}

        {/* Rx and Medicines */}
        <div className="border-top pt-3 mt-4">
          <div className="d-flex align-items-center mb-2">
            <span
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#00bbff",
                marginRight: "12px",
              }}
            >
              ℞
            </span>
            <Title level={5} style={{ margin: 0 }}>
              Prescribed Medicines
            </Title>
          </div>

          <div className="rounded p-3">
            {selectedPrescription?.medications?.length > 0 ? (
              selectedPrescription.medications.map((med, index) => (
                <div key={index} className="border-bottom py-2" style={{ fontSize: "15px" }}>
                  <strong>{med.medicine}</strong> – {med.dosage}, {med.frequency}, {med.duration} days
                  {med.instructions && (
                    <span className="text-muted"> ({med.instructions})</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No medicines prescribed.</p>
            )}
          </div>
        </div>

        {/* Signature & Footer */}
        <div className="mt-5 pt-4">
          <div className="text-end mb-5">
            <p className="mb-0"><strong>Dr. John Dino</strong></p>
            <p className="text-muted" style={{ fontSize: "14px" }}>Signature</p>
            <div
              style={{
                width: "150px",
                height: "1px",
                backgroundColor: "#ccc",
                margin: "5px 0 0 auto",
              }}
            />
          </div>

          <div className="text-center text-muted border-top pt-2" style={{ fontSize: "14px" }}>
            <p className="mb-1">E2o Hospital, 123 Health St, MedCity, India</p>
            <p className="mb-0">Phone: +91 98765 43210 | Email: contact@e2ohospital.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptionui;
