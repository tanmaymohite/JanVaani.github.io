import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ComplaintCard from './ComplaintCard';
import { districtsData, corporationMapping, categoriesData } from '../data/maharashtraData';
import siteConfig from '../config/siteConfig.json';
import { Search, RotateCcw, AlertOctagon, HelpCircle } from 'lucide-react';

const ComplaintList = ({ complaints, setComplaints, onRefresh, triggerRefresh }) => {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [mahanagarpalika, setMahanagarpalika] = useState('');
  const [status, setStatus] = useState('');

  // Fetch filtered data from Express API
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (district) params.append('district', district);
      if (mahanagarpalika) params.append('mahanagarpalika', mahanagarpalika);
      if (status) params.append('status', status);

      const url = `${siteConfig.api.baseUrl}/api/complaints?${params.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when any filter changes, or parent triggers a refresh
  useEffect(() => {
    fetchComplaints();
  }, [search, category, district, mahanagarpalika, status, triggerRefresh]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setDistrict('');
    setMahanagarpalika('');
    setStatus('');
  };

  // Upvote success callback updates specific card upvote count locally to avoid full API reload
  const handleLocalUpvoteUpdate = (id) => {
    setComplaints(prev => prev.map(c => {
      if (c._id === id) {
        return { ...c, upvotes: (c.upvotes || 0) + 1 };
      }
      return c;
    }));
    // Also notify statistics
    if (onRefresh) onRefresh();
  };

  const availableCorporations = district ? corporationMapping[district] : [];

  return (
    <div>
      {/* Search & Filter Controls Panel */}
      <div className="filter-bar">
        <div className="filter-grid">
          
          {/* Search Box */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('searchPlaceholder')}</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('labelCategory')}</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t('filterCategory')}</option>
              {categoriesData.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === 'en' ? c.nameEn : c.nameMr}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('labelDistrict')}</label>
            <select 
              className="form-control"
              value={district}
              onChange={(e) => { setDistrict(e.target.value); setMahanagarpalika(''); }}
            >
              <option value="">{t('filterDistrict')}</option>
              {districtsData.map(d => (
                <option key={d.id} value={d.id}>
                  {lang === 'en' ? d.nameEn : d.nameMr}
                </option>
              ))}
            </select>
          </div>

          {/* Mahanagarpalika Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('filterMahanagarpalika')}</label>
            <select 
              className="form-control"
              value={mahanagarpalika}
              onChange={(e) => setMahanagarpalika(e.target.value)}
              disabled={!district}
            >
              <option value="">{t('filterMahanagarpalika')}</option>
              {availableCorporations.map((c, i) => (
                <option key={i} value={c.nameEn}>
                  {lang === 'en' ? c.nameEn : c.nameMr}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Filter and Clear Options */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Status Radio Toggles */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn btn-secondary ${status === '' ? 'btn-outline' : ''}`}
              onClick={() => setStatus('')}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              All
            </button>
            <button 
              className={`btn btn-secondary ${status === 'Registered' ? 'btn-outline' : ''}`}
              onClick={() => setStatus('Registered')}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {t('statRegistered')}
            </button>
            <button 
              className={`btn btn-secondary ${status === 'Under Review' ? 'btn-outline' : ''}`}
              onClick={() => setStatus('Under Review')}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {t('statReview')}
            </button>
            <button 
              className={`btn btn-secondary ${status === 'Resolved' ? 'btn-outline' : ''}`}
              onClick={() => setStatus('Resolved')}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {t('statResolved')}
            </button>
          </div>

          {/* Reset Filters */}
          {(search || category || district || mahanagarpalika || status) && (
            <button 
              className="btn btn-secondary"
              onClick={handleClearFilters}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <RotateCcw size={14} style={{ marginRight: '4px' }} />
              {t('clearFilters')}
            </button>
          )}

        </div>
      </div>

      {/* Complaints Feed List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading grievances...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <HelpCircle size={48} className="empty-state-icon" style={{ margin: '0 auto 1rem auto' }} />
          <h3>{t('noComplaints')}</h3>
          <p>{t('noComplaintsSub')}</p>
        </div>
      ) : (
        <div className="complaints-feed">
          {complaints.map(complaint => (
            <ComplaintCard 
              key={complaint._id} 
              complaint={complaint} 
              onUpvoteSuccess={handleLocalUpvoteUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add rotation keyframe style directly for loading spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default ComplaintList;
