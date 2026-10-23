const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById
} = require('../controllers/placeController');

// Public tourist routes
router.get('/', getPlaces);
router.get('/:id', getPlaceById);

module.exports = router;
