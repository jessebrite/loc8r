const mongoose = require('mongoose');
const Loc = mongoose.model('Location');
const theEarth  = ( () => {
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

module.exports.locationsListByDistance = (req, res) => {
	let lng = parseFloat(req.query.lng);
	let lat = parseFloat(req.query.lat);
	let maxDistance = parseFloat(req.query.maxDistance);
	let point = {
		type: "Point",
		coordinates: [lng, lat]
	};

	if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
		sendJsonResponse(res, 404, {"message": "lng and lat query parameters are required"});
		return;
	}
	Loc.aggregate(
		[{
			'$geoNear': {
				'near': {
					type: 'Point',
					coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
				},
				'spherical': true,
				'distanceField': 'dist.calculated',
				'maxDistance': theEarth.getRadsFromDistance(maxDistance)
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
        // console.table(locations);
      }
    });
};

module.exports.locationsCreate = (req, res) => {
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(','),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
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
			console.log('Location creation success');
		}
	});
};

module.exports.locationsReadOne = (req, res) => {
	if (req.params && req.params.locationid) {
		Loc.findById(req.params.locationid).exec( (err, location) => {
			if (!location) {
				sendJsonResponse(res, 404, {'message' : 'Page not found'});
				console.log('Page not found');
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			sendJsonResponse(res, 200, location);
			console.log('GET locations success');
		});
	} else {
		sendJsonResponse(res, 404, {'message' : 'No locationid in request'});
		console.log('No locationid requested');
	}
};

module.exports.locationsUpdateOne = (req, res) => {
	const locationid = req.params.locationid;
	if (req.params && locationid) {
		Loc.findById(locationid).select('-reviews -rating')
			.exec( (err, location) => {
				if (!location) {
					sendJsonResponse(res, 404, {'message': 'location was not found'});
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
					location.name = req.body.name;
					location.address = req.body.address;
					location.facilities = req.body.facilities.trim().split(', ');
					location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
					location.openingTimes = [{
						days: req.body.days1,
						opening: req.body.opening1,
						closing: req.body.closing1,
						closed: req.body.closed1
					},
					{
						days: req.body.days1,
						opening: req.body.opening2,
						closing: req.body.closing2,
						closed: req.body.closed2
					}]
						location.save( (err, location) => {
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
						sendJsonResponse(res, 200, location);
						console.log('Update success');
					}
				});
		});

	} else {
		sendJsonResponse(res, 404, {'message': 'Not found. locationid is required'});
		console.log('locationid not found');
	}
};

module.exports.locationsDeleteOne = (req, res) => {
	const locationid = req.params.locationid;
	if (req.params && locationid) {
		Loc.findByIdAndRemove(locationid).exec( (err, location) => {
			if (err) {
				sendJsonResponse(res, 404, err);
			} else {
				sendJsonResponse(res, 202, null);
				console.log('Deletion success');
			}
		});
	} else {
		sendJsonResponse(res, 404, {'message': 'No locationid'});
	}
};

// json resonse function
const sendJsonResponse = (res, status, content) => {
	res.status(status);
	res.json(content);
}

const buildLocationList = (req, res, results) => {
	let locations = [];
	results.forEach( doc => {
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
