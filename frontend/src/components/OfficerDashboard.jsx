import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import siteConfig from '../config/siteConfig.json';
import { ShieldCheck, LogOut, CheckCircle, Clock, FileText, ChevronRight, MapPin, Calendar, HelpCircle } from 'lucide-react';

const OfficerDashboard = ({ triggerRefresh, onRefreshStats }) => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Complaints States
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Status Form States (tracked per complaint ID)
  const [editingId, setEditingId] = useState(null);
  const [statusVal, setStatusVal] = useState('');
  const [remarksVal, setRemarksVal] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const savedLogin = sessionStorage.getItem('janvaani_officer_logged_in');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch all complaints for Officer view
  const fetchAllComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${siteConfig.api.baseUrl}/api/complaints`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Officer failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllComplaints();
    }
  }, [isLoggedIn, triggerRefresh]);

  // Handle Login submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'officer@maharashtra.gov.in' && password === 'officer123') {
      setIsLoggedIn(true);
      setLoginError(false);
      sessionStorage.setItem('janvaani_officer_logged_in', 'true');
    } else {
      setLoginError(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    sessionStorage.removeItem('janvaani_officer_logged_in');
  };

  // Open update modal/section
  const startStatusEdit = (complaint) => {
    setEditingId(complaint._id);
    setStatusVal(complaint.status);
    setRemarksVal(complaint.officerRemarks || '');
  };

  // Update Status and remarks call
  const handleStatusUpdate = async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${siteConfig.api.baseUrl}/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: statusVal,
          officerRemarks: remarksVal
        })
      });

      if (response.ok) {
        setEditingId(null);
        fetchAllComplaints();
        if (onRefreshStats) onRefreshStats();
      } else {
        alert('Failed to update status on server.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error updating status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Format Date Helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Filter complaints based on status
  const filteredComplaints = complaints.filter(c => {
    if (activeFilter === 'All') return true;
    return c.status === activeFilter;
  });

  // Render Login Card if not logged in
  if (!isLoggedIn) {
    return (
      <div className="login-box">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
          <ShieldCheck size={48} />
        </div>
        <h2 className="login-title">{t('officerLogin')}</h2>
        
        {loginError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: '500' }}>
            {t('loginError')}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">{t('officerEmail')}</label>
            <input 
              type="email" 
              className="form-control"
              placeholder="officer@maharashtra.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('officerPassword')}</label>
            <input 
              type="password" 
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {t('btnLogin')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          <strong>Demo credentials:</strong><br />
          Email: officer@maharashtra.gov.in<br />
          Password: officer123
        </div>
      </div>
    );
  }

  // Render Officer Dashboard if authenticated
  return (
    <div style={{ marginBottom: '4rem' }}>
      
      {/* Officer Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0A192F 0%, #1c3d5a 100%)', padding: '1.5rem 2rem', borderRadius: 'var(--radius-md)', color: 'white', borderBottom: '3px solid var(--accent)', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: 'var(--success)', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
              {t('badgeOfficer')}
            </span>
            <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
              {t('officerWelcome')}, Deshmukh
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {t('officerDistrict')}: <strong>Thane & Pune Districts</strong>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.15)' }}>
          <LogOut size={16} />
          {t('logout')}
        </button>
      </div>

      {/* Toggles for filtering by status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Grievance Management Panel ({filteredComplaints.length})</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          {['All', 'Registered', 'Under Review', 'Resolved'].map(filter => (
            <button
              key={filter}
              className={`switch-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {filter === 'All' ? 'All' : t(`stat${filter.replace(' ', '')}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Complaints for Officers */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <HelpCircle size={48} className="empty-state-icon" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No complaints found</h3>
          <p>No complaints match the selected status category.</p>
        </div>
      ) : (
        <div className="complaints-feed">
          {filteredComplaints.map(c => (
            <div key={c._id} className="complaint-card" style={{ borderLeft: c.status === 'Resolved' ? '4px solid var(--success)' : c.status === 'Under Review' ? '4px solid var(--warning)' : '4px solid var(--info)' }}>
              
              <div className="card-header-row">
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)' }}>ID: {c._id}</span>
                <span className={`badge ${c.status === 'Resolved' ? 'badge-resolved' : c.status === 'Under Review' ? 'badge-review' : 'badge-registered'}`}>
                  {c.status}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{c.title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{c.description}</p>

              {c.images && c.images.length > 0 && (
                <div className="card-media-gallery">
                  {c.images.map((imgUrl, i) => (
                    <img 
                      key={i} 
                      src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`} 
                      alt="Evidence thumbnail" 
                      className="gallery-thumbnail"
                      style={{ width: '4rem', height: '4rem' }}
                    />
                  ))}
                </div>
              )}

              {/* Jurisdiction metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <div>📍 <strong>Address:</strong> {c.address}</div>
                <div>🏢 <strong>Corporation:</strong> {c.mahanagarpalika}</div>
                <div>👤 <strong>Citizen:</strong> {c.citizenName} ({c.citizenPhone})</div>
                <div>📅 <strong>Submitted:</strong> {formatDate(c.createdAt)}</div>
              </div>

              {/* Action Update Section */}
              {editingId === c._id ? (
                <div style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <h5 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Modify Complaint Status</h5>
                  
                  <div className="form-group">
                    <label className="form-label">Update Status</label>
                    <select 
                      className="form-control" 
                      value={statusVal} 
                      onChange={(e) => setStatusVal(e.target.value)}
                    >
                      <option value="Registered">Registered</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelOfficerRemarks')}</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder={t('placeholderOfficerRemarks')}
                      value={remarksVal}
                      onChange={(e) => setRemarksVal(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      {t('btnCancel')}
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleStatusUpdate(c._id)}
                      disabled={actionLoading}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {actionLoading ? 'Updating...' : t('btnUpdateStatus')}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {c.officerRemarks ? (
                    <div style={{ fontSize: '0.85rem', borderLeft: '3px solid var(--success)', paddingLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                      <strong>Remarks:</strong> {c.officerRemarks}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      No officer remarks added yet.
                    </div>
                  )}

                  <button className="btn btn-secondary" onClick={() => startStatusEdit(c)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    Take Action
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;
