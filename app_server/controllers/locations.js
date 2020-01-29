const request = require('request');
// Set default server for the URL
const apiOptions = { server: "http://localhost:3000" }
// If in a production environment, use the live-hosted URL
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://boiling-stream-84042.herokuapp.com/";
}

/* Get 'home page' */
const renderHomepage = (req, res, responseBody) => {
  let message = '';
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

module.exports.homelist = (req, res) => {
	const path = '/api/locations';
	const requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {
			lng: -0.12445156,
			lat: 41.21529623,
			// maxDistance: 2000
		}
	};
	// Make a request to the given URL
	request(requestOptions, (err, response, body) => {
		const data = body;
		// Only loop if the status code is 200 and there is data
		if (response.statusCode === 200 && data.length) {
			for (let i = 0; i < data.length; i++) {
				data[i].distance = formatDistance(data[i].distance);
			}
		}
		// Trap every possible error
		if (err) {
			console.log(err)
		} else if (response.statusCode !== 200) {
				console.log(response.statusCode);
		}

			// console.log(body)
			renderHomepage(req, res, data);
	});
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

/* Get 'locations' info */
module.exports.locationInfo = (req, res) => {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };

	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailsPage(req, res, responseData);
  });
};

/* Get 'Add review' page*/
module.exports.addReview = (req, res) => {
	getLocationInfo(req, res, (req, res, responseData) => {
		renderReviewForm(req, res, responseData);
	});
}

module.exports.doAddReview = (req, res) => {
	const locationid = req.params.locationid;
  const	path = '/api/locations/' + locationid + '/reviews';
	const postData = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	}

	const requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: postData
	};

	if (!postData.author || !postData.rating || !postData.reviewText) {
		res.redirect('/location/' + locationid + '/review/new?err=val');
	} else {
			request(requestOptions, (err, response, body) => {
				if (err) {
					console.log(err)
				} else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
					res.redirect('/location/' + locationid + '/review/new?err=val');
				} else if (response.statusCode !== 201) {
					showError(req, res, response.statusCode);
					console.log(response.statusCode);
				} else {
					res.redirect('/location/' + locationid);
					console.log('Review addition success');
					console.log('Location success: status code ' + response.statusCode);
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
    // renderHomepage(req, res, body);
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

const renderReviewForm = (req, res, locDetail) => {
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Loc8r',
		pageHeader: {title: 'Review ' + locDetail.name},
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
