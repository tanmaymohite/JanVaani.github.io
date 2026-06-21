const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const { getDbMode } = require('../config/db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to generate a unique random ID for mock mode
const generateId = () => Math.random().toString(36).substring(2, 9);

// 1. GET ALL COMPLAINTS (with filtering)
router.get('/', async (req, res) => {
  const { district, mahanagarpalika, category, status, search } = req.query;
  const { isMockMode, mockDb } = getDbMode();

  if (isMockMode) {
    let list = [...mockDb.complaints];

    // Filter by district
    if (district) {
      list = list.filter(c => c.district === district);
    }
    // Filter by corporation
    if (mahanagarpalika) {
      list = list.filter(c => c.mahanagarpalika === mahanagarpalika);
    }
    // Filter by category
    if (category) {
      list = list.filter(c => c.category === category);
    }
    // Filter by status
    if (status) {
      list = list.filter(c => c.status === status);
    }
    // Filter by search query (title / description / address)
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }

    // Sort by newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json(list);
  } else {
    try {
      let query = {};
      if (district) query.district = district;
      if (mahanagarpalika) query.mahanagarpalika = mahanagarpalika;
      if (category) query.category = category;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }

      const complaints = await Complaint.find(query).sort({ createdAt: -1 });
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

// 2. SUBMIT A COMPLAINT
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, description, district, mahanagarpalika, address, citizenName, citizenPhone } = req.body;
    
    // Process uploaded image file names
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const { isMockMode, mockDb } = getDbMode();

    if (isMockMode) {
      const newComplaint = {
        _id: generateId(),
        title,
        category,
        description,
        district,
        mahanagarpalika,
        address,
        images: imageUrls,
        citizenName,
        citizenPhone,
        status: 'Registered',
        officerRemarks: '',
        upvotes: 0,
        createdAt: new Date().toISOString()
      };
      
      mockDb.complaints.push(newComplaint);
      return res.status(201).json(newComplaint);
    } else {
      const newComplaint = new Complaint({
        title,
        category,
        description,
        district,
        mahanagarpalika,
        address,
        images: imageUrls,
        citizenName,
        citizenPhone
      });

      const saved = await newComplaint.save();
      res.status(201).json(saved);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPVOTE A COMPLAINT
router.post('/:id/upvote', async (req, res) => {
  const { id } = req.params;
  const { isMockMode, mockDb } = getDbMode();

  if (isMockMode) {
    const complaint = mockDb.complaints.find(c => c._id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    complaint.upvotes = (complaint.upvotes || 0) + 1;
    return res.json(complaint);
  } else {
    try {
      const complaint = await Complaint.findById(id);
      if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
      
      complaint.upvotes += 1;
      await complaint.save();
      res.json(complaint);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

// 4. UPDATE COMPLAINT STATUS (OFFICER PORTAL)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, officerRemarks } = req.body;
  const { isMockMode, mockDb } = getDbMode();

  if (!['Registered', 'Under Review', 'Resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  if (isMockMode) {
    const complaint = mockDb.complaints.find(c => c._id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.officerRemarks = officerRemarks || '';
    
    return res.json(complaint);
  } else {
    try {
      const complaint = await Complaint.findById(id);
      if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

      complaint.status = status;
      complaint.officerRemarks = officerRemarks || '';
      
      await complaint.save();
      res.json(complaint);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

// 5. GET SYSTEM STATISTICS
router.get('/stats', async (req, res) => {
  const { isMockMode, mockDb } = getDbMode();

  if (isMockMode) {
    const list = mockDb.complaints;
    const stats = {
      total: list.length,
      registered: list.filter(c => c.status === 'Registered').length,
      underReview: list.filter(c => c.status === 'Under Review').length,
      resolved: list.filter(c => c.status === 'Resolved').length
    };
    return res.json(stats);
  } else {
    try {
      const total = await Complaint.countDocuments();
      const registered = await Complaint.countDocuments({ status: 'Registered' });
      const underReview = await Complaint.countDocuments({ status: 'Under Review' });
      const resolved = await Complaint.countDocuments({ status: 'Resolved' });

      res.json({ total, registered, underReview, resolved });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

module.exports = router;
