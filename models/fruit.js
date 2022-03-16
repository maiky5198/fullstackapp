/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

// we also need to import our commentSchema
const commentSchema = require('./comment')

// we'll import our user model so we can populate the info
const User = require('./user')

/////////////////////////////////
// define our fruits model
/////////////////////////////////
// pull the schema and model constructors from mongoose
// we're going to use something called destructuring to accomplish this
const { Schema, model } = mongoose

// make our fruits schema
const fruitSchema = new Schema({
    name: { type: String },
    color: { type: String },
    readyToEat: { type: Boolean },
    // instead of username, we're going to use a reference
    // username: { type: String }
    owner: {
        // references the type 'objectId'
        type: Schema.Types.ObjectID,
        // references the model: 'User'
        ref: 'User'
        // now that we have an owner field, let's look and replace references to the username in our fruit controllers
    },
    comments: [commentSchema]
}, { timestamps: true })

// make our fruit model
const Fruit = model("Fruit", fruitSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Fruit