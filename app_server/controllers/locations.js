/* Get 'home page */
module.exports.homelist = function(req, res) {
	res.render('locations-list', {
	  title: 'Loc8r - find a place to work with wifi',
	  pageHeader: {
	  	title: 'Loc8r',
	  	strapline: 'Find places to work with near you!'
	  }
	  ,
	  locations: [{
	  	name: 'Starcups',
	  	address: '125 High Street, Reading, RG6 1PS',
	  	rating: 3,
	  	facilities: ['Hot drinks', 'Food', 'Premium wifi'],
	  	distance: '100m'
	  },{
	  	name: 'Hot Coffee',
	  	address: '45 South Central, Los Angeles, California',
	  	rating: 3,
	  	facilities: ['Coffee', 'Barbeque', '4G wifi'],
	  	coords: {lat: 51.455041, lng: -0.9690884},
	  	openingTimes: [{
	  		days: 'Monday - Friday',
	  		opening: '7:00am',
	  		closing: '7:00pm',
	  		closed: false
	  	},{
	  		days: 'Saturday',
	  		opening: '8:00am',
	  		closing: '5:00pm',
	  		closed: false
	  	},{
	  		days: 'Sunday',
	  		closed: true
	  	}],
	  	distance: '150m'
	  },{
	  	name: 'Starbucks',
	  	address: 'PMB Osu, Accra ',
	  	rating: 3,
	  	facilities: ['Fresh juice', 'Hot dogs'],
	  	distance: '100m'
	  }],
	  reviews: [{
	  	author: 'Simon Holmes',
	  	rating: 5,
	  	timestamp: '16 July 2019',
	  	reviewText: 'What a great place. I can\'t say enough good things about it.'
	  },{
		author: 'Charlie Chaplin',
		rating: 3,
		timestamp: '16 June 2013',
		reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
	  }]
	});
}

/* Get 'locations' info */
module.exports.locationInfo = function(req, res) {
	res.render('locations-info', {title: 'Location Info'});
}

/* Get 'Add review' page*/
module.exports.addReview = function(req, res) {
	res.render('location-review-form', {title: 'Add review'})
}
