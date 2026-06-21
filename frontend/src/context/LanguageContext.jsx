import React, { createContext, useState, useContext } from 'react';
import siteConfig from '../config/siteConfig.json';

const LanguageContext = createContext();

const translations = {
  en: {
    portalTitle: siteConfig.branding.siteNameEn,
    portalSubTitle: siteConfig.branding.siteSubEn,
    govtText: siteConfig.branding.initiativeEn,
    
    // Nav Bar
    lodgeComplaint: 'Lodge Grievance',
    viewComplaints: 'Grievance Board',
    officerPortal: 'Officer Portal',
    logout: 'Logout',
    
    // Hero Section
    heroTitle: 'Direct Voice to Your Local Corporation',
    heroSub: 'JanVaani connects citizens directly with Maharashtra Municipal Corporations. Register complaints, track resolution, and build a better city together.',
    
    // Stats Banner
    statTotal: 'Total Grievances',
    statRegistered: 'Registered',
    statReview: 'Under Review',
    statResolved: 'Resolved',
    
    // Welcome Banner
    welcomeHeader: 'Important Notice for Citizens',
    welcomeBody: 'Please provide accurate address and photo evidence of the grievance to help municipal officers locate and resolve the issue quickly.',
    
    // Filters
    searchPlaceholder: 'Search complaints by title, description or address...',
    filterCategory: 'All Categories',
    filterDistrict: 'All Districts',
    filterMahanagarpalika: 'All Corporations',
    filterStatus: 'All Statuses',
    clearFilters: 'Clear Filters',
    
    // Form Wizard Steps
    stepJurisdiction: 'Jurisdiction',
    stepDetails: 'Grievance Details',
    stepEvidence: 'Evidence & Location',
    stepCitizen: 'Contact Details',
    
    // Form Labels & Placeholders
    labelDistrict: 'Select District',
    labelMahanagarpalika: 'Select Mahanagarpalika (Municipal Corporation)',
    labelTitle: 'Grievance Title',
    placeholderTitle: 'E.g., Overflowing garbage bin in Lane 4',
    labelCategory: 'Grievance Category',
    selectCategory: 'Select Category',
    labelDescription: 'Detailed Description',
    placeholderDescription: 'Explain the issue in detail, how long it has been present, etc.',
    labelAddress: 'Exact Location / Address',
    placeholderAddress: 'E.g., Near Ganesh Temple, Sector 12, Pimpri',
    labelUpload: 'Upload Evidence Images (Max 5)',
    uploadDragDrop: 'Click or drag files here to upload (PNG, JPG)',
    labelCitizenName: 'Full Name',
    placeholderCitizenName: 'E.g., Ramesh Shinde',
    labelCitizenPhone: 'Mobile Number',
    placeholderCitizenPhone: '10-digit mobile number',
    
    // Buttons
    btnNext: 'Next Step',
    btnBack: 'Back',
    btnSubmit: 'Submit Grievance',
    btnCancel: 'Cancel',
    btnUpvote: 'Upvote',
    btnUpvoted: 'Upvoted',
    btnUpdateStatus: 'Update Status',
    
    // Success / Alerts
    submitSuccess: 'Your grievance has been registered successfully!',
    submitSuccessSub: 'Registration ID has been saved to memory. The local corporation officers will inspect it shortly.',
    dbFallbackWarning: 'Running in Local Memory Mode. Data will reset on server restart.',
    
    // Empty state
    noComplaints: 'No Grievances Found',
    noComplaintsSub: 'Try adjusting your filters or search terms, or be the first to register a grievance in this area!',
    
    // Officer Portal
    officerLogin: 'Municipal Officer Secure Login',
    officerEmail: 'Officer Email Address',
    officerPassword: 'Password',
    btnLogin: 'Secure Login',
    loginError: 'Invalid email or password. Hint: officer@maharashtra.gov.in / officer123',
    officerWelcome: 'Welcome Officer',
    officerDistrict: 'Assigned District',
    labelOfficerRemarks: 'Officer Action Remarks',
    placeholderOfficerRemarks: 'Provide action plan, resolution timeline, or closing details...',
    badgeOfficer: 'Verified Officer',
    remarksTitle: 'Official Corporation Response',
    remarksDate: 'Resolved on'
  },
  mr: {
    portalTitle: siteConfig.branding.siteNameMr,
    portalSubTitle: siteConfig.branding.siteSubMr,
    govtText: siteConfig.branding.initiativeMr,

    
    // Nav Bar
    lodgeComplaint: 'तक्रार नोंदवा',
    viewComplaints: 'तक्रार निवारण मंडळ',
    officerPortal: 'अधिकारी दालन',
    logout: 'बाहेर पडा',
    
    // Hero Section
    heroTitle: 'तुमच्या स्थानिक महानगरपालिकेशी थेट संवाद',
    heroSub: 'जनवाणी नागरिकांना थेट महाराष्ट्रातील महानगरपालिकांशी जोडते. तक्रार नोंदवा, प्रगतीचा मागोवा घ्या आणि एकत्र मिळून एक सुंदर शहर घडवा.',
    
    // Stats Banner
    statTotal: 'एकूण तक्रारी',
    statRegistered: 'नोंदणीकृत',
    statReview: 'पुनरावलोकनाधीन',
    statResolved: 'निवारण झाले',
    
    // Welcome Banner
    welcomeHeader: 'नागरिकांसाठी महत्त्वाची सूचना',
    welcomeBody: 'महानगरपालिका अधिकाऱ्यांना तक्रारीचे निवारण जलद गतीने करता यावे यासाठी कृपया अचूक पत्ता आणि फोटो पुरावा सोबत जोडा.',
    
    // Filters
    searchPlaceholder: 'तक्रारीचे नाव, तपशील किंवा पत्त्याद्वारे शोधा...',
    filterCategory: 'सर्व श्रेणी',
    filterDistrict: 'सर्व जिल्हे',
    filterMahanagarpalika: 'सर्व महानगरपालिका',
    filterStatus: 'सर्व स्थिती',
    clearFilters: 'फिल्टर साफ करा',
    
    // Form Wizard Steps
    stepJurisdiction: 'अधिकार क्षेत्र',
    stepDetails: 'तक्रारीचा तपशील',
    stepEvidence: 'पुरावा आणि पत्ता',
    stepCitizen: 'संपर्क तपशील',
    
    // Form Labels & Placeholders
    labelDistrict: 'जिल्हा निवडा',
    labelMahanagarpalika: 'महानगरपालिका निवडा',
    labelTitle: 'तक्रारीचे शीर्षक',
    placeholderTitle: 'उदा. गल्ली क्र. ४ मधील कचरा पेटी ओसंडून वाहत आहे',
    labelCategory: 'तक्रारीची श्रेणी',
    selectCategory: 'श्रेणी निवडा',
    labelDescription: 'सविस्तर वर्णन',
    placeholderDescription: 'समस्येचे सविस्तर वर्णन करा (उदा. समस्या कधीपासून आहे, इत्यादी.)',
    labelAddress: 'अचूक पत्ता / ठिकाण',
    placeholderAddress: 'उदा. गणेश मंदिराशेजारी, सेक्टर १२, पिंपरी',
    labelUpload: 'तक्रारीचे फोटो पुरावा जोडा (कमाल ५)',
    uploadDragDrop: 'अपलोड करण्यासाठी फाइल येथे क्लिक करा किंवा ड्रॅग करा (PNG, JPG)',
    labelCitizenName: 'पूर्ण नाव',
    placeholderCitizenName: 'उदा. रमेश शिंदे',
    labelCitizenPhone: 'मोबाईल क्रमांक',
    placeholderCitizenPhone: '१० अंकी मोबाईल क्रमांक',
    
    // Buttons
    btnNext: 'पुढील पायरी',
    btnBack: 'मागे',
    btnSubmit: 'तक्रार सबमिट करा',
    btnCancel: 'रद्द करा',
    btnUpvote: 'समर्थन द्या',
    btnUpvoted: 'समर्थन दिले',
    btnUpdateStatus: 'स्थिती अद्यतनित करा',
    
    // Success / Alerts
    submitSuccess: 'तुमची तक्रार यशस्वीरित्या नोंदवली गेली आहे!',
    submitSuccessSub: 'तुमचा तक्रार आयडी जतन करण्यात आला आहे. महानगरपालिका अधिकारी लवकरच याची पाहणी करतील.',
    dbFallbackWarning: 'सिस्टम स्थानिक मेमरी मोडमध्ये चालू आहे. सर्व्हर रीस्टार्ट झाल्यावर डेटा रीसेट होईल.',
    
    // Empty state
    noComplaints: 'कोणत्याही तक्रारी आढळल्या नाहीत',
    noComplaintsSub: 'फिल्टर किंवा शोध बदलून पहा किंवा या क्षेत्रातील पहिले तक्रारदार व्हा!',
    
    // Officer Portal
    officerLogin: 'महानगरपालिका अधिकारी सुरक्षित लॉगिन',
    officerEmail: 'अधिकारी ईमेल आयडी',
    officerPassword: 'पासवर्ड',
    btnLogin: 'लॉगिन करा',
    loginError: 'ईमेल किंवा पासवर्ड चुकीचा आहे. टीप: officer@maharashtra.gov.in / officer123',
    officerWelcome: 'स्वागत आहे अधिकारी',
    officerDistrict: 'नियुक्त जिल्हा',
    labelOfficerRemarks: 'अधिकारी कृती शेरा',
    placeholderOfficerRemarks: 'कृती आराखडा, निवारणाची मुदत किंवा अंतिम निवारण अहवाल लिहा...',
    badgeOfficer: 'प्रमाणित अधिकारी',
    remarksTitle: 'अधिकृत महानगरपालिका प्रतिसाद',
    remarksDate: 'निवारणाची तारीख'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = (selectedLang) => {
    if (translations[selectedLang]) {
      setLang(selectedLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
