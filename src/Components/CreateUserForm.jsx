import React, { useState, useEffect } from "react";
import "../Styles/UserManagement.css";
import CustomSelect from "./CustomSelect";

const CreateUserForm = ({ role, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    rollNo: "",
    batch: "",
    courses: "",
    department: "",
    sendInvite: false,
  });

  // 🔹 Auto-generate username from full name if user types one
  useEffect(() => {
    if (formData.fullName && !formData.username) {
      setFormData((prev) => ({
        ...prev,
        username: formData.fullName.toLowerCase().replace(/\s+/g, "_"),
      }));
    }
  }, [formData.fullName]);

  // 🔹 Helper: Generate random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // 🔹 Helper: Generate unique username if empty
  const generateUsername = (name) => {
    if (name) {
      return (
        name.toLowerCase().replace(/\s+/g, "_") +
        "_" +
        Math.floor(Math.random() * 1000)
      );
    }
    return "user_" + Math.floor(Math.random() * 10000);
  };

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    let { username, password, confirmPassword, fullName } = formData;

    // Auto-generate username if empty
    if (!username.trim()) {
      username = generateUsername(fullName);
    }

    // Auto-generate password if empty
    if (!password.trim()) {
      const autoPass = generatePassword();
      password = autoPass;
      confirmPassword = autoPass;
    }

    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Final user data
    const data = {
      ...formData,
      username,
      password,
      confirmPassword,
      role,
      user_id: Date.now(),
      status: "Active",
      last_login: new Date().toISOString(),
    };

    onSubmit?.(data);

    alert(
      `✅ User Created Successfully!\nUsername: ${username}\nPassword: ${password}`
    );

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      rollNo: "",
      batch: "",
      courses: "",
      department: "",
      sendInvite: false,
    });
  };

  return (
    <div className="user-form-card fade-in modal-card">
      <div className="form-header">
        <h3>Create {role}</h3>
        <button className="btn-icon" onClick={onClose}>
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        {/* Full Name + Email */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Phone + Username */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label>Username (auto if empty)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
            />
          </div>
        </div>

        {/* ✅ Password fields for all users */}
        <div className="form-row">
          <div className="form-group">
            <label>Password (auto if empty)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to auto-generate"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>
        </div>

        {/* Student-only Fields */}
        {role === "Student" && (
          <div className="form-row">
            <div className="form-group">
              <label>
                Roll No <span className="required">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
                placeholder="STUD2025001"
              />
            </div>
            <div className="form-group">
              <label>
                Batch <span className="required">*</span>
              </label>
              <CustomSelect
                options={[
                  { value: "2025", label: "2025" },
                  { value: "2026", label: "2026" },
                  { value: "2027", label: "2027" },
                ]}
                value={formData.batch}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, batch: val }))
                }
                placeholder="Select Batch"
              />
            </div>
          </div>
        )}

        {/* Teacher-only Fields */}
        {role === "Teacher" && (
          <div className="form-group">
            <label>
              Courses/Subjects <span className="required">*</span>
            </label>
            <input
              type="text"
              name="courses"
              value={formData.courses}
              onChange={handleChange}
              required
              placeholder="Math, Physics, Chemistry"
            />
          </div>
        )}

        {/* Admin-only Fields */}
        {role === "Admin" && (
          <div className="form-group">
            <label>
              Department <span className="required">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Academic Affairs"
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="sendInvite"
              checked={formData.sendInvite}
              onChange={handleChange}
            />
            <span>Send invitation email</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
