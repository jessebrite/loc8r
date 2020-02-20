const mongoose = require('mongoose');

// OPENING TIME SCHEMA
const openingTimeSchema = new mongoose.Schema({
	days: { type: String, required: true },
	opening: { type: String, required: false },
	closing: { type: String, required: false },
	closed: { type: Boolean, required: true }
});

// REVIEW SCHEMA
const	reviewSchema = new mongoose.Schema({
	author: { type: String, required: true },
	rating: { type: Number, required:true, min:0, max:5 },
	reviewText: { type: String, required: true },
	createdOn: { type:Date, "default":Date.now }
});

//LOCATION SCHEMA
const	locationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	address: String,
	rating: { type: Number, "default": 0, min: 0, max: 5 },
	facilities: [String],
	coords: { type: [Number], required: true, index: '2dsphere' },
	openingTimes : [openingTimeSchema],
	reviews: [reviewSchema]
});

// DB CREATION
mongoose.model('Location', locationSchema);