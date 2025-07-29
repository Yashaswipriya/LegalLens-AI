const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const authMiddleware = require('../middleware/authMiddleware');
const generateInsights = require('../utils/generateInsights');
const Contract = require('../models/Contract');
const mongoose = require('mongoose');

//Multer Setup (storage + filter)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

//POST Route to Upload & Extract PDF Text
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  let filePath;
  try {
    filePath = path.join(__dirname, '..', req.file.path);
    console.log('File path:', filePath);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;
    const insights = await generateInsights(extractedText);
    await Contract.create({
      fileName: req.file.originalname,
      extractedText,
      uploadedBy: req.user._id,
      summary: insights.summary || 'No summary provided',
      riskyClauses: insights.riskyClauses || [],
      suggestions: insights.suggestions || [],
      riskScore: insights.riskScore || 0
    });

  res.json({
  success: true,
  extractedText,
  summary: insights.summary,
  riskyClauses: insights.riskyClauses,
  suggestions: insights.suggestions,
  riskScore: insights.riskScore,
});

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
  finally {
    // Always delete uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('File deletion failed:', err);
    }
  }
});

// GET /contracts - Get all contracts uploaded by the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contracts = await Contract.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ message: 'Failed to fetch contracts' });
  }
});

// GET /contract/:id - Get a single contract by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contract ID format' });
    }
    const contract = await Contract.findOne({
      _id: id,
      uploadedBy: req.user._id,
    });
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json({ success: true, contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ message: 'Failed to fetch contract' });
  }
});

// DELETE /contract/:id - Delete a contract by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contract ID format' });
    }
    const contract = await Contract.findOneAndDelete({
      _id: id,
      uploadedBy: req.user._id,
    });
    
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found or already deleted' });
    }
    res.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ message: 'Failed to delete contract' });
  }
});

module.exports = router;
