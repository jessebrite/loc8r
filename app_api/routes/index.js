const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlAuth = require('../controllers/authentication');

// locations
router
  .get('/locations', ctrlLocations.locationsListByDistance)
  .post('/locations', ctrlLocations.locationsCreate)
  .get('/locations/:locationid', ctrlLocations.locationsReadOne)
  .put('/locations/:locationid', ctrlLocations.locationsUpdateOne)
  .delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// review
router
  .route('/locations/:locationid/reviews')
  .post(auth, ctrlReviews.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(auth, ctrlReviews.reviewsUpdateOne)
  .delete(auth, ctrlReviews.reviewsDeleteOne);

// auth
router
  .post('/register', ctrlAuth.register)
  .post('/login', ctrlAuth.login);

module.exports = router;