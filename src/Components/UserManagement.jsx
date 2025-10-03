import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { RiUserForbidFill } from "react-icons/ri";
import { HiUserCircle } from "react-icons/hi";
import CustomSelect from "./CustomSelect";
import "../Styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [filters, setFilters] = useState({
    role: null,
    status: null,
    batch: null,
  });

  const filterRef = useRef(null);
  const addUserRef = useRef(null);

  // Form state
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
  // New states for modals
const [editUser, setEditUser] = useState(null);
const [suspendPopup, setSuspendPopup] = useState({
  open: false,
  user: null,
});


// Handle Edit Save
const handleSaveEdit = (e) => {
  e.preventDefault();
  setUsers((prev) =>
    prev.map((user) =>
      user.user_id === editUser.user_id ? editUser : user
    )
  );
  setEditUser(null); // close modal
};

// Handle Suspend Save


// Generate Username
const generateUsername = (fullName) => {
  if (!fullName) return "user" + Date.now();
  return (
    fullName.toLowerCase().replace(/\s+/g, "_") +
    "_" +
    Math.floor(Math.random() * 1000)
  );
};

// Generate Password
const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

  // Dummy Users instead of API
  useEffect(() => {
    const dummyUsers = [
      {
        user_id: 1,
        username: "john_doe",
        role: "Student",
        status: "Active",
        last_login: "2025-10-01T10:00:00",
        profile_image: null,
      },
      {
        user_id: 2,
        username: "jane_admin",
        role: "Admin",
        status: "Suspended",
        last_login: "2025-09-28T12:30:00",
        profile_image: null,
      },
      {
        user_id: 3,
        username: "super_user",
        role: "Super Admin",
        status: "Active",
        last_login: "2025-10-02T15:45:00",
        profile_image: null,
      },
    ];
    setUsers(dummyUsers);
    setLoading(false);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
      if (addUserRef.current && !addUserRef.current.contains(e.target)) {
        setAddUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filters.role
      ? user.role?.toLowerCase() === filters.role.toLowerCase()
      : true;
    const matchesStatus = filters.status
      ? user.status?.toLowerCase() === filters.status.toLowerCase()
      : true;
    const matchesBatch = filters.batch ? user.batch === filters.batch : true;
    return matchesSearch && matchesRole && matchesStatus && matchesBatch;
  });

  // Handle checkbox selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select All
  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.user_id) : []);
  };

  // Handle Form input
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create User
  const handleFormSubmit = (e) => {
  e.preventDefault();

  // Auto-generate username if empty
  let finalUsername = formData.username.trim()
    ? formData.username
    : generateUsername(formData.fullName);

  // Auto-generate password if empty
  let finalPassword = formData.password.trim()
    ? formData.password
    : generatePassword();

  // For Admin & Super Admin → check confirm password if user entered one
  if ((selectedRole === "Admin" || selectedRole === "Super Admin")) {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  }

  // For Students → if password empty, assign generated
  if (selectedRole === "Student") {
  // Auto-generate username
  const username = generateUsername("student", Date.now());

  let finalPassword = formData.password.trim();
  let finalConfirmPassword = formData.confirmPassword.trim();

  // If user didn't enter password → auto-generate and set both
  if (!finalPassword) {
    finalPassword = generatePassword();
    finalConfirmPassword = finalPassword;
  }

  // Check if passwords match
  if (finalPassword !== finalConfirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const newUser = {
    ...formData,
    user_id: Date.now(),
    role: selectedRole,
    status: "Active",
    last_login: new Date().toISOString(),
    username,
    password: finalPassword,
  };

  setUsers((prev) => [...prev, newUser]);

  alert(`Student Created!\nUsername: ${username}\nPassword: ${finalPassword}`);

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
  setSelectedRole(null);
}


  const newUser = {
    ...formData,
    user_id: Date.now(),
    role: selectedRole,
    status: "Active",
    last_login: new Date().toISOString(),
    username: finalUsername,
    password: finalPassword,
  };

  setUsers((prev) => [...prev, newUser]);

  alert(
    `User Created!\nUsername: ${newUser.username}\nPassword: ${newUser.password}`
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
  setSelectedRole(null);
};


  // Delete user
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.user_id !== id));
  };

  // Edit user (for demo, appends "_edited")
  const handleEditUser = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === id
          ? { ...user, username: user.username + "_edited" }
          : user
      )
    );
  };

  // Suspend/Unsuspend
 const handleToggleSuspend = (user) => {
  setSuspendPopup({ open: true, user });
};


  // Remove Filter
  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  // Inside CourseManagement.jsx

