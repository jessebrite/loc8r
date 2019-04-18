/* Get 'home page */
module.exports.homelist = function(req, res) {
	res.render('index', {title: 'Home'});
}

/* Get 'locations' info */
module.exports.locationInfo = function(req, res) {
	res.render('index', {title: 'Location info'});
}

/* Get 'Add review' page*/
module.exports.addReview = function(req, res) {
	res.render('index', {title: 'Add review'})
}