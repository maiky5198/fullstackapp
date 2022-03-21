////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const Trip = require('../models/trip')


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

// index ALL fruits route
router.get('/', (req, res) => {
	// find the fruits
	Trip.find({})
		// then render a template AFTER they're found
		.then((trips) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			// console.log(fruits)
			res.render('trips/index', { trips, username, loggedIn })
		})
		// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// index that shows only the user's fruits
router.get('/mine', (req, res) => {
	// find the fruits
	Trip.find({ owner: req.session.userId })
		// then render a template AFTER they're found
		.then((trips) => {
			// console.log(fruits)
			const username = req.session.username
			const loggedIn = req.session.loggedIn

			res.render('trips/index', { trips, username, loggedIn })
		})
		// show an error if there is one
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	res.render('trips/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	// check if the readyToEat property should be true or false
	// we can check AND set this property in one line of code
	// first part sets the property name
	// second is a ternary to set the value
	req.body.recommend = req.body.recommend === 'on' ? true : false
	// console.log('this is the fruit to create', req.body)
	// now we're ready for mongoose to do its thing
	// now that we have user specific fruits, we'll add the username to the fruit created
	// req.body.username = req.session.username
	// instead of a username, we're now using a reference
	// and since we've stored the id of the user in the session object, we can use it to set the owner property of the fruit upon creation.
	req.body.owner = req.session.userId
	Trip.create(req.body)
		.then((trip) => {
			console.log('this was returned from create', trip)
			res.redirect('/trips')
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const tripId = req.params.id
	// find the fruit
	Trip.findById(tripId)
		// -->render if there is a fruit
		.then((trip) => {
			console.log('edit trip', trip)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('trips/edit', { trip, username, loggedIn })
		})
		// -->error if no fruit
		.catch((err) => {
			console.log(err)
			res.json(err)
		})
})

// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
	// get the id
	const tripId = req.params.id
	// check and assign the readyToEat property with the correct value
	req.body.recommend = req.body.recommend === 'on' ? true : false
	// tell mongoose to update the fruit
	Trip.findByIdAndUpdate(tripId, req.body, { new: true })
		// if successful -> redirect to the fruit page
		.then((trip) => {
			console.log('the updated trip', trip)

			res.redirect(`/trips/${trip.id}`)
		})
		// if an error, display that
		.catch((error) => res.json(error))
})

// show route
router.get('/:id', (req, res) => {
	// first, we need to get the id
	const tripId = req.params.id
	// then we can find a fruit by its id
	Trip.findById(tripId)
		.populate('comments.author')
		// once found, we can render a view with the data
		.then((trip) => {
			console.log('the trip we got\n', trip)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId
			res.render('trips/show', { trip, username, loggedIn, userId })
		})
		// if there is an error, show that instead
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

// delete route
router.delete('/:id', (req, res) => {
	// get the fruit id
	const tripId = req.params.id
	// delete the fruit
	Trip.findByIdAndRemove(tripId)
		.then((trip) => {
			console.log('this is the response from FBID', trip)
			res.redirect('/trips')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})
////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router