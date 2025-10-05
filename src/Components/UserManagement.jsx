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
import "../Styles/UserManagement.css";
import CreateUserForm from "./CreateUserForm"; // ✅ Import the reusable form

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

  const [editUser, setEditUser] = useState(null);
  const [suspendPopup, setSuspendPopup] = useState({ open: false, user: null });

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

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.user_id) : []);
  };

  // Delete user
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.user_id !== id));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === editUser.user_id ? editUser : user
      )
    );
    setEditUser(null);
  };

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleNewUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    alert(`User Created!\nUsername: ${newUser.username}`);
    setSelectedRole(null);
  };

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

      {/* ✅ Reusable CreateUserForm (Modal) */}
      {selectedRole && (
        <div className="modal-overlay">
          <CreateUserForm
            role={selectedRole}
            onClose={() => setSelectedRole(null)}
            onSubmit={handleNewUser}
          />
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
                        <button
                          className={`btn-icon ${
                            user.status === "Suspended"
                              ? "action-unsuspend"
                              : "action-suspend"
                          }`}
                          title={
                            user.status === "Suspended"
                              ? "Unsuspend"
                              : "Suspend"
                          }
                          onClick={() =>
                            setSuspendPopup({
                              open: true,
                              user: {
                                ...user,
                                action:
                                  user.status === "Suspended"
                                    ? "reactivate"
                                    : "suspend",
                              },
                            })
                          }
                        >
                          {user.status === "Suspended" ? (
                            <MdBlock />
                          ) : (
                            <RiUserForbidFill />
                          )}
                        </button>
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
