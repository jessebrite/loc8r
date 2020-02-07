/* Get 'about' page */
const about = (req, res) => {
	res.render('generic-view', { title : 'About' });
}

/* Get 'contact us' page */
const contact = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
}

module.exports = {
  about,
  contact,
}