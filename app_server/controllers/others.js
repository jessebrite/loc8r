/* Get 'about' page */
module.exports.about = (req, res) => {
	res.render('generic-view', { title : 'About' });
}

/* Get 'contact us' page */
module.exports.contact = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
}