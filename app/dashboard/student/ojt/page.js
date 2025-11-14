'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/Dashboard/DashboardLayout';
import styles from './ojt.module.css';

export default function StudentOJT() {
  const [hasOJT, setHasOJT] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [ojtData, setOjtData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    supervisorEmail: '',
    supervisorPhone: '',
    officeAddress: '',
    hoursCompleted: 0,
    totalHours: 400,
    status: 'Active',
    documents: []
  });

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    supervisorEmail: '',
    supervisorPhone: '',
    officeAddress: '',
    totalHours: 400
  });

  const [logEntry, setLogEntry] = useState({
    date: '',
    hoursWorked: '',
    activities: '',
    learnings: ''
  });

  const [timeLogs, setTimeLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    loadOJTData();
  }, []);

  const loadOJTData = () => {
    if (typeof window === 'undefined') return;
    
    const storedOJT = localStorage.getItem('studentOJTData');
    if (storedOJT) {
      const data = JSON.parse(storedOJT);
      setOjtData(data);
      setHasOJT(true);
    }

    const storedLogs = localStorage.getItem('studentOJTLogs');
    if (storedLogs) {
      setTimeLogs(JSON.parse(storedLogs));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setLogEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOJT = (e) => {
    e.preventDefault();
    const newOJT = {
      ...formData,
      hoursCompleted: 0,
      status: 'Active',
      documents: []
    };
    setOjtData(newOJT);
    setHasOJT(true);
    localStorage.setItem('studentOJTData', JSON.stringify(newOJT));
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateOJT = (e) => {
    e.preventDefault();
    const updatedOJT = {
      ...ojtData,
      ...formData
    };
    setOjtData(updatedOJT);
    localStorage.setItem('studentOJTData', JSON.stringify(updatedOJT));
    setShowEditModal(false);
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      ...logEntry,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedLogs = [...timeLogs, newLog];
    setTimeLogs(updatedLogs);
    localStorage.setItem('studentOJTLogs', JSON.stringify(updatedLogs));

    // Update total hours
    const newHoursCompleted = ojtData.hoursCompleted + parseFloat(logEntry.hoursWorked);
    const updatedOJT = {
      ...ojtData,
      hoursCompleted: newHoursCompleted
    };
    setOjtData(updatedOJT);
    localStorage.setItem('studentOJTData', JSON.stringify(updatedOJT));

    setShowLogModal(false);
    resetLogForm();
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      const logToDelete = timeLogs.find(log => log.id === logId);
      const updatedLogs = timeLogs.filter(log => log.id !== logId);
      setTimeLogs(updatedLogs);
      localStorage.setItem('studentOJTLogs', JSON.stringify(updatedLogs));

      // Update total hours
      const newHoursCompleted = ojtData.hoursCompleted - parseFloat(logToDelete.hoursWorked);
      const updatedOJT = {
        ...ojtData,
        hoursCompleted: Math.max(0, newHoursCompleted)
      };
      setOjtData(updatedOJT);
      localStorage.setItem('studentOJTData', JSON.stringify(updatedOJT));
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      supervisor: '',
      supervisorEmail: '',
      supervisorPhone: '',
      officeAddress: '',
      totalHours: 400
    });
  };

  const resetLogForm = () => {
    setLogEntry({
      date: '',
      hoursWorked: '',
      activities: '',
      learnings: ''
    });
  };

  const openEditModal = () => {
    setFormData({
      company: ojtData.company,
      position: ojtData.position,
      startDate: ojtData.startDate,
      endDate: ojtData.endDate,
      supervisor: ojtData.supervisor,
      supervisorEmail: ojtData.supervisorEmail,
      supervisorPhone: ojtData.supervisorPhone,
      officeAddress: ojtData.officeAddress,
      totalHours: ojtData.totalHours
    });
    setShowEditModal(true);
  };

  const progressPercentage = (ojtData.hoursCompleted / ojtData.totalHours) * 100;

  return (
    <DashboardLayout userType="student">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>My OJT Management</h1>
            <p>Track and manage your On-the-Job Training experience</p>
          </div>
          {!hasOJT && (
            <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add OJT Information
            </button>
          )}
        </div>

        {!hasOJT ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2>No OJT Information Yet</h2>
            <p>Add your OJT details to start tracking your progress</p>
            <button className={styles.emptyStateBtn} onClick={() => setShowAddModal(true)}>
              Add OJT Information
            </button>
          </div>
        ) : (
          <>
            {/* OJT Overview Card */}
            <div className={styles.ojtOverview}>
              <div className={styles.overviewHeader}>
                <div className={styles.companyInfo}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h2>{ojtData.company}</h2>
                    <p>{ojtData.position}</p>
                  </div>
                </div>
                <button className={styles.editBtn} onClick={openEditModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Duration</span>
                  <span className={styles.value}>{ojtData.startDate} - {ojtData.endDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Supervisor</span>
                  <span className={styles.value}>{ojtData.supervisor}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Supervisor Email</span>
                  <span className={styles.value}>{ojtData.supervisorEmail}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Supervisor Phone</span>
                  <span className={styles.value}>{ojtData.supervisorPhone}</span>
                </div>
                <div className={styles.detailItem} style={{gridColumn: '1 / -1'}}>
                  <span className={styles.label}>Office Address</span>
                  <span className={styles.value}>{ojtData.officeAddress}</span>
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Training Progress</span>
                  <span className={styles.hoursText}>
                    {ojtData.hoursCompleted} / {ojtData.totalHours} hours ({Math.round(progressPercentage)}%)
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Time Logs Section */}
            <div className={styles.logsSection}>
              <div className={styles.logsHeader}>
                <h2>Time Logs</h2>
                <button className={styles.addLogBtn} onClick={() => setShowLogModal(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Log Entry
                </button>
              </div>

              {timeLogs.length === 0 ? (
                <div className={styles.noLogs}>
                  <p>No time logs yet. Add your first entry to start tracking your hours.</p>
                </div>
              ) : (
                <div className={styles.logsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Hours</th>
                        <th>Activities</th>
                        <th>Learnings</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeLogs.map(log => (
                        <tr key={log.id}>
                          <td>{log.date}</td>
                          <td>{log.hoursWorked}h</td>
                          <td>{log.activities}</td>
                          <td>{log.learnings}</td>
                          <td>{log.submittedDate}</td>
                          <td>
                            <button 
                              className={styles.deleteLogBtn}
                              onClick={() => handleDeleteLog(log.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add OJT Modal */}
        {showAddModal && (
          <div className={styles.modal} onClick={() => setShowAddModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Add OJT Information</h2>
                <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddOJT} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Name *</label>
                    <input
                      type="text"
                      name="supervisor"
                      value={formData.supervisor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Email *</label>
                    <input
                      type="email"
                      name="supervisorEmail"
                      value={formData.supervisorEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Phone *</label>
                    <input
                      type="tel"
                      name="supervisorPhone"
                      value={formData.supervisorPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Total Required Hours *</label>
                    <input
                      type="number"
                      name="totalHours"
                      value={formData.totalHours}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
                    <label>Office Address *</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      required
                      rows="2"
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Add OJT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit OJT Modal */}
        {showEditModal && (
          <div className={styles.modal} onClick={() => setShowEditModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Edit OJT Information</h2>
                <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateOJT} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Name *</label>
                    <input
                      type="text"
                      name="supervisor"
                      value={formData.supervisor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Email *</label>
                    <input
                      type="email"
                      name="supervisorEmail"
                      value={formData.supervisorEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Supervisor Phone *</label>
                    <input
                      type="tel"
                      name="supervisorPhone"
                      value={formData.supervisorPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Total Required Hours *</label>
                    <input
                      type="number"
                      name="totalHours"
                      value={formData.totalHours}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
                    <label>Office Address *</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      required
                      rows="2"
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Update OJT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Log Entry Modal */}
        {showLogModal && (
          <div className={styles.modal} onClick={() => setShowLogModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Add Time Log Entry</h2>
                <button className={styles.closeBtn} onClick={() => setShowLogModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddLog} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={logEntry.date}
                    onChange={handleLogInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Hours Worked *</label>
                  <input
                    type="number"
                    name="hoursWorked"
                    value={logEntry.hoursWorked}
                    onChange={handleLogInputChange}
                    required
                    min="0.5"
                    step="0.5"
                    placeholder="e.g., 8"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Activities Performed *</label>
                  <textarea
                    name="activities"
                    value={logEntry.activities}
                    onChange={handleLogInputChange}
                    required
                    rows="3"
                    placeholder="Describe what you did today..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Key Learnings *</label>
                  <textarea
                    name="learnings"
                    value={logEntry.learnings}
                    onChange={handleLogInputChange}
                    required
                    rows="3"
                    placeholder="What did you learn from today's activities..."
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowLogModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Add Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
