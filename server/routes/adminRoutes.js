const express = require('express');
const router = express.Router();
const {
  getAdminSummary,
  getAdminPlaces,
  createAdminPlace,
  updateAdminPlace,
  archiveAdminPlace,
  restoreAdminPlace
} = require('../controllers/adminPlaceController');
const { protect } = require('../middleware/authMiddleware');

// All admin routes are strictly protected by auth middleware
router.use(protect);

router.get('/places/summary', getAdminSummary);
router.get('/places', getAdminPlaces);
router.post('/places', createAdminPlace);
router.put('/places/:id', updateAdminPlace);
router.patch('/places/:id/archive', archiveAdminPlace);
router.patch('/places/:id/restore', restoreAdminPlace);

module.exports = router;
