/* Get home page */
module.exports.index = (req, res) => {
	res.render('index', {title : 'Express'});
}