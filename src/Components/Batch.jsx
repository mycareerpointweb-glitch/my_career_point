import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import "../Styles/UserManagement.css";
// import "../Styles/CourseAndManagement.css";
import "../Styles/BatchManagement.css";

const dummyCourses = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
  { id: 3, name: "Computer Science" },
  { id: 4, name: "Chemistry" },
  { id: 5, name: "Biology" },
];

const dummyInstructors = [
  { id: "inst1", name: "John Doe" },
  { id: "inst2", name: "Jane Smith" },
  { id: "inst3", name: "Mark Lee" },
  { id: "inst4", name: "Laura Brown" },
  { id: "inst5", name: "Paul White" },
  { id: "inst6", name: "John Doe" },
  { id: "inst7", name: "Jane Smith" },
  { id: "inst8", name: "Mark Lee" },
  { id: "inst9", name: "Laura Brown" },
  { id: "inst10", name: "Paul White" },
  { id: "inst17", name: "Jane Smith" },
  { id: "inst18", name: "Mark Lee" },
  { id: "inst19", name: "Laura Brown" },
  { id: "inst30", name: "Paul White" },
];

const dummyStudents = [
  { id: "stu1", name: "Alice", year: "2025" },
  { id: "stu2", name: "Bob", year: "2025" },
  { id: "stu3", name: "Charlie", year: "2024" },
  { id: "stu4", name: "David", year: "2024" },
  { id: "stu5", name: "Eva", year: "2025" },
  { id: "stu6", name: "Frank", year: "2025" },
  { id: "stu7", name: "Grace", year: "2024" },
  { id: "stu8", name: "Hannah", year: "2024" },
  { id: "stu9", name: "Ivy", year: "2025" },
  { id: "stu10", name: "Jack", year: "2025" },
];

const dummyBatches = [
  {
    id: 1,
    batchName: "Batch A",
    course: "Mathematics",
    instructors: ["John Doe", "Jane Smith"],
    schedule: "Mon & Wed, 10:00 AM",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    capacity: 30,
    location: "Online",
    notes: "Evening batch",
    students: ["Alice", "Bob", "Frank"],
  },
  {
    id: 2,
    batchName: "Batch B",
    course: "Physics",
    instructors: ["Mark Lee"],
    schedule: "Tue & Thu, 2:00 PM",
    startDate: "2025-02-01",
    endDate: "2025-05-30",
    capacity: 25,
    location: "Offline",
    notes: "Lab-focused",
    students: ["Charlie", "David", "Grace"],
  },
  {
    id: 3,
    batchName: "Batch C",
    course: "Computer Science",
    instructors: ["Laura Brown", "Paul White"],
    schedule: "Mon, Wed & Fri, 1:00 PM",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    capacity: 35,
    location: "Hybrid",
    notes: "Project-based",
    students: ["Hannah", "Ivy", "Jack"],
  },
  {
    id: 4,
    batchName: "Batch D",
    course: "Chemistry",
    instructors: ["Jane Smith"],
    schedule: "Tue & Thu, 10:00 AM",
    startDate: "2025-04-01",
    endDate: "2025-07-01",
    capacity: 20,
    location: "Offline",
    notes: "Lab sessions included",
    students: ["Alice", "Charlie", "Eva"],
  },
  {
    id: 5,
    batchName: "Batch E",
    course: "Biology",
    instructors: ["Mark Lee", "Laura Brown"],
    schedule: "Wed & Fri, 3:00 PM",
    startDate: "2025-05-01",
    endDate: "2025-08-01",
    capacity: 30,
    location: "Online",
    notes: "Evening batch",
    students: ["Bob", "David", "Grace", "Hannah"],
  },
];

