///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Trip = require('./trip')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {
	// array of starter fruits
	const startTrips = [
		{ name: 'New Years 2019', city: 'New York', recommend: false },
		{ name: 'Summer 2018', city: 'France', recommend: false },
		{ name: 'First trip to Aruba', city: 'Aruba', recommend: false },
		{ name: 'Last Year', city: 'Texas', recommend: false},
		{ name: 'new years 2020', city: 'New York', recommend: false },
	]

	// when we seed data, there are a few steps involved
	// delete all the data that already exists(will only happen if data exists)
	Trip.remove({})
        .then(deletedTrips => {
		    console.log('this is what remove returns', deletedTrips)
		    // then we create with our seed data
            Trip.create(startTrips)
                .then((data) => {
                    console.log('Here are the new seed fruits', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        .catch(error => {
            console.log(error)
            db.close()
        })
	// then we can send if we want to see that data
})