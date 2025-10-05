// ReportsAnalytics.jsx
import React, { useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "../Styles/UserManagement.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const dummySubjects = ["Mathematics", "Physics", "Chemistry"];
const dummyBatches = ["Batch A", "Batch B", "Batch C"];
const dummyStudents = ["Alice", "Bob", "Charlie"];
const dummySchools = ["School 1", "School 2"];

const dummyPerformance = {
  passFail: { pass: 45, fail: 5 },
  subjectWise: { Mathematics: 80, Physics: 65, Chemistry: 70 },
  batchWise: { "Batch A": 85, "Batch B": 75, "Batch C": 90 },
  studentProgress: {
    Alice: [80, 85, 90],
    Bob: [70, 65, 75],
    Charlie: [95, 90, 100],
  },
  schoolPerformance: { "School 1": 80, "School 2": 85 },
};

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    subject: "",
    batch: "",
    student: "",
    school: "",
    timePeriod: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const handleExportPDF = () => {
    const input = document.getElementById("reports-content");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reports.pdf");
    });
  };

  // Excel Export
  const handleExportExcel = () => {
    const data = Object.entries(dummyPerformance.subjectWise).map(
      ([subject, value]) => ({ Subject: subject, Performance: value })
    );
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subjects");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "reports.xlsx");
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  const passFailData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Students",
        data: [dummyPerformance.passFail.pass, dummyPerformance.passFail.fail],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const subjectData = {
    labels: Object.keys(dummyPerformance.subjectWise),
    datasets: [
      {
        label: "Subject Performance (%)",
        data: Object.values(dummyPerformance.subjectWise),
        backgroundColor: "#2196f3",
      },
    ],
  };

  const batchData = {
    labels: Object.keys(dummyPerformance.batchWise),
    datasets: [
      {
        label: "Batch Performance (%)",
        data: Object.values(dummyPerformance.batchWise),
        backgroundColor: "#ff9800",
      },
    ],
  };

  const studentProgressData = {
    labels: ["Term 1", "Term 2", "Term 3"],
    datasets: Object.entries(dummyPerformance.studentProgress).map(
      ([student, scores], idx) => ({
        label: student,
        data: scores,
        borderColor: ["#4caf50", "#2196f3", "#ff9800"][idx],
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 5,
      })
    ),
  };

  const schoolData = {
    labels: Object.keys(dummyPerformance.schoolPerformance),
    datasets: [
      {
        label: "School Performance (%)",
        data: Object.values(dummyPerformance.schoolPerformance),
        backgroundColor: ["#9c27b0", "#00bcd4"],
      },
    ],
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="um-header">
        <h2 className="page-title">Reports & Analytics</h2>
        <div className="form-actions" style={{ gap: "10px" }}>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <FiDownload /> Export PDF
          </button>
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FiDownload /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-form-card fade-in" style={{ marginTop: "20px" }}>
        <h3>Filters</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              {dummySubjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Batch</label>
            <select
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
            >
              <option value="">All Batches</option>
              {dummyBatches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Student</label>
            <select
              name="student"
              value={filters.student}
              onChange={handleFilterChange}
            >
              <option value="">All Students</option>
              {dummyStudents.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>School</label>
            <select
              name="school"
              value={filters.school}
              onChange={handleFilterChange}
            >
              <option value="">All Schools</option>
              {dummySchools.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Time Period</label>
            <input
              type="text"
              name="timePeriod"
              placeholder="e.g., Jan 2025 - Mar 2025"
              value={filters.timePeriod}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Active filters as removable tags */}
        <div
          className="active-filters"
          style={{
            marginTop: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="filter-tag"
                  style={{
                    background: "#e0e0e0",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => removeFilter(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value} <FiX />
                </div>
              )
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div id="reports-content">
      <div
        className="charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 2 columns max
          gap: "20px",
          justifyItems: "center",
          marginTop: "20px",
        }}
      >
        {/* Each card is a perfect square with chart inside */}
        {[
          { title: "Pass/Fail Overview", type: "pie", data: passFailData },
          { title: "Subject-wise Performance", type: "bar", data: subjectData },
          { title: "Batch-wise Performance", type: "bar", data: batchData },
          { title: "Individual Student Progress", type: "line", data: studentProgressData },
          { title: "School-level Performance Overview", type: "bar", data: schoolData },
        ].map((chart, idx) => (
          <div
            key={idx}
            className="user-form-card fade-in"
            style={{
              width: "100%",
              maxWidth: "400px",
              maxHeight: "400px",
              aspectRatio: "1 / 1",
              padding: "10px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              {chart.title}
            </h3>
            <div style={{ flex: 1, display: "flex" }}>
              {chart.type === "pie" && <Pie data={chart.data} options={chartOptions} />}
              {chart.type === "bar" && <Bar data={chart.data} options={chartOptions} />}
              {chart.type === "line" && <Line data={chart.data} options={chartOptions} />}
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Responsive for mobile */}
      <style>
        {`
          @media (max-width: 768px) {
            .charts-grid {
              grid-template-columns: 1fr; // 1 column on mobile
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReportsAnalytics;
