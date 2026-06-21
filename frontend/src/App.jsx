import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';
import OfficerDashboard from './components/OfficerDashboard';
import siteConfig from './config/siteConfig.json';
import { Info, Volume2, ShieldAlert } from 'lucide-react';

const AppContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('board');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [complaints, setComplaints] = useState([]);
  
  // Dashboard Counter Stats
  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    underReview: 0,
    resolved: 0
  });

  // Fetch stats from server
  const fetchStats = async () => {
    try {
      const response = await fetch(`${siteConfig.api.baseUrl}/api/complaints/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Could not fetch server stats, falling back to mock length calculation');
      // If server is running database fallback
      setStats({
        total: complaints.length,
        registered: complaints.filter(c => c.status === 'Registered').length,
        underReview: complaints.filter(c => c.status === 'Under Review').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
      });
    }
  };

  // Fetch stats on mount and when complaints are updated
  useEffect(() => {
    fetchStats();
  }, [complaints, triggerRefresh]);

  const handleRefresh = () => {
    setTriggerRefresh(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        onOpenComplaintModal={() => setIsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        
        {activeTab === 'board' ? (
          <>
            {/* Hero Section */}
            <header className="hero">
              <div className="container">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.08)' }}>
                  {t('govtText')}
                </div>
                <h1>{t('heroTitle')}</h1>
                <p>{t('heroSub')}</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsModalOpen(true)}
                  style={{ padding: '0.9rem 2rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
                >
                  {t('lodgeComplaint')}
                </button>
              </div>
            </header>

            {/* Statistics Banner */}
            <div className="container">
              <section className="stats-banner">
                <div className="stat-card">
                  <div className="stat-num total">{stats.total}</div>
                  <div className="stat-label">{t('statTotal')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num registered">{stats.registered}</div>
                  <div className="stat-label">{t('statRegistered')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num review">{stats.underReview}</div>
                  <div className="stat-label">{t('statReview')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num resolved">{stats.resolved}</div>
                  <div className="stat-label">{t('statResolved')}</div>
                </div>
              </section>

              {/* Informational Welcome Banner */}
              <div className="welcome-banner">
                <div className="welcome-banner-icon">
                  <Info size={20} />
                </div>
                <div className="welcome-banner-text">
                  <h4>{t('welcomeHeader')}</h4>
                  <p>{t('welcomeBody')}</p>
                </div>
              </div>

              {/* Complaints feed and list */}
              <ComplaintList 
                complaints={complaints}
                setComplaints={setComplaints}
                onRefresh={handleRefresh}
                triggerRefresh={triggerRefresh}
              />
            </div>
          </>
        ) : (
          /* Officer Management Workspace */
          <div className="container" style={{ marginTop: '3rem' }}>
            <OfficerDashboard 
              triggerRefresh={triggerRefresh} 
              onRefreshStats={handleRefresh}
            />
          </div>
        )}

      </main>

      {/* Complaint submission Modal popup */}
      <ComplaintForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleRefresh}
      />

      {/* Footer Branding */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: '6rem', transition: 'background-color var(--transition-normal)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>JanVaani Portal</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              &copy; {new Date().getFullYear()} Government of Maharashtra. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Wrap App in LanguageProvider to distribute localized states
const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
