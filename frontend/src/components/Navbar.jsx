import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, PlusCircle, LayoutDashboard, ShieldAlert, Globe } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, onOpenComplaintModal }) => {
  const { lang, t, toggleLanguage } = useLanguage();

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo and Title */}
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); setActiveTab('board'); }}>
          <div className="nav-logo">JV</div>
          <div className="nav-title">
            <span className="nav-title-main">{t('portalTitle')}</span>
            <span className="nav-title-sub">{t('portalSubTitle')}</span>
          </div>
        </a>

        {/* Action Controls & Navigation */}
        <div className="nav-actions">
          <ul className="nav-links">
            <li>
              <span 
                className={`nav-link ${activeTab === 'board' ? 'active' : ''}`} 
                onClick={() => setActiveTab('board')}
              >
                <LayoutDashboard size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {t('viewComplaints')}
              </span>
            </li>
            <li>
              <span 
                className="nav-link" 
                onClick={onOpenComplaintModal}
                style={{ color: 'var(--primary)', fontWeight: '600' }}
              >
                <PlusCircle size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {t('lodgeComplaint')}
              </span>
            </li>
            <li>
              <span 
                className={`nav-link ${activeTab === 'officer' ? 'active' : ''}`} 
                onClick={() => setActiveTab('officer')}
              >
                <ShieldAlert size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {t('officerPortal')}
              </span>
            </li>
          </ul>

          <div className="divider"></div>

          {/* Language Switcher */}
          <div className="switch-container">
            <button 
              className={`switch-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => toggleLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`switch-btn ${lang === 'mr' ? 'active' : ''}`}
              onClick={() => toggleLanguage('mr')}
            >
              मराठी
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle-btn" 
            onClick={handleThemeToggle}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
