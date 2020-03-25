const mongoose = require('mongoose');
const Loc = mongoose.model('Location');
const User = mongoose.model('User');

// The getAuthor function retrieves the email user details
const getAuthor = ((req, res, callback) => {
  if (req.payload && req.payload.email) {
    User
       .findOne({email: req.payload.email})
       .exec((err, user) => {
                if (err) {
                  console.log('There was an error', err);
                  sendJsonResponse(res, 404, err);
                } else if (!user) {
                  sendJsonResponse(res, 400, {'message': 'User does not exist'});
                }
                callback(req, res, user.name);
              });
  } else {
    sendJsonResponse(res, 404, {'message': 'User not found'});
  }
});

// The POST method for review
const reviewsCreate = (req, res) => {
  getAuthor(req, res,
    (req, res, userName) => {
      const locationid = req.params.locationid;
      if (req.params && locationid) {
        Loc.findById(locationid)
            .select('reviews')
            .exec((err, location) => {
              if (err) {
                sendJsonResponse(res, 404, err);
                console.log('Wrong locationid')
              } else {
                // Call the doAddReview function
                doAddReview(req, res, location);
              }
            });
      } else {
        sendJsonResponse(res, 404, {"message": "Not found. locationid required"});
      }
    });
};

// The GET method for review
const reviewsReadOne = (req, res) => {
	const locationid = req.params.locationid;
	const reviewid = req.params.reviewid;
	if (req.params && locationid && reviewid) {
		Loc.findById(locationid)
				.select('name reviews').limit(0)
				.exec((err, location) => {
			if (!location) {
				sendJsonResponse(res, 404, {'message' : 'Page not found'});
				console.log('Page not found error');
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (location.reviews && location.reviews.length > 0) {
				const review = location.reviews.id(reviewid);
				if (!review) {
          console.log('reviewid not found');
					sendJsonResponse(res, 404, {'message' : 'reviewid not found'});
				} else {
					response = {
						location: {
							name: location.name,
							id: locationid
						},
						review: review
					};
					sendJsonResponse(res, 200, response);
					console.log('Page success');
				}
			} else {
				sendJsonResponse(res, 404, {'message' : 'No review found'});
				console.log('Review page not found');
			}
		});
	} else {
			sendJsonResponse(res, 404, {'message' : 'locationid and reviewid are both required'});
			console.log('No locationid requested');
	}
};

// The UPDATE method for review
const reviewsUpdateOne = (req, res) => {
	const locationid = req.params.locationid,
				reviewid = req.params.reviewid;
	if (req.params && locationid && reviewid) {
		Loc.findById(locationid).select('reviews')
				.exec((err, location) => {
					let thisReview = null;
					if (!location) {
						sendJsonResponse(res, 404, {'message': 'No locationid found'});
					} else if (err) {
						sendJsonResponse(res, 400, err);
					}
					const	reviews = location.reviews;
					if (reviews && reviews.length > 0) {
						thisReview = reviews.id(reviewid);
						if (!thisReview) {
							sendJsonResponse(res, 404, {'message': 'No reviewid found'});
						} else if (err) {
							sendJsonResponse(res, 400, err);
						} else {
							thisReview.author = req.body.author;
							thisReview.rating = req.body.rating;
							thisReview.reviewText = req.body.reviewText;
							location.save((err, location) => {
								if (err) {
									sendJsonResponse(res, 404, err);
								} else {
                  updateAverageRating(location._id);
                  console.log('Review update success');
									sendJsonResponse(res, 200, thisReview);
								}
							});
						}
					} else {
						sendJsonResponse(res, 404, {'message': 'No review to update'});
					}
				});
	} else {
		sendJsonResponse(res, 404, err);
		console.log('location and reviewid are both required');
	}
};


// the DELETE method for review
const reviewsDeleteOne = function(req, res) {
	const locationid = req.params.locationid,
				reviewid = req.params.reviewid;
	if (req.params && locationid && reviewid) {
		Loc.findById(locationid).select('reviews')
				.exec( (err, location) => {
					if (!location) {
						sendJsonResponse(res, 404, {'message': 'No location found'});
						return;
					} else if (err) {
						sendJsonResponse(res, 404, err);
					}
					const reviews = location.reviews,
						thisReview = reviews.id(reviewid);
					if (reviews && reviews.length > 0) {
						if (!thisReview) {
							sendJsonResponse(res, 404, {'message': 'No reviewid found'});
						} else {
							location.reviews.id(reviewid).remove();
							location.save(err => {
								if (err) {
									sendJsonResponse(res, 404, err);
								} else {
									updateAverageRating(location._id);
									sendJsonResponse(res, 202, null);
									console.log('Deletion success');
								}
							})
						}
					} else {
							sendJsonResponse(res, 404, {'message': 'locationid and reviewid required'});
					}
				});
	} else {
		sendJsonResponse(res, 404, {'message': 'Deletion failed'});
	}
};

// json response function
const sendJsonResponse = (res, status, content) => {
	res.status(status);
	res.json(content);
}

const doAddReview = (req, res, location, author) => {
	if (!location) { // thow a 404 error if location isn't found
		sendJsonResponse(res, 404, {"message": "locationid not found"});
	} else { // Add reviews
			location.reviews.push({
				author: req.body.author,
				rating: req.body.rating,
				reviewText: req.body.reviewText
		});
		// Persist the location
		location.save((err, location) => {
			let thisReview = null;
			if (err) {
				sendJsonResponse(res, 400, err);
				console.log('Error found')
			} else {
				// Call the updateAverageRating function
				updateAverageRating(location._id);
				// Capture the last review into thisReview
				thisReview = location.reviews[location.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
				console.log('Insert success');
			}
		});
	}
}

// Updates the rating
const updateAverageRating = locationid => {
	Loc.findById(locationid)
			.select('rating reviews')
			.exec((err, location) => {
				if (err) {
					sendJsonResponse(res, 404, err)
				} else {
					// Call the doSetAverageRating function
					doSetAverageRating(location);
				}
			});
}

// Calculates the average rating
const doSetAverageRating = (location) => {
	let  reviewCount = ratingAverage = ratingTotal = 0;
	const reviews = location.reviews;
	if (reviews && reviews.length > 0) {
		reviewCount = reviews.length;
		for (let i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save( err => {
			if (err) {
				console.log(err);
			} else {
				console.log("Average rating updated to", ratingAverage);
			}
		});
	}
}

module.exports = {
  reviewsReadOne,
  reviewsCreate,
  reviewsDeleteOne,
  reviewsUpdateOne,
};