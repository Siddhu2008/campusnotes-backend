const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { requireAuth } = require('../middleware/auth');

router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', requireAuth, resourceController.createResource);
router.get('/:id/download', resourceController.downloadResource);

module.exports = router;
