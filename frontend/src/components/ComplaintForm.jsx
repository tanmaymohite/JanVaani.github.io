import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { districtsData, corporationMapping, categoriesData } from '../data/maharashtraData';
import siteConfig from '../config/siteConfig.json';
import { Upload, X, MapPin, AlertCircle, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const ComplaintForm = ({ isOpen, onClose, onRefresh }) => {
  const { t, lang } = useLanguage();
  
  // Wizard Step State (1: Jurisdiction, 2: Details, 3: Location/Evidence, 4: Contact)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form Fields State
  const [district, setDistrict] = useState('');
  const [mahanagarpalika, setMahanagarpalika] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  // Load citizen info from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('janvaani_citizen_name');
    const savedPhone = localStorage.getItem('janvaani_citizen_phone');
    if (savedName) setCitizenName(savedName);
    if (savedPhone) setCitizenPhone(savedPhone);
  }, []);

  // Update Mahanagarpalika list when district changes
  useEffect(() => {
    setMahanagarpalika('');
  }, [district]);

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  if (!isOpen) return null;

  // Handle Image Upload Selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images max
      const totalFilesCount = selectedFiles.length + filesArray.length;
      if (totalFilesCount > 5) {
        alert('You can upload a maximum of 5 images.');
        return;
      }

      // Add to selected files
      setSelectedFiles(prev => [...prev, ...filesArray]);

      // Create object URLs for previews
      const previewsArray = filesArray.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => [...prev, ...previewsArray]);
    }
  };

  // Remove uploaded image from state
  const handleRemoveImage = (index) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(filePreviews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Next and Back navigation
  const nextStep = () => {
    if (step === 1 && (!district || !mahanagarpalika)) return;
    if (step === 2 && (!title || !category || !description)) return;
    if (step === 3 && !address) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Submit Complaint Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!citizenName || !citizenPhone) return;

    setIsSubmitting(true);

    // Persist details to localStorage
    localStorage.setItem('janvaani_citizen_name', citizenName);
    localStorage.setItem('janvaani_citizen_phone', citizenPhone);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('district', district);
    formData.append('mahanagarpalika', mahanagarpalika);
    formData.append('address', address);
    formData.append('citizenName', citizenName);
    formData.append('citizenPhone', citizenPhone);

    // Append images
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${siteConfig.api.baseUrl}/api/complaints`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      setSubmitSuccess(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Submission failed, trying fallback mockup database direct load', err);
      // Fallback submission if API down and backend db is mock
      alert('Error connecting to backend server. Please verify the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setDistrict('');
    setMahanagarpalika('');
    setTitle('');
    setCategory('');
    setDescription('');
    setAddress('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setSubmitSuccess(false);
    onClose();
  };

  // Available corporations for the selected district
  const availableCorporations = district ? corporationMapping[district] : [];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Modal Header */}
        <div className="modal-header">
          <h3>{t('lodgeComplaint')}</h3>
          <button onClick={handleResetAndClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Wizard Steps Progress Indicator */}
        {!submitSuccess && (
          <div style={{ padding: '1.5rem 2rem 0 2rem' }}>
            <div className="wizard-steps">
              <div className={`wizard-step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
              <div className={`wizard-step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
              <div className={`wizard-step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
              <div className={`wizard-step-node ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>4</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              <span>{t('stepJurisdiction')}</span>
              <span>{t('stepDetails')}</span>
              <span>{t('stepEvidence')}</span>
              <span>{t('stepCitizen')}</span>
            </div>
          </div>
        )}

        {/* Modal Body / Form Contents */}
        <div className="modal-body">
          {submitSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
              <h2>{t('submitSuccess')}</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {t('submitSuccessSub')}
              </p>
              <button className="btn btn-primary" onClick={handleResetAndClose} style={{ marginTop: '2rem' }}>
                Go to Grievance Board
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: JURISDICTION */}
              {step === 1 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">{t('labelDistrict')}</label>
                    <select 
                      className="form-control" 
                      value={district} 
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    >
                      <option value="">-- Select District --</option>
                      {districtsData.map(d => (
                        <option key={d.id} value={d.id}>
                          {lang === 'en' ? d.nameEn : d.nameMr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelMahanagarpalika')}</label>
                    <select 
                      className="form-control" 
                      value={mahanagarpalika} 
                      onChange={(e) => setMahanagarpalika(e.target.value)}
                      disabled={!district}
                      required
                    >
                      <option value="">-- Select Mahanagarpalika --</option>
                      {availableCorporations.map((c, i) => (
                        <option key={i} value={c.nameEn}>
                          {lang === 'en' ? c.nameEn : c.nameMr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: GRIEVANCE DETAILS */}
              {step === 2 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">{t('labelCategory')}</label>
                    <select 
                      className="form-control" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">-- {t('selectCategory')} --</option>
                      {categoriesData.map(c => (
                        <option key={c.id} value={c.id}>
                          {lang === 'en' ? c.nameEn : c.nameMr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelTitle')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder={t('placeholderTitle')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelDescription')}</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      placeholder={t('placeholderDescription')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION & EVIDENCE */}
              {step === 3 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">{t('labelAddress')}</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                      <input 
                        type="text" 
                        className="form-control" 
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder={t('placeholderAddress')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelUpload')}</label>
                    <div className="upload-zone" onClick={() => document.getElementById('evidence-upload').click()}>
                      <Upload size={32} className="upload-icon" style={{ margin: '0 auto 0.5rem auto' }} />
                      <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{t('uploadDragDrop')}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>PNG, JPG formats up to 5MB each</p>
                      <input 
                        type="file" 
                        id="evidence-upload" 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileChange}
                      />
                    </div>

                    {filePreviews.length > 0 && (
                      <div className="preview-grid">
                        {filePreviews.map((previewUrl, index) => (
                          <div key={index} className="preview-item">
                            <img src={previewUrl} alt={`Evidence ${index + 1}`} />
                            <button type="button" className="remove-img-btn" onClick={() => handleRemoveImage(index)}>
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT INFORMATION */}
              {step === 4 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">{t('labelCitizenName')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder={t('placeholderCitizenName')}
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelCitizenPhone')}</label>
                    <input 
                      type="tel" 
                      pattern="[0-9]{10}"
                      className="form-control" 
                      placeholder={t('placeholderCitizenPhone')}
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="welcome-banner" style={{ marginTop: '2rem' }}>
                    <div className="welcome-banner-icon">
                      <AlertCircle size={20} />
                    </div>
                    <div className="welcome-banner-text">
                      <h4 style={{ color: 'var(--primary)' }}>Verification details</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>The local municipal officers will review and contact you if they require further details about your grievance.</p>
                    </div>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!submitSuccess && (
          <div className="modal-footer">
            <div>
              {step > 1 && (
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  <ChevronLeft size={16} /> {t('btnBack')}
                </button>
              )}
            </div>

            <div>
              {step < 4 ? (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={nextStep}
                  disabled={(step === 1 && (!district || !mahanagarpalika)) || (step === 2 && (!title || !category || !description)) || (step === 3 && !address)}
                >
                  {t('btnNext')} <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !citizenName || !citizenPhone}
                >
                  {isSubmitting ? 'Submitting...' : t('btnSubmit')}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComplaintForm;
