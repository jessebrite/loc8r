const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router
  .get('/', ctrlLocations.homelist)
  .get('/locations/:locationid', ctrlLocations.locationInfo)
  .get('/locations/:locationid/review/new', ctrlLocations.addReview)
  .post('/locations/:locationid/review/new', ctrlLocations.doAddReview);

/* Other pages*/
router
  .get('/generic-view', ctrlOthers.about)
  .get('/contact', ctrlOthers.contact);

module.exports = router;

