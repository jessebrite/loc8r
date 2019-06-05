var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function(req, res) {
	sendJsonResponse(rs, 200, {'message' : 'success'});
};

// Trying to figure out why I can't retrieve reviewid
// This function will be deleted to make way for the commented one
// module.exports.reviewsReadOne = function(req, res) {
// 	Loc.findById(req.params.locationid)
// 		.select('name reviews')
// 		.exec(function(err, location) {
// 			var review;
// 			review = location.reviews.id(req.params.reviewid);
// 			if (!review) {
// 				sendJsonResponse(res, 404, {'message' : 'reviewid not found'});
// 			} else {
// 				sendJsonResponse(res, 200, {'messge' : 'success'});
// 			}
// 		});
// }

module.exports.reviewsReadOne = function(req, res) {
	if (req.params && req.params.locationid && req.params.reviewid) {
		Loc.findById(req.params.locationid)
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
				review = location.reviews.id(req.params.reviewid);
				if (!review) {
					sendJsonResponse(res, 404, {'message' : 'reviewid not found'});
					console.log('reviewid not found');
				} else {
					response = {
						location : {
							name : location.name,
							id : req.params.locationid
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
			sendJsonResponse(res, 404, {'message' : 'Locationid and reviewid are both required'});
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