const [assignMode, setAssignMode] = useState("course-to-instructor"); 
const [selectedCourse, setSelectedCourse] = useState("");
const [selectedInstructor, setSelectedInstructor] = useState("");
const [assignedTeachers, setAssignedTeachers] = useState([]); // temp state

// Handle checkbox change
const handleAssignmentChange = (primaryId, teacherValue) => {
  setAssignedTeachers((prev) =>
    prev.includes(teacherValue)
      ? prev.filter((t) => t !== teacherValue)
      : [...prev, teacherValue]
  );
};

// Save assignment to courses

  return (
    <div className="user-management">
      {/* Header */}
      <div className="um-header">
        <h2 className="page-title">User Management</h2>

        <div className="um-actions">
          {/* Search */}
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter */}
          <div className="filter-wrapper" ref={filterRef}>
            <button
              className={`btn btn-outline ${filterOpen ? "active" : ""}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter />
              <span>Filter</span>
            </button>

            {filterOpen && (
              <div className="filter-dropdown slide-down">
                <div className="filter-group">
                  <p className="filter-title">Role</p>
                  {["Admin", "Teacher", "Super Admin", "Student"].map((role) => (
                    <button
                      key={role}
                      className={`filter-option ${
                        filters.role === role ? "active" : ""
                      }`}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          role: prev.role === role ? null : role,
                        }))
                      }
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div className="filter-group">
                  <p className="filter-title">Status</p>
                  {["Active", "Pending", "Suspended", "Deleted"].map(
                    (status) => (
                      <button
                        key={status}
                        className={`filter-option ${
                          filters.status === status ? "active" : ""
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: prev.status === status ? null : status,
                          }))
                        }
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Add User */}
          <div className="add-user-wrapper" ref={addUserRef}>
            <button
              className="btn btn-primary"
              onClick={() => setAddUserOpen(!addUserOpen)}
            >
              <FiPlus />
              <span>Add User</span>
            </button>

            {addUserOpen && (
              <div className="add-user-dropdown slide-down">
                {["Student", "Teacher", "Admin", "Super Admin"].map((role) => (
                  <button
                    key={role}
                    className="add-user-option"
                    onClick={() => {
                      setSelectedRole(role);
                      setAddUserOpen(false);
                    }}
                  >
                    <div className="add-user-icon">
                      <FiPlus />
                    </div>
                    <span>{role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.role || filters.status || filters.batch) && (
        <div className="active-filters">
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <span key={key} className="filter-tag">
                  {value}
                  <FiX onClick={() => removeFilter(key)} />
                </span>
              )
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Users</h4>
          <p className="summary-value">{users.length}</p>
        </div>
        {(searchTerm || filters.role || filters.status || filters.batch) && (
          <div className="summary-card">
            <h4>Filtered Results</h4>
            <p className="summary-value">{filteredUsers.length}</p>
          </div>
        )}
        {selectedUsers.length > 0 && (
          <div className="summary-card highlight">
            <h4>Selected Users</h4>
            <p className="summary-value">{selectedUsers.length}</p>
          </div>
        )}
      </div>

      {/* Add User Form */}
      {selectedRole && (
        <div className="user-form-card fade-in">
          <div className="form-header">
            <h3>Create {selectedRole}</h3>
            <button
              className="btn-icon"
              onClick={() => {
                setSelectedRole(null);
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
              }}
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            {(selectedRole === "Admin" || selectedRole === "Super Admin") && (
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter password"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                    required
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            )}

            {selectedRole === "Student" && (
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Roll Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleFormChange}
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
                    ]}
                    value={formData.batch}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, batch: val }))
                    }
                    placeholder="Select Batch"
                  />
                </div>
                {selectedRole === "Student" && (
  <div className="form-row">
    <div className="form-group">
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleFormChange}
        placeholder="Leave empty to auto-generate"
      />
    </div>
    <div className="form-group">
      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleFormChange}
        placeholder="Leave empty to auto-generate"
      />
    </div>
  </div>
)}
              </div>
            )}

            {selectedRole === "Teacher" && (
              <div className="form-group">
                <label>
                  Courses/Subjects <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleFormChange}
                  required
                  placeholder="Math, Physics, Chemistry"
                />
              </div>
            )}

            {selectedRole === "Admin" && (
              <div className="form-group">
                <label>
                  Department <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                  placeholder="Academic Affairs"
                />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create User
              </button>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sendInvite"
                  checked={formData.sendInvite}
                  onChange={handleFormChange}
                />
                <span>Send invitation email</span>
              </label>
            </div>
          </form>
        </div>
      )}
      {/* Edit User Modal */}
{editUser && (
  <div className="modal-overlay">
    <div className="user-form-card fade-in modal-card">
      <div className="form-header">
        <h3>Edit User</h3>
        <button className="btn-icon" onClick={() => setEditUser(null)}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSaveEdit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={editUser.fullName || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, fullName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editUser.email || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={editUser.phone || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={editUser.username || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
            />
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

{/* Suspend User Modal */}
{suspendPopup.open && suspendPopup.user && (
  <div
    className="popup-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <div
      className="popup-card"
      style={{
        background: "#fff",
        borderRadius: 8,
        width: "90%",
        maxWidth: 400,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {suspendPopup.user.status === "Suspended" ? (
        <>
          <p>
            This user is already suspended. Do you want to reactivate the user?
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button
              className="btn btn-outline"
              onClick={() => setSuspendPopup({ open: false, user: null })}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                // Reactivate user
                setUsers((prev) =>
                  prev.map((u) =>
                    u.user_id === suspendPopup.user.user_id
                      ? { ...u, status: "Active" }
                      : u
                  )
                );
                setSuspendPopup({ open: false, user: null });
              }}
            >
              Reactivate
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>Suspend User</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target);
              const reason = form.get("reason");
              const start = form.get("start");
              const end = form.get("end");
              const status = form.get("status");

              setUsers((prev) =>
                prev.map((u) =>
                  u.user_id === suspendPopup.user.user_id
                    ? { ...u, status, suspendReason: reason, suspendStart: start, suspendEnd: end }
                    : u
                )
              );
              setSuspendPopup({ open: false, user: null });
            }}
          >
            <div className="form-group">
              <label>Reason for Suspension</label>
              <input type="text" name="reason" required placeholder="Enter reason" />
            </div>
            <div className="form-group">
              <label>Suspension Timeline</label>
              <input type="date" name="start" required /> to <input type="date" name="end" required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" defaultValue="Suspended">
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSuspendPopup({ open: false, user: null })}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  </div>
)}




      {/* Users Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => handleSelectUser(user.user_id)}
                      />
                    </td>
                    <td className="user-cell">
                      <div className="user-avatar-wrapper">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.username}
                            className="user-avatar"
                          />
                        ) : (
                          <div className="user-avatar-placeholder">
                            <HiUserCircle />
                          </div>
                        )}
                      </div>
                      <span className="user-name">{user.username}</span>
                    </td>
                    <td className="role-cell">{user.role || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${user.status?.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="date-cell">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <button
  className="btn-icon action-edit"
  title="Edit"
  onClick={() => setEditUser(user)}
>
  <FiEdit2 />
</button>
    <button
  className="btn-icon action-delete"
  title="Delete"
  onClick={() => handleDeleteUser(user.user_id)}
>
  <FiTrash2 />
</button>

{/* Suspend / Unsuspend Button */}
{user.status === "Suspended" ? (
  <button
    className="btn-icon action-unsuspend"
    title="Unsuspend"
    onClick={() =>
      setSuspendPopup({ open: true, user: { ...user, action: "reactivate" } })
    }
  >
    <MdBlock />
  </button>
) : (
  <button
    className="btn-icon action-suspend"
    title="Suspend"
    onClick={() =>
      setSuspendPopup({ open: true, user: { ...user, action: "suspend" } })
    }
  >
    <RiUserForbidFill />
  </button>
)}

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <p>No users found</p>
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

export default UserManagement;
