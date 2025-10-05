// Dashboard.jsx
import React, { useState } from "react";
import {
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiBarChart2,
  FiHome,
  FiMenu,
  FiX,
  FiClock,
  FiPlus,
  FiUpload,
  FiFileText,
  FiSearch,
} from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";
import UserManagement from "./UserManagement";
import CourseAndMaterial from "./CourseAndManagement";
import BatchEnrollmentManagement from "./Batch";
import ReportsAnalytics from "./ReportsAnalytics";
import "../Styles/DashBoard.css";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: FiHome },
    { id: "UserManagement", label: "User Management", icon: FiUsers },
    { id: "CourseMaterial", label: "Courses & Materials", icon: FiBookOpen },
    { id: "BatchEnrollment", label: "Batches & Enrollment", icon: FiLayers },
    { id: "Reports", label: "Reports & Analytics", icon: FiBarChart2 },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "UserManagement":
        return <UserManagement />;
      case "CourseMaterial":
        return <CourseAndMaterial />;
      case "BatchEnrollment":
        return <BatchEnrollmentManagement />;
      case "Reports":
        return <ReportsAnalytics />;
      case "Dashboard":
        return <DashboardOverview setActiveMenu={setActiveMenu} />;
      default:
        return <PlaceholderContent title="Select a menu item" />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className="navbar-logo-wrapper">
            <img
              src="/logo/logo.jpg"
              alt="My Career Point Logo"
              className="navbar-logo"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="%23E91E63"/></svg>';
              }}
            />
          </div>
          <h1 className="navbar-title">My Career Point</h1>
        </div>

        <div className="navbar-right">
          <div className="user-profile">
            <span className="user-name-d">John Doe</span>
            <div className="user-avatar">
              <HiUserCircle />
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${
                  activeMenu === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="sidebar-icon" />
                <span className="sidebar-text">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

// ===================== Dashboard Overview =====================
const DashboardOverview = ({ setActiveMenu }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy Data
  const kpis = [
    { label: "Total Students", value: 1250, icon: <FiUsers />, color: "stat-icon-pink" },
    { label: "Active Batches", value: 42, icon: <FiLayers />, color: "stat-icon-orange" },
    { label: "Active Teachers", value: 28, icon: <FiBookOpen />, color: "stat-icon-success" },
    { label: "Pending Approvals", value: 6, icon: <FiClock />, color: "stat-icon-info" },
  ];

  const actions = [
    { text: "New student enrolled: Sarah Johnson", time: "2 hours ago" },
    { text: "Teacher approved batch A1", time: "5 hours ago" },
    { text: "Material uploaded: Machine Learning Basics", time: "1 day ago" },
    { text: "Batch Spring 2025 created", time: "2 days ago" },
  ];

  const reports = [
    { title: "Pass % (Last Month)", value: "87%" },
    { title: "Average Attendance", value: "92%" },
  ];

  const quickLinks = [
    { label: "Create User", icon: <FiUsers />, menu: "UserManagement" },
    { label: "Create Batch", icon: <FiLayers />, menu: "BatchEnrollment" },
    { label: "Upload Material", icon: <FiUpload />, menu: "CourseMaterial" },
  ];

  const filteredActions = actions.filter((a) =>
    a.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-overview">
      <h2 className="page-title">Dashboard Overview</h2>

      {/* KPI Cards */}
      <div className="stats-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${kpi.color}`}>{kpi.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{kpi.label}</p>
              <h3 className="stat-value">{kpi.value}</h3>
              <p className="stat-change positive">Updated recently</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-white)",
            borderRadius: "12px",
            padding: "10px 18px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <FiSearch style={{ color: "var(--color-gray-600)" }} />
          <input
            type="text"
            placeholder="Search recent actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "transparent",
              outline: "none !Important",
              background: "transparent",
              fontSize: "var(--font-size-base)",

            }}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Actions */}
        <div className="dashboard-card">
          <h3 className="card-title">Recent Actions</h3>
          <div className="activity-list">
            {filteredActions.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon">
                  <FiClock />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{a.text}</p>
                  <p className="activity-time">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="dashboard-card">
          <h3 className="card-title">Quick Links</h3>
          <div className="quick-actions">
            {quickLinks.map((q, i) => (
              <button
                key={i}
                className="quick-action-btn"
                onClick={() => setActiveMenu(q.menu)}
              >
                {q.icon}
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Overview */}
        <div className="dashboard-card">
          <h3 className="card-title">Reports Quick View</h3>
          <div className="activity-list">
            {reports.map((r, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon">
                  <FiFileText />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{r.title}</p>
                  <p className="activity-time">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Component
const PlaceholderContent = ({ title }) => (
  <div className="placeholder-content">
    <h2 className="page-title">{title}</h2>
    <div className="placeholder-card">
      <p>This section is under development.</p>
      <p>Content will be added soon.</p>
    </div>
  </div>
);

export default Dashboard;
