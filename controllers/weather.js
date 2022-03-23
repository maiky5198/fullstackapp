/////////////////////////////////
 // import dependencies
 /////////////////////////////////
 // this allows us to load our env variables
 
 const express = require('express')
 const Weather = require('../models/trip')
 require('dotenv').config()
 const fetch = require('node-fetch')



 ////////////////////////////////////////////
 // Create router
 ////////////////////////////////////////////
 const router = express.Router()
 const key = process.env.apikey2

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

 router.get('/', (req, res) => {
     res.render('trips/weathershow')
 })

 router.post('/', (req, res) => {
     const zip = req.body.zip
 	// then we can find a course by its id
     // we can now render a view with the data

         // URL to get the data 
         const requestURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${key}`
         fetch(requestURL)
         .then((apiResponse) => {
                 console.log(`weather data`, zip)
                 return apiResponse.json();
             })
             .then((jsonData) => {
                 console.log(`here is the weather data`, jsonData);
                 const weather = jsonData
                 res.render(`trips/weathershow`, { weather })   
                 })
         // if there is an error
         .catch((error) => {
 			console.log(error)
 			res.json({ error })
 		})
     })

 ////////////////////////////////////////////
 // Export the Router
 ////////////////////////////////////////////
 module.exports = router 