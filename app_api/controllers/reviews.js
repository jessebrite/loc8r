var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function(req, res) {
	var locationid = req.params.locationid;
	if (req.params && locationid) {
		Loc.findById(locationid)
				.select('reviews')
				.exec(function(err, location) {
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
						// Call the doAddReview function
						doAddReview(req, res, location);
					}
				});
	} else {
		sendJsonResponse(res, 404, {"message": "Not found. locationid required"});
	}
};

module.exports.reviewsReadOne = function(req, res) {
	var locationid = req.params.locationid;
	var reviewid = req.params.reviewid;
	if (req.params && locationid && reviewid) {
		Loc.findById(locationid)
				.select('name reviews')
				.exec(function(err, location) {
					var response, review;
			if (!location) {
				sendJsonResponse(res, 404, {'message' : 'Page not found'});
				console.log('Page not found error');
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			if (location.reviews && location.reviews.length > 0) {
				review = location.reviews.id(reviewid);
				if (!review) {
					sendJsonResponse(res, 404, {'message' : 'reviewid not found'});
					console.log('reviewid not found');
				} else {
					response = {
						location : {
							name : location.name,
							id : locationid
						},
						review : review
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

module.exports.reviewsUpdateOne = function(req, res) {
	const locationid = req.params.locationid,
				reviewid = req.params.reviewid;
	if (req.params && locationid && reviewid) {
		Loc.findById(locationid).select('reviews')
				.exec(function(err, location) {
					var thisReview;
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
							location.save(function(err, location) {
								if (err) {
									sendJsonResponse(res, 404, err);
								} else {
									updateAverageRating(location._id);
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

module.exports.reviewsDeleteOne = function(req, res) {
	sendJsonResponse(res, 200, {'status' : 'success'});
};

// json resonse function
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}

var doAddReview = function(req, res, location) {
	if (!location) {
		sendJsonResponse(res, 404, {"message": "locationid not found"});
	} else {
			location.reviews.push({
				author: req.body.author,
				rating: req.body.rating,
				reviewText: req.body.reviewText
		});
		location.save(function(err, location) {
			var thisReview;
			if (err) {
				sendJsonResponse(res, 404, err);
			} else {
				// Call the updateAverageRating function
				updateAverageRating(location.id);
				thisReview = location.reviews[location.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
				console.log('Isert success');
				console.log(thisReview);
			}
		});
	}
}

// Updates the rating
var updateAverageRating = function(locationid) {
	Loc.findById(locationid)
			.select('rating reviews')
			.exec(function(err, location) {
				if (err) {
					sendJsonResponse(res, 404, err)
				} else {
					// Call the doSetAverageRating function
					doSetAverageRating(location);
				}
			});
}

// Calculates the average rating
var doSetAverageRating = function(location) {
	var i, reviewCount, ratingAverage, ratingTotal = 0;
	var reviews = location.reviews;
	if (reviews && reviews.length > 0) {
		reviewCount = reviews.length;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Average rating updated to", ratingAverage);
			}
		});
	}
}