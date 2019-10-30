const mongoose = require('mongoose'); //require mongoose package
const Schema = mongoose.Schema; //mongoose has many properties on it.  One is a constructor function for Schemas

const blogSchema = new Schema({
	title:  { type: String, required: true, unique: true }, //can say whether we want properties to be required or unique
	author: { type: String, required: true },
	body:   String,
	publishDate: { type: Date, default: Date.now }, // can set defaults for properties
});

//Creating an Article class -- will be stored in 'articles' collection.  Mongo does this for you automatically
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
