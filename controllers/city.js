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

const getCity = async (city) => {
    const base = 'http://dataservice.accuweather.com/locations/v1/cities/search'
    const query = `?apikey=${key}&q=${city}`;

    return await axios.get(base + query);
  
};
// index ALL fruits route
router.get('/', async (req, res) => {
	Promise.resolve(getCity('newyork')).then(city => {
        console.log(city.data[0]) 
        
    })
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
})

module.exports = router