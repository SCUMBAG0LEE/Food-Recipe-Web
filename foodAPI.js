const { response } = require("express");

// THIS FILE IS FOR API ENDPOINT/RENDER FOOD-CARD
// THIS FUNCTION IS SIMILAR TO MILSON's FOOD-CARD RENDER
// U CAN COPY THIS CODE OR YOU CAN JUST CALL THIS FILE FROM script.js

function fetchMenuFromMongoDB() {
    fetch("/api/food-menu")
    .then(response => response.json())
    .then(data => {
        // render food from Mongo
        render_cards(data);
    })
    .catch(error => console.error('Failed to fetching data from MongoDB', error));
};