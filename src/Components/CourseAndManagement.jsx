import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import "../Styles/UserManagement.css";
import "../Styles/CourseAndManagement.css";

const teacherOptions = [
  { value: "teacher1", label: "John Doe" },
  { value: "teacher2", label: "Jane Smith" },
  { value: "teacher3", label: "Mark Lee" },
  { value: "teacher4", label: "Teacher 1" },
  { value: "teacher5", label: "Teacher 2" },
  { value: "teacher6", label: "Teacher 3" },
  { value: "teacher7", label: "Teacher 4" },
  { value: "teacher8", label: "Teacher 5" },
  { value: "teacher9", label: "Teacher 6" },
];

const levelOptions = ["Beginner", "Intermediate", "Advanced"];

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const addCourseRef = useRef(null);

  const [formData, setFormData] = useState({
    courseName: "",
    batch: "",
    teachers: [],
    description: "",
    subjectLevel: "",
    duration: "",
  });

  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    courseId: "",
    type: "",
    title: "",
    file: null,
  });

  // Dummy Courses
  useEffect(() => {
    const dummyCourses = [
      {
        id: 1,
        courseName: "Mathematics",
        batch: "2025",
        teachers: ["teacher1"],
        description: "Learn basic math concepts",
        subjectLevel: "Beginner",
        duration: "3 months",
        materials: [],
      },
      {
        id: 2,
        courseName: "Physics",
        batch: "2025",
        teachers: ["teacher2", "teacher3"],
        description: "Advanced physics course",
        subjectLevel: "Advanced",
        duration: "6 months",
        materials: [],
      },
    ];
    setCourses(dummyCourses);
    setLoading(false);
  }, []);

  // Close Add Course form on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addCourseRef.current && !addCourseRef.current.contains(e.target)) {
        setAddCourseOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherChange = (teacherValue, type = "add") => {
    if (type === "add") {
      setFormData((prev) => {
        const alreadySelected = prev.teachers.includes(teacherValue);
        return {
          ...prev,
          teachers: alreadySelected
            ? prev.teachers.filter((t) => t !== teacherValue)
            : [...prev.teachers, teacherValue],
        };
      });
    } else if (type === "edit") {
      setEditCourse((prev) => {
        const alreadySelected = prev.teachers.includes(teacherValue);
        return {
          ...prev,
          teachers: alreadySelected
            ? prev.teachers.filter((t) => t !== teacherValue)
            : [...prev.teachers, teacherValue],
        };
      });
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      ...formData,
      id: Date.now(),
      materials: [],
    };
    setCourses((prev) => [...prev, newCourse]);
    setFormData({
      courseName: "",
      batch: "",
      teachers: [],
      description: "",
      subjectLevel: "",
      duration: "",
    });
    setAddCourseOpen(false);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setCourses((prev) =>
      prev.map((c) => (c.id === editCourse.id ? editCourse : c))
    );
    setEditCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Material Form Handlers
  const handleMaterialChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setMaterialForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setMaterialForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    if (!materialForm.courseId) return;

    setCourses((prev) =>
      prev.map((c) =>
        c.id === parseInt(materialForm.courseId)
          ? {
              ...c,
              materials: c.materials
                ? [...c.materials, materialForm]
                : [materialForm],
            }
          : c
      )
    );

    setMaterialForm({ courseId: "", type: "", title: "", file: null });
    setShowMaterialForm(false);
  };

  const handleMaterialDelete = (courseId, index) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? { ...c, materials: c.materials.filter((_, i) => i !== index) }
            : c
        )
      );
    }
  };

  const [assignmentMode, setAssignmentMode] = useState("courseToInstructor"); // default mode
const [assignmentData, setAssignmentData] = useState({
  courseToInstructor: {}, // {courseId: [teacherIds]}
  instructorToCourse: {}, // {teacherId: [courseIds]}
});
const [selectedPrimary, setSelectedPrimary] = useState(null);


