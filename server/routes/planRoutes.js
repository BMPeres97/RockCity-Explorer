const express = require('express');
const router = express.Router();
const {
  calculatePlanMetrics,
  savePlan,
  getPlanByCode
} = require('../controllers/planController');

router.post('/calculate', calculatePlanMetrics);
router.post('/', savePlan);
router.get('/:planCode', getPlanByCode);

module.exports = router;
