'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './jobs.module.css';

export default function EmployerJobs() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Remote',
      salary: '$80,000 - $120,000',
      applicants: 45,
      status: 'Active',
      posted: '2023-10-10',
      deadline: '2023-11-10',
      description: 'We are looking for a senior software engineer to join our growing team...'
    },
    {
      id: 2,
      title: 'UX Designer',
      department: 'Design',
      type: 'Full-time',
      location: 'Hybrid',
      salary: '$60,000 - $85,000',
      applicants: 32,
      status: 'Active',
      posted: '2023-10-08',
      deadline: '2023-11-08',
      description: 'Join our design team to create amazing user experiences...'
    },
    {
      id: 3,
      title: 'Marketing Intern',
      department: 'Marketing',
      type: 'Internship',
      location: 'On-site',
      salary: '$15/hour',
      applicants: 28,
      status: 'Active',
      posted: '2023-10-05',
      deadline: '2023-10-25',
      description: 'Great opportunity for students to gain marketing experience...'
    },
    {
      id: 4,
      title: 'Data Analyst',
      department: 'Analytics',
      type: 'Full-time',
      location: 'Remote',
      salary: '$55,000 - $75,000',
      applicants: 18,
      status: 'Closed',
      posted: '2023-09-20',
      deadline: '2023-10-20',
      description: 'Analyze data to drive business decisions...'
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    location: 'Remote',
    salary: '',
    deadline: '',
    description: '',
    requirements: ''
  });

  const activeJobs = jobs.filter(job => job.status === 'Active');
  const closedJobs = jobs.filter(job => job.status === 'Closed');
  const draftJobs = jobs.filter(job => job.status === 'Draft');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    const job = {
      id: jobs.length + 1,
      ...newJob,
      applicants: 0,
      status: 'Active',
      posted: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, job]);
    setNewJob({
      title: '',
      department: '',
      type: 'Full-time',
      location: 'Remote',
      salary: '',
      deadline: '',
      description: '',
      requirements: ''
    });
    setShowCreateModal(false);
  };

  const handleJobAction = (jobId, action) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: action === 'close' ? 'Closed' : action === 'activate' ? 'Active' : job.status }
        : job
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'Closed':
        return styles.statusClosed;
      case 'Draft':
        return styles.statusDraft;
      default:
        return styles.statusDefault;
    }
  };

  const renderJobCard = (job) => (
    <div key={job.id} className={styles.jobCard}>
      <div className={styles.jobHeader}>
        <div className={styles.jobTitleSection}>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <div className={styles.jobMeta}>
            <span className={styles.jobDepartment}>{job.department}</span>
            <span className={styles.jobType}>{job.type}</span>
            <span className={styles.jobLocation}>{job.location}</span>
          </div>
        </div>
        <div className={styles.jobActions}>
          <span className={`${styles.jobStatus} ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} title="View Details">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3C4.5 3 1.73 5.11 1 8C1.73 10.89 4.5 13 8 13C11.5 13 14.27 10.89 15 8C14.27 5.11 11.5 3 8 3Z" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button className={styles.actionButton} title="Edit Job">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            {job.status === 'Active' ? (
              <button 
                className={styles.closeButton} 
                title="Close Job"
                onClick={() => handleJobAction(job.id, 'close')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            ) : (
              <button 
                className={styles.activateButton} 
                title="Reactivate Job"
                onClick={() => handleJobAction(job.id, 'activate')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.jobDetails}>
        <div className={styles.jobInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Salary:</span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Posted:</span>
            <span className={styles.infoValue}>{job.posted}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Deadline:</span>
            <span className={styles.infoValue}>{job.deadline}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Applicants:</span>
            <span className={styles.applicantCount}>{job.applicants}</span>
          </div>
        </div>
        <p className={styles.jobDescription}>{job.description}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout userType="employer">
      <div className={styles.jobsContainer}>
        <div className={styles.jobsHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Job Postings</h1>
            <p className={styles.pageSubtitle}>Manage your job listings and track applications</p>
          </div>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Post New Job
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Jobs ({activeJobs.length})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'closed' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('closed')}
            >
              Closed Jobs ({closedJobs.length})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'drafts' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts ({draftJobs.length})
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className={styles.jobsList}>
          {activeTab === 'active' && activeJobs.map(renderJobCard)}
          {activeTab === 'closed' && closedJobs.map(renderJobCard)}
          {activeTab === 'drafts' && draftJobs.map(renderJobCard)}
          
          {((activeTab === 'active' && activeJobs.length === 0) ||
            (activeTab === 'closed' && closedJobs.length === 0) ||
            (activeTab === 'drafts' && draftJobs.length === 0)) && (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="20" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                <rect x="20" y="12" width="24" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3>No {activeTab} jobs found</h3>
              <p>
                {activeTab === 'active' && "You don't have any active job postings yet."}
                {activeTab === 'closed' && "No closed job postings."}
                {activeTab === 'drafts' && "No draft job postings."}
              </p>
              {activeTab === 'active' && (
                <button 
                  className={styles.createButton}
                  onClick={() => setShowCreateModal(true)}
                >
                  Post Your First Job
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        {showCreateModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Post New Job</h2>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateJob} className={styles.modalForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={newJob.title}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Department *</label>
                    <input
                      type="text"
                      name="department"
                      value={newJob.department}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Job Type *</label>
                    <select
                      name="type"
                      value={newJob.type}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Location *</label>
                    <select
                      name="location"
                      value={newJob.location}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Salary Range</label>
                    <input
                      type="text"
                      name="salary"
                      value={newJob.salary}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="e.g., $50,000 - $70,000"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Application Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={newJob.deadline}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Job Description *</label>
                  <textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="4"
                    required
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Requirements</label>
                  <textarea
                    name="requirements"
                    value={newJob.requirements}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="3"
                    placeholder="List the required skills, experience, and qualifications..."
                  />
                </div>
                
                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Post Job
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
