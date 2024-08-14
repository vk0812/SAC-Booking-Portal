const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomModel = new Schema({
    number: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true }
})

module.exports = mongoose.model('Room', roomModel)