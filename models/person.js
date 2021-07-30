require('dotenv').config()
const mongoose = require('mongoose')
uniqueValidator = require('mongoose-unique-validator');

let url = process.env.MONGODB_URI

console.log('connecting to', url)

url = url.replace(`<wrongpassword>`, process.env.PASSWORD)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    required: true,
    unique: true
  },
  number: {
    type: String
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema)