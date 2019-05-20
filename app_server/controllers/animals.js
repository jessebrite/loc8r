module.exports.cats = function (req, res) {
	res.render('wild-beast', {title: 'cats channel'});
}

module.exports.birds = function (req, res) {
	res.render('wing-day', {title: 'Birds channel'});
}