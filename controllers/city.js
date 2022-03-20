////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
require('dotenv').config()
const express = require('express')
const City = require('../models/trip')
const axios = require('axios')


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Router Middleware
////////////////////////////////////////////
// create some middleware to protect these routes
// Authorization middleware
router.use((req, res, next) => {
	// checking the loggedin boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/user/login')
	}
})

////////////////////////////////////////////
// Routes
////////////////////////////////////////////

const key = process.env.apikey

//get weather

const getWeather = async (id) => {
	const base = 'http://dataservice.accuweather.com/forecasts/v1/daily/15day/'
	const query = `${id}?apikey=${key}`;
    const data = data
	return await axios.get(base + query + data);
	return (data);

	
	
};
//get city
const getCity = async (city) => {
    const base = 'http://dataservice.accuweather.com/locations/v1/cities/search'
    const query = `?apikey=${key}&q=${city}`;
    const data =  data;
    return await axios.get(base + query + data);
    
	


  
};
// index city weather 
router.get('/', async (req, res) => {
	Promise.all(getCity('349727'))
	.then(data => {
		return getWeather(data.Key);
	}) .then(data)
        console.log(data) 
		res.render('trips/cities')
   
	})

module.exports = router


 // // find the fruits
	// City.find({})
	// 	// then render a template AFTER they're found
	// 	.then((cities) => {
	// 		const username = req.session.username
	// 		const loggedIn = req.session.loggedIn
	// 		// console.log(fruits)
	// 		res.render('cities/index', { cities, username, loggedIn })
    //         console.log(data);
    //     })
	// 	// show an error if there is one
	// 	.catch((error) => {
	// 		console.log(error)
	// 		res.json({ error })
	// 	})