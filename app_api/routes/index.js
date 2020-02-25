const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

// locations
router
  .get('/locations', ctrlLocations.locationsListByDistance)
  .post('/locations', ctrlLocations.locationsCreate)
  .get('/locations/:locationid', ctrlLocations.locationsReadOne)
  .put('/locations/:locationid', ctrlLocations.locationsUpdateOne)
  .delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// review
router
  .post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate)
  .get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne)
  .put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne)
  .delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

module.exports = router;