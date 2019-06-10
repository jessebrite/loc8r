const mongoose = require('mongoose');
const Loc = mongoose.model('Location');
const theEarth  = (function() {
	const earthRadius = 6371; // km, miles is 3959

	const getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius)
	};
	const getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius)
	};
	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance
	};
}) ();

module.exports.locationsListByDistance = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = parseFloat(req.query.maxDistance);
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = { 
		spherical: true,
		maxDistance: theEarth.getRadsFromDistance(20),
		num: 10
	};
	if (!lng || !lat) {
		sendJsonResponse(res, 404, {"message": "lng and lat query parameters are required"});
		return;
	}
	Loc.aggregate(
		[{
			'$geoNear': {
				'near': point,
				'spherical': true,
				'distanceField': 'dist.calculated',
				'maxDistance': maxDistance
			}
		}],
		function(err, results) {
      if (err) {
        sendJsonResponse(res, 404, err);
        console.log('Request not found');
      } else {
        locations = buildLocationList(req, res, results);
        sendJsonResponse(res, 200, locations);
        console.log('Results success');
        console.table(locations);
      }
    }
	)			
}

module.exports.locationsCreate = function(req, res) {
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(','),
		coord: [parseFloat(req.body.lng), (req.body.lat)],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2
		}, {
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2
		}],
	},
	function(err, location) {
		if (err) {
			sendJsonResponse(res, 404, err);
		} else {
			sendJsonResponse(res, 201, location);
		}	
	});
};

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
			// console.log(location);	
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

var buildLocationList = function(req, res, results) {
	var locations = [];
	results.forEach(function(doc) {
		locations.push({
			distance: doc.dist.calculated,
			name: doc.name,
			address: doc.address,
			rating: doc.rating,
			facilities: doc.facilities,
			_id: doc._id
		})
	});
	return locations;
}