const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsListByDistance = async (req, res) => {
  // The pagination
  const data = req.query.pageNo;
  const pageNo = (typeof data === 'undefined' || data < 1) ? 1 : parseInt(data);
  let query = {};
  const total = 10;
  query.skip = (total * pageNo) - total;
  query.limit = total;

  // coordinates
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const near = {
    type: 'Point',
    coordinates: [lng, lat]
  };

  const geoOptions = {
    distanceField: 'distance.calculated',
    key: 'coords',
    spherical: true,
    maxDistance: 200,
    $limit: 10
  };

  if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
    sendJsonResponse(res, 404, {
      message: 'lng and lat query parameters are required'
    });
    return;
  }

  try {
    // retrieving data for pagination
    const totalCount = await Users.countDocuments();
    const pageTotal = Math.ceil(totalCount / total);
    const users = await Users.find({}, {}, query);


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
      };
    });
    sendJsonResponse(res, 200, locations);
  } catch (err) {
    console.error(err);
    return sendJsonResponse(res, 404, err);
  }
};

const locationsCreate = (req, res) => {
  const {
    name,
    address,
    facilities,
    lng,
    lat,
    days1,
    opening1,
    closing1,
    closed1,
    days2,
    opening2,
    closing2,
    closed2
  } = req.body;
  Loc.create(
    {
      name: name,
      address: address,
      facilities: facilities.split(','), // Facilites should always have values for Postman feedback
      coords: [parseFloat(lng), parseFloat(lat)],
      openingTimes: [
        {
          days: days1,
          opening: opening1,
          closing: closing1,
          closed: closed1
        },
        {
          days: days2,
          opening: opening2,
          closing: closing2,
          closed: closed2
        }
      ]
    },
    (err, location) => {
      if (err) {
        return sendJsonResponse(res, 404, err);
      } else if (!location) {
        return sendJsonResponse(res, 201, {
          message: 'Error creating location'
        });
      }
      console.log('Location creation success');
      return sendJsonResponse(res, 201, location);
    }
  );
};

const locationsReadOne = (req, res) => {
  const locationid = req.params.locationid;
  if (req.params && locationid) {
    Loc.findById(locationid).exec((err, location) => {
      if (!location) {
        sendJsonResponse(res, 404, { message: 'Page not found' });
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
    sendJsonResponse(res, 404, { message: 'No locationid in request' });
    console.log('No locationid requested');
  }
};

const locationsUpdateOne = async (req, res) => {
  const locationid = req.params.locationid;
  const {
    name,
    address,
    facilities,
    lng,
    lat,
    days1,
    opening1,
    closing1,
    closed1,
    days2,
    opening2,
    closing2,
    closed2
  } = req.body;
  const queryText = {
    name,
    address,
    coords: [parseFloat(lng), parseFloat(lat)],
    facilities: facilities.split(','),
    openingTimes: [
      {
        days: days1,
        opening: opening1,
        closing: closing1,
        closed: closed1
      },
      {
        days: days2,
        opening: opening2,
        closing: closing2,
        closed: closed2
      }
    ]
  };
  try {
    const locUpdate = await Loc.findByIdAndUpdate(locationid, queryText);
    if (locUpdate !== null) {
      console.log('E source');
      return sendJsonResponse(res, 200, locUpdate);
    }
    console.log('Update yawa!');
    return sendJsonResponse(res, 404, { message: 'Location ID not found' });
  } catch (error) {
    console.log(error);
    sendJsonResponse(res, 404, error);
  }
};

const locationsDeleteOne = (req, res) => {
  const locationid = req.params.locationid;
  if (req.params && locationid) {
    Loc.findByIdAndRemove(locationid).exec((err, location) => {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 200, null);
        console.log('Deletion success');
      }
    });
  } else {
    sendJsonResponse(res, 404, { message: 'No locationid' });
  }
};

// json resonse function
const sendJsonResponse = (res, status, content) => {
  res.status(status).json(content);
};

const buildLocationList = (req, res, results) => {
  let locations = [];
  results.forEach(doc => {
    locations.push({
      distance: doc.dist.calculated,
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      _id: doc._id
    });
  });
  return locations;
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne,
  buildLocationList
};
