const request = require('request');
// Set default server for the URL
var apiOptions = { server: "http://localhost:3000" }
// If in a production environment, use the live-hosted URL
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://boiling-stream-84042.herokuapp.com/";
}

var requestOptions, path;

/* Get 'home page */
var renderHomePage = function(req, res, responseBody) {
	var message;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else if (!responseBody.length) {
			message = "No places found nearby";
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

module.exports.homelist = function(req, res) {
	path = '/api/locations';
	requestOptions = {
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
	request(requestOptions, function(err, response, body) {
		var i, data = body;
		// Only loop if the status code is 200 and there is data 
		if (response.statusCode === 200 && data.length) {
			for (i = 0; i < data.length; i++) {
				data[i].distance = _formatDistance(data[i].distance);
			}
		}
		// Trap every possible error
		if (err) {
			console.log(err)
		} else if (response.statusCode !== 200) {
				console.log(response.statusCode);
		}

			// console.log(body)
			renderHomePage(req, res, data);
	});
}

var renderDetailsPage = function(req, res, locDetail) {
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
module.exports.locationInfo = function(req, res) {
	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailsPage(req, res, responseData);
	});
}

/* Get 'Add review' page*/
module.exports.addReview = function(req, res) {
	getLocationInfo(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
}

module.exports.doAddReview = function(req, res) {
	var locationid = req.params.locationid;
	path = '/api/locations/' + locationid + '/reviews';
	var postData = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	}

	requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: postData
	};
	
	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log(err)
		} else if (response.statusCode !== 201) {
			_showError(req, res, response.statusCode);
			console.log(response.statusCode);
		} else {
			res.redirect('/location/' + locationid);
			console.log('Review addition success');
			console.log('Location success: status code ' + response.statusCode);
		}
	});

}

var getLocationInfo = function(req, res, callback) {
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	};
	
	request(requestOptions, function(err, response, body) {
		var data = body;
		if (err) {
			console.log(err)
		} else if (response.statusCode !== 200) {
			_showError(req, res, response.statusCode);
			console.log(response.statusCode);
		} else {
			data.coords = {
				lng: body.coords[0],
				lat: body.coords[1]
			}
			callback(req, res, data);
			// console.log(data);
			console.log('Location success: status code ' + response.statusCode);
		}
	});
}

var renderReviewForm = function(req, res, locDetail) {
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Loc8r',
		pageHeader: {title: 'Review ' + locDetail.name}
	});
}

var _formatDistance = function(distance) {
	var numDistance, unit;
	// If distance is found and is a number, go ahead and parse it
	if (distance && typeof(distance) == 'number') {
		if (distance > 1) {
			numDistance = parseFloat(distance).toFixed(1);
			unit = 'km';
		} else {
			numDistance = parseInt(distance * 1000,00);
			unit = 'm';
		}
		return numDistance + unit;
		// Else, log error to consle
	} else {
		console.log('Disatnce must be a number. ' + distance + ' found');
	}
}

var _showError = function(req, res, status) {
	var title, content;
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