const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');

// GET /api/v1/academic/branches
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true });
    return res.json({ success: true, data: branches });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/academic/subjects
router.get('/subjects', async (req, res) => {
  try {
    const { branchId, semesterId } = req.query;
    const query = { isActive: true };
    if (branchId) query.branchId = branchId;
    if (semesterId) query.semesterId = semesterId;

    const subjects = await Subject.find(query);
    return res.json({ success: true, data: subjects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
