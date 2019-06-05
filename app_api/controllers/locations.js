const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.locationsListByDistance = function(req, res) {
	sendJsonResponse(res, 200, {'status' : 'success'});
};

module.exports.locationsCreate = function(req, res) {
	sendJsonResponse(res, 200, {'status' : 'success',});
};

module.exports.locationsReadOne = function(req, res) {
	sendJsonResponse(res, 200, {'message' : 'found'});
}

module.exports.locationsReadOne = function(req, res) {
	if (req.params && req.params.locationid) {
		Loc.findById(req.params.locationid).exec(function(err, location) {
			if (!location) {
				sendJsonResponse(res, 404, {'message' : 'Page not found'});
				console.log('Page not found error');
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			sendJsonResponse(res, 200, location);
			console.log('Locations success');		
		});
	} else {
		sendJsonResponse(res, 404, {'message' : 'No locationid in request'});
		console.log('No locationid requested');
	}
};

module.exports.locationsUpdateOne = function(req, res) {
	sendJsonResponse(res, 200, {'status' : 'success'});	
};
module.exports.locationsDeleteOne = function(req, res) {
	sendJsonResponse(res, 200, {'status' : 'success'});	
};

// json resonse function
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}