const BatchEnrollmentManagement = () => {
  const [batches, setBatches] = useState(dummyBatches);
  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(dummyBatches[0]); // default first batch

  const [formData, setFormData] = useState({
    batchName: "",
    course: "",
    instructors: [],
    scheduleDays: "",
    scheduleTime: "",
    startDate: "",
    endDate: "",
    capacity: "",
    location: "Online",
    notes: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstructorToggle = (name) => {
    setFormData((prev) => {
      const alreadySelected = prev.instructors.includes(name);
      return {
        ...prev,
        instructors: alreadySelected
          ? prev.instructors.filter((i) => i !== name)
          : [...prev.instructors, name],
      };
    });
  };

  const handleSaveBatch = (e) => {
    e.preventDefault();
    const newBatch = {
      ...formData,
      id: Date.now(),
      schedule: `${formData.scheduleDays}, ${formData.scheduleTime}`,
      students: [],
    };
    setBatches((prev) => [...prev, newBatch]);
    setFormData({
      batchName: "",
      course: "",
      instructors: [],
      scheduleDays: "",
      scheduleTime: "",
      startDate: "",
      endDate: "",
      capacity: "",
      location: "Online",
      notes: "",
    });
    setShowForm(false);
    setSelectedBatch(newBatch); // select the newly created batch
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="um-header">
        <h2 className="page-title">Batch & Enrollment Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Create Batch
        </button>
      </div>

      {/* Batch Creation Form */}
      {showForm && (
  <div className="user-form-card fade-in">
    <div className="form-header">
      <h3>Create Batch</h3>
      <button
        className="btn-icon"
        onClick={() => {
          setShowForm(false);
          setFormData({
            batchName: "",
            course: "",
            instructors: [],
            scheduleDays: "",
            scheduleTime: "",
            startDate: "",
            endDate: "",
            capacity: "",
            location: "Online",
            notes: "",
          });
        }}
      >
        <FiX />
      </button>
    </div>

    <form onSubmit={handleSaveBatch} className="user-form">
        <div className="form-row">
            <div className="form-group">
            <label>
                Batch Name <span className="required">*</span>
            </label>
            <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleFormChange}
                required
                placeholder="Enter Batch Name"
            />
            </div>

        <div className="form-group">
          <label>
            Course <span className="required">*</span>
          </label>
          <select name="course" value={formData.course} onChange={handleFormChange} required>
            <option value="">Select Course</option>
            {dummyCourses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      

      <div className="form-group">
        <label>Instructors</label>
        <div className="pill-container">
          {dummyInstructors.map((inst) => (
            <span
              key={inst.id}
              className={`filter-tag-batch-tags-filter`}
              onClick={() => handleInstructorToggle(inst.name)}
            >
              {inst.name} <FiX />
            </span>
          ))}
        </div>
      </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Schedule Days</label>
          <input
            type="text"
            name="scheduleDays"
            value={formData.scheduleDays}
            onChange={handleFormChange}
            placeholder="Mon/Wed/Fri"
          />
        </div>

        <div className="form-group">
          <label>Schedule Time</label>
          <input
            type="time"
            name="scheduleTime"
            value={formData.scheduleTime}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleFormChange} />
        </div>
      

        <div className="form-group">
          <label>Capacity</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleFormChange} />
        </div>
        <div className="form-group">
          <label>Mode</label>
          <select name="location" value={formData.location} onChange={handleFormChange}>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleFormChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Batch
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}


      {/* Batch Cards */}
      <div className="user-management">
      <div className="card fade-in" style={{ marginTop: "20px" }}>
        <h3>All Batches</h3>
        <div className="batch-card-container scrollable">
          {batches.map((b) => (
            <div
              key={b.id}
              className={`batch-card ${selectedBatch?.id === b.id ? "selected" : ""}`}
              onClick={() => setSelectedBatch(selectedBatch?.id === b.id ? null : b)}
            >
              <h4>{b.batchName}</h4>
              <p>{b.course}</p>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Selected Batch Details */}
      {selectedBatch && (
  <div className="card fade-in  " style={{ marginTop: "20px" ,}}>
    <h3>Batch Details - {selectedBatch.batchName}</h3>
    <table className="users-table" style={{ borderRadius: "10px" ,}}>
      <thead>
        <tr>
          <th>Course</th>
          <th>Instructors</th>
          <th>Schedule</th>
          <th>Start–End</th>
          <th>Capacity</th>
          <th>Mode</th>
          <th>Notes</th>
          <th>Student</th>
        </tr>
      </thead>
      <tbody>
        {selectedBatch.students.length > 0 ? (
          selectedBatch.students.map((s) => (
            <tr key={s}>
              <td>{selectedBatch.course}</td>
              <td>
                {selectedBatch.instructors.join(", ")}
              </td>
              <td>{selectedBatch.schedule}</td>
              <td>
                {selectedBatch.startDate} → {selectedBatch.endDate}
              </td>
              <td>{selectedBatch.capacity}</td>
              <td>{selectedBatch.location}</td>
              <td>{selectedBatch.notes}</td>
              <td>{s}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
              No students assigned
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default BatchEnrollmentManagement;
