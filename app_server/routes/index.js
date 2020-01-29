const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/locations/:locationid/review/new', ctrlLocations.addReview);
router.post('/locations/:locationid/review/new', ctrlLocations.doAddReview);

/* Others page*/
router.get('/generic-view', ctrlOthers.about);

module.exports = router;
