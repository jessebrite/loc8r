const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Others page*/
router.get('/generic-view', ctrlOthers.about);

const animals = require('../controllers/animals');
router.get('/cats', animals.cats);
router.get('/birds', animals.birds);

module.exports = router;
