var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function(req, res) {
	var locationid = req.params.locationid;
	if (locationid) {
		Loc.findById(locationid)
				.select('reviews')
				.exec(function(err, location) {
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
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
	sendJsonResponse(res, 200, {'status' : 'success'});
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
				updateAverageRating(location.id);
				thisReview = location.reviews[location.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
				console.log('Isert success');
				console.log(thisReview);
			}
		});
	}
}

var updateAverageRating = function(locationid) {
	Loc.findById(locationid)
			.select('rating reviews')
			.exec(function(err, location) {
				if (err) {
					sendJsonResponse(res, 404, err)
				} else {
					doSetAverageRating(location);
				}
			});
}

var doSetAverageRating = function(location) {
	var i, reviewCount, ratingAverage, ratingTotal;
	if (location.reviews && location.reviews.length > 1) {
		reviewCount = location.reviews.length;
		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + location.reviews[i].rating;
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