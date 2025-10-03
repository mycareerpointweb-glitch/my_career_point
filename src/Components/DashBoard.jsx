// Dashboard.jsx
import React, { useState } from 'react';
import { 
  FiUsers, FiBookOpen, FiLayers, FiBarChart2, FiHome, FiMenu, FiX 
} from 'react-icons/fi';
import { HiUserCircle } from 'react-icons/hi';
import UserManagement from './UserManagement';
import CourseAndMaterial from './CourseAndManagement';
import BatchEnrollmentManagement from './Batch';
import ReportsAnalytics from './ReportsAnalytics';
import '../Styles/DashBoard.css';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'UserManagement', label: 'User Management', icon: FiUsers },
    { id: 'CourseMaterial', label: 'Courses & Materials', icon: FiBookOpen },
    { id: 'BatchEnrollment', label: 'Batches & Enrollment', icon: FiLayers },
    { id: 'Reports', label: 'Reports & Analytics', icon: FiBarChart2 }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'UserManagement':
        return <UserManagement />;
      case 'CourseMaterial':
        return <CourseAndMaterial />;
      case 'BatchEnrollment':
        return <BatchEnrollmentManagement />;
      case 'Reports':
        return <ReportsAnalytics />;
      case 'Dashboard':
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
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="%23E91E63"/></svg>';
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
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
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
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ setActiveMenu }) => {
  return (
    <div className="dashboard-overview">
      <h2 className="page-title">Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-pink">
            <FiUsers />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">1,234</h3>
            <p className="stat-change positive">+12% this month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <FiBookOpen />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Courses</p>
            <h3 className="stat-value">45</h3>
            <p className="stat-change positive">+3 new</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <FiLayers />
          </div>
          <div className="stat-content">
            <p className="stat-label">Enrollments</p>
            <h3 className="stat-value">3,567</h3>
            <p className="stat-change positive">+8% this week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <FiBarChart2 />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completion Rate</p>
            <h3 className="stat-value">87%</h3>
            <p className="stat-change positive">+2% improved</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <FiUsers />
              </div>
              <div className="activity-content">
                <p className="activity-text">New student enrolled: Sarah Johnson</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FiBookOpen />
              </div>
              <div className="activity-content">
                <p className="activity-text">Course updated: Advanced JavaScript</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FiLayers />
              </div>
              <div className="activity-content">
                <p className="activity-text">New batch created: Spring 2025</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <button
              className="quick-action-btn"
              onClick={() => setActiveMenu("UserManagement")}
            >
              <FiUsers />
              <span>Add User</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => setActiveMenu("CourseMaterial")}
            >
              <FiBookOpen />
              <span>Create Course</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => setActiveMenu("BatchEnrollment")}
            >
              <FiLayers />
              <span>New Batch</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => setActiveMenu("Reports")}
            >
              <FiBarChart2 />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Component for sections under development
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