// Handler for assigning secondary entities
const handleAssignmentChange = (primaryId, secondaryId) => {
  if (assignmentMode === "courseToInstructor") {
    setAssignmentData((prev) => {
      const current = prev.courseToInstructor[primaryId] || [];
      const updated = current.includes(secondaryId)
        ? current.filter((id) => id !== secondaryId)
        : [...current, secondaryId];
      return {
        ...prev,
        courseToInstructor: { ...prev.courseToInstructor, [primaryId]: updated },
      };
    });
  } else {
    setAssignmentData((prev) => {
      const current = prev.instructorToCourse[primaryId] || [];
      const updated = current.includes(secondaryId)
        ? current.filter((id) => id !== secondaryId)
        : [...current, secondaryId];
      return {
        ...prev,
        instructorToCourse: { ...prev.instructorToCourse, [primaryId]: updated },
      };
    });
  }
};


  return (
    <div className="user-management">
      {/* Header */}
      <div className="um-header">
        <h2 className="page-title">Course Management</h2>
        <div className="um-actions">
          {/* Search */}
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Add Material Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setShowMaterialForm(!showMaterialForm)}
            style={{ marginRight: 10 }}
          >
            <FiPlus /> <span>Add Material</span>
          </button>

          {/* Add Course Button */}
          <button
            className="btn btn-primary"
            onClick={() => setAddCourseOpen(true)}
          >
            <FiPlus /> <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Material Form */}
      {showMaterialForm && (
        <div className="user-form-card fade-in" style={{ marginTop: 20 }}>
          <form onSubmit={handleMaterialSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>Select Course</label>
                <select
                  name="courseId"
                  value={materialForm.courseId}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Material Type</label>
                <select
                  name="type"
                  value={materialForm.type}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="PPT">PPT</option>
                  <option value="Video">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="Document">Document</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={materialForm.title}
                  onChange={handleMaterialChange}
                  required
                  placeholder="Enter material title"
                />
              </div>

              <div className="form-group">
                <label>Upload File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleMaterialChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Upload Material
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Course Form */}
      {addCourseOpen && (
        <div className="user-form-card fade-in" ref={addCourseRef} style={{ marginTop: 20 }}>
          <div className="form-header">
            <h3>Add Course</h3>
            <button className="btn-icon" onClick={() => setAddCourseOpen(false)}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleAddCourse} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Course Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter course name"
                />
              </div>

              <div className="form-group">
                <label>
                  Batch <span className="required">*</span>
                </label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select batch</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter course description"
                />
              </div>

              <div className="form-group">
                <label>Subject Level</label>
                <select
                  name="subjectLevel"
                  value={formData.subjectLevel}
                  onChange={handleFormChange}
                >
                  <option value="">Select level</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Assign Teacher(s)</label>
              <div className="checkbox-group">
                {teacherOptions.map((t) => (
                  <label key={t.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.teachers.includes(t.value)}
                      onChange={() => handleTeacherChange(t.value, "add")}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Course
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="table-wrapper" style={{ marginTop: 20 }}>
          <table className="users-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Description</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Teachers</th>
                <th>Materials</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.courseName}</td>
                    <td>{course.batch}</td>
                    <td>{course.subjectLevel}</td>
                    <td>{course.duration}</td>
                    <td>
                      {course.teachers?.map((t) => {
                        const teacherLabel =
                          teacherOptions.find((opt) => opt.value === t)?.label ||
                          t;
                        return (
                          <span key={t} className="tag">
                            {teacherLabel}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      {course.materials?.map((m, idx) => (
                        <span key={idx} className="tag material-tag">
                          {m.title}
                          {editCourse?.id === course.id && (
                            <FiX
                              className="tag-remove"
                              onClick={() => handleMaterialDelete(course.id, idx)}
                            />
                          )}
                        </span>
                      ))}
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn-icon action-edit"
                        title="Edit"
                        onClick={() => setEditCourse(course)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon action-delete"
                        title="Delete"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <p>No courses found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Course Modal */}
{editCourse && (
  <div className="modal-overlay">
    <div className="user-form-card fade-in modal-card">
      <div className="form-header">
        <h3>Edit Course</h3>
        <button className="btn-icon" onClick={() => setEditCourse(null)}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleEditSave} className="user-form">
        {/* Course Fields */}
        <div className="form-row">
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              value={editCourse.courseName || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, courseName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Batch</label>
            <select
              value={editCourse.batch || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, batch: e.target.value })
              }
            >
              <option value="">Select batch</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editCourse.description || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Subject Level</label>
            <select
              value={editCourse.subjectLevel || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, subjectLevel: e.target.value })
              }
            >
              <option value="">Select level</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={editCourse.duration || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, duration: e.target.value })
              }
            />
          </div>
        </div>

        {/* Teachers */}
        <div className="form-group">
          <label>Teachers</label>
          <div className="checkbox-group">
            {teacherOptions.map((t) => (
              <label key={t.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editCourse.teachers.includes(t.value)}
                  onChange={() => handleTeacherChange(t.value, "edit")}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="form-group">
          <label>Materials</label>
          <div className="material-pills">
            {editCourse.materials?.map((m, idx) => (
              <span key={idx} className="tag material-tag">
                {m.title}
                <FiX
                  className="tag-remove"
                  onClick={() => handleMaterialDelete(editCourse.id, idx)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    
  </div>
)}
<div className="assignment-card fade-in">
  <h3>Instructor Assignment</h3>
  <p className="subtitle">
    One course → multiple instructors | One instructor → multiple courses
  </p>

  {/* Option Selector */}
  <div className="mapping-options">
    <button
      className={`option-btn ${assignmentMode === "courseToInstructor" ? "active" : ""}`}
      onClick={() => setAssignmentMode("courseToInstructor")}
    >
      Course → Instructor
    </button>
    <button
      className={`option-btn ${assignmentMode === "instructorToCourse" ? "active" : ""}`}
      onClick={() => setAssignmentMode("instructorToCourse")}
    >
      Instructor → Course
    </button>
  </div>

  {/* Selectable Lists */}
  <div className="mapping-lists">
    {/* Left: Primary */}
    <div className="primary-list">
      <h4>{assignmentMode === "courseToInstructor" ? "Courses" : "Instructors"}</h4>
      <ul>
        {(assignmentMode === "courseToInstructor" ? courses : teacherOptions).map((item) => (
          <li
            key={item.id || item.value}
            className={selectedPrimary === (item.id || item.value) ? "selected" : ""}
            onClick={() => setSelectedPrimary(item.id || item.value)}
          >
            {assignmentMode === "courseToInstructor" ? item.courseName : item.label}
          </li>
        ))}
      </ul>
    </div>

    {/* Right: Secondary */}
    <div className="secondary-list">
      <h4>{assignmentMode === "courseToInstructor" ? "Assign Instructors" : "Assign Courses"}</h4>
      <div className="checkbox-group">
        {(assignmentMode === "courseToInstructor" ? teacherOptions : courses).map((sec) => {
          const assigned =
            assignmentMode === "courseToInstructor"
              ? assignmentData.courseToInstructor[selectedPrimary] || []
              : assignmentData.instructorToCourse[selectedPrimary] || [];
          const secId = assignmentMode === "courseToInstructor" ? sec.value : sec.id;

          return (
            <label key={secId} className="checkbox-label">
              <input
                type="checkbox"
                disabled={!selectedPrimary}
                checked={assigned.includes(secId)}
                onChange={() => handleAssignmentChange(selectedPrimary, secId)}
              />
              {assignmentMode === "courseToInstructor" ? sec.label : sec.courseName}
            </label>
          );
        })}
      </div>
    </div>
  </div>
</div>


    </div>
  );
};

export default CourseManagement;

