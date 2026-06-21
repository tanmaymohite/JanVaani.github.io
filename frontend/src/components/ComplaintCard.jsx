import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import siteConfig from '../config/siteConfig.json';
import { ThumbsUp, MapPin, Calendar, User, Tag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ComplaintCard = ({ complaint, onUpvoteSuccess }) => {
  const { t } = useLanguage();
  const [hasVoted, setHasVoted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Check if user has already upvoted this complaint on local machine
  useEffect(() => {
    const votedState = localStorage.getItem(`janvaani_upvoted_${complaint._id}`);
    if (votedState) {
      setHasVoted(true);
    }
  }, [complaint._id]);

  // Handle Upvoting
  const handleUpvote = async () => {
    if (hasVoted) return;

    try {
      const response = await fetch(`${siteConfig.api.baseUrl}/api/complaints/${complaint._id}/upvote`, {
        method: 'POST'
      });

      if (response.ok) {
        setHasVoted(true);
        localStorage.setItem(`janvaani_upvoted_${complaint._id}`, 'true');
        if (onUpvoteSuccess) onUpvoteSuccess(complaint._id);
      }
    } catch (err) {
      console.error('Upvote request failed:', err);
    }
  };

  // Map category to Lucide icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Garbage': return <Clock size={16} />;
      case 'Drainage': return <AlertCircle size={16} />;
      case 'Roads': return <MapPin size={16} />;
      case 'Water Supply': return <Tag size={16} />;
      case 'Streetlights': return <AlertCircle size={16} />;
      case 'Public Health': return <CheckCircle2 size={16} />;
      default: return <Tag size={16} />;
    }
  };

  // Format date readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statusMap = {
    'Registered': 'badge-registered',
    'Under Review': 'badge-review',
    'Resolved': 'badge-resolved'
  };

  return (
    <>
      <div className="complaint-card">
        {/* Header containing Category Tag and Status Badge */}
        <div className="card-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.85rem', color: 'var(--primary)' }}>
            {getCategoryIcon(complaint.category)}
            <span>{complaint.category}</span>
          </div>
          <span className={`badge ${statusMap[complaint.status] || 'badge-registered'}`}>
            {complaint.status}
          </span>
        </div>

        {/* Complaint Title */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          {complaint.title}
        </h3>

        {/* Metadata: District, Mahanagarpalika, and Date */}
        <div className="card-meta">
          <div className="card-meta-item">
            <MapPin size={14} />
            <span>{complaint.mahanagarpalika}</span>
          </div>
          <div className="card-meta-item">
            <Calendar size={14} />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          <div className="card-meta-item">
            <User size={14} />
            <span>{complaint.citizenName}</span>
          </div>
        </div>

        {/* Complaint Description */}
        <p className="card-desc">{complaint.description}</p>

        {/* Evidence Images Gallery */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="card-media-gallery">
            {complaint.images.map((imgUrl, i) => {
              // Ensure we load images from the full server path
              const absoluteUrl = imgUrl.startsWith('http') ? imgUrl : `${siteConfig.api.baseUrl}${imgUrl}`;
              return (
                <img 
                  key={i} 
                  src={absoluteUrl} 
                  alt="Complaint evidence" 
                  className="gallery-thumbnail"
                  onClick={() => setLightboxImage(absoluteUrl)}
                />
              );
            })}
          </div>
        )}

        {/* Exact Location Footer Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: '500' }}>{complaint.address}</span>
        </div>

        {/* Action Panel: Upvote count */}
        <div className="card-footer-actions">
          <div className="upvote-container">
            <button 
              className={`upvote-btn ${hasVoted ? 'voted' : ''}`}
              onClick={handleUpvote}
              disabled={hasVoted}
            >
              <ThumbsUp size={16} />
              <span>{hasVoted ? t('btnUpvoted') : t('btnUpvote')}</span>
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {complaint.upvotes || 0} support(s)
            </span>
          </div>
        </div>

        {/* Official Resolution Remarks */}
        {complaint.status === 'Resolved' && complaint.officerRemarks && (
          <div className="remarks-card">
            <div className="remarks-header">
              {t('remarksTitle')}
            </div>
            <div className="remarks-body">
              {complaint.officerRemarks}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Image Viewer modal */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>&times;</button>
          <img src={lightboxImage} alt="Expanded evidence" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default ComplaintCard;
