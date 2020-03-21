const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

// Pagination
const paginate = require('jw-paginate');

const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
	const lat = parseFloat(req.query.lat);
	const near = {
		type: "Point",
		coordinates: [lng, lat]
  };

  const geoOptions = {
    distanceField: "distance.calculated",
    key: 'coords',
    spherical: true,
    maxDistance: 200,
    $limit: 10
  };

	if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
		sendJsonResponse(res, 404, {"message": "lng and lat query parameters are required"});
		return;
  }

  try {
    const results = await Loc.aggregate([
      {
        $geoNear: {
          near,
          ...geoOptions
        }
      }
    ]);
    const locations = results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
        distance: `${result.distance.calculated.toFixed(2)}`
      }
    });
  sendJsonResponse(res, 200, locations);
  } catch(err) {
    console.error(err)
  };

  /****************************************
    Pagination starts here
  ***************************************
  */
 // example array of 150 items to be paged
  // const items = [...Array(150).keys()].map(i => ({ id: (i + 1), name: 'Item ' + (i + 1) }));

  // // get page from query params or default to first page
  // const page = parseInt(req.query.page) || 1;

  // // get pager object for specified page
  // const pager = paginate(items.length, page);

  // // get page of items from items array
  // const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

  // // return pager object and current page of items
  // return res.json({ pager, pageOfItems });

  /****************************************
    Pagination ends here
  ***************************************
  */
};

const locationsCreate = (req, res) => {
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(','),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening1,
			closing: req.body.closing1,
			closed: req.body.closed1
		}, {
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2
		}],
	},
	(err, location) => {
		if (err) {
			sendJsonResponse(res, 404, err);
		} else {
			sendJsonResponse(res, 201, location);
			console.log('Location creation success');
		}
	});
};

const locationsReadOne = (req, res) => {
	if (req.params && req.params.locationid) {
    Loc.findById(req.params.locationid)
      .exec( (err, location) => {
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

const locationsUpdateOne = (req, res) => {
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

const locationsDeleteOne = (req, res) => {
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
  res
    .status(status)
	  .json(content);
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

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne,
  buildLocationList
}