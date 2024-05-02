// THIS FILE IS ONLY FOR STORE FOOD LIST from API and STORE IT TO MONGODB

const mongoose = require('mongoose');

//Connect to DB => it's should be done on app.js (need to check again)
mongoose.connect('mongodb://admin:admin@stuff0.3hwe0qo.mongodb.net:27017/', {useNewUrlParser: true, useUnifiedTopology: true});

//Create DB schema
const menuItemSchema = new mongoose.Schema({
    mealId: String,
    mealName: String,
    mealInstructions: String,
    imageUrl: String,
    //add more field based on the DB attribute

});

//Create a model
const menuItem = mongoose.model('menuItem', menuItemSchema);
module.exports = menuItem;


