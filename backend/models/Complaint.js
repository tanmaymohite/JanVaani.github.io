const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Garbage', 'Drainage', 'Roads', 'Water Supply', 'Streetlights', 'Public Health', 'Others']
  },
  description: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  mahanagarpalika: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  citizenName: {
    type: String,
    required: true
  },
  citizenPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Registered', 'Under Review', 'Resolved'],
    default: 'Registered'
  },
  officerRemarks: {
    type: String,
    default: ''
  },
  upvotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
