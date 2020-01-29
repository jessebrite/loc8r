/* Get 'about' page */
module.exports.about = (req, res) => {
	res.render('generic-view', { title : 'About' });
}