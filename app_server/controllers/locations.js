const request = require('request');
// Set default server for the URL
const apiOptions = { server: 'http://localhost:3000' }
// If in a production environment, use the live-hosted URL
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = 'https://boiling-stream-84042.herokuapp.com';
}

/* Get 'home page' */
const renderHomepage = (req, res, responseBody) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }

	res.render('locations-list', {
	  title: 'Loc8r - find a place to work with wifi',
	  pageHeader: {
	  	title: 'Loc8r',
	  	strapline: 'Find places to work with near you!'
	  },
	  sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about."
           + " Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
          locations: responseBody,
          message: message
	});
}


const homelist = (req, res) => {
	const path = '/api/locations';
	const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'GET',
		json: {},
		qs: {
      // The coordinates
      lng: 0.01768181,
      lat: 5.72360790,
      // Uncomment to add the maximum vicinity/catchment area
			maxDistance: 200
		}
  };

  request(
          requestOptions,
          (err, {statusCode}, body) => {
            let data = [];
            if (statusCode === 200 && body.length) {
              data = body.map( item => {
                item.distance = formatDistance(item.distance);
                return item;
              });
            }
            renderHomepage(req, res, data);
          }
        );
}

const renderDetailsPage = (req, res, locDetail) => {
	res.render('locations-info', {
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your' +
			' laptop and get some work done.',
			callToAction: 'If you\'ve been and you like' +
			' it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location: locDetail
	});
}


/* Get 'locations info' page */
const locationInfo = (req, res) => {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };

	getLocationInfo(req, res, (req, res, responseData) => {
		renderDetailsPage(req, res, responseData);
  });
};

/* Get 'Add review' page*/
const addReview = (req, res) => {
	getLocationInfo(req, res, (req, res, responseData) => {
		renderReviewForm(req, res, responseData);
	});
}

const doAddReview = (req, res) => {
	const locationid = req.params.locationid;
  const	path = `/api/locations/${locationid}/reviews`;
	const postData = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	}

	const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'POST',
		json: postData
	};

	if (!postData.author || !postData.rating || !postData.reviewText) {
		res.redirect(`/locations/${locationid}/review/new?err=val`);
	} else {
			request(requestOptions, (err, {statusCode}, {name}) => {
				if (err) {
					console.log(err)
				} else if (statusCode === 400 && name && name === 'ValidationError') {
					res.redirect(`/locations/${locationid}/review/new?err=val`);
				} else if (statusCode !== 201) {
					showError(req, res, statusCode);
					console.log(statusCode);
				} else {
					res.redirect(`/locations/${locationid}`);
					console.log('Review addition success');
					console.log(`Location success: status code ${statusCode}`);
				}
			});
	}
}

const getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationid}`;
	const requestOptions = {
    url : `${apiOptions.server}${path}`,
		method: 'GET',
		json: {}
	};

	request(requestOptions, (err, {statusCode}, body) => {
		let data = body;
		if (err) {
			console.log(err)
		} else if (statusCode !== 200) {
			showError(req, res, statusCode);
			console.log(statusCode);
		} else {
			data.coords = {
				lng: body.coords[0],
				lat: body.coords[1]
			}
			callback(req, res, data);
			// console.log(data);
			console.log(`Location success: status code ${statusCode}`);
		}
  });
};

const renderReviewForm = (req, res, {name}) => {
	res.render('location-review-form', {
		title: `Review ${name} on Loc8r`,
		pageHeader: {title: `Review ${name}`},
		error: req.query.err
	});
}

const formatDistance = (distance) => {
  let thisDistance = 0;
  let unit = 'm';
  if (distance > 1000) {
    thisDistance = parseFloat(distance / 1000).toFixed(1);
    unit = 'km';
  } else {
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
}


const showError = (req, res, status) => {
  let title, content;
	if (status === 404) {
		title = status + ': page not found';
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-view', {
		title: title,
		content: content
	});
}


module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};
