const mongoose = require('mongoose');

const course = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    topics: {
        type: [String],
        require: true
    },
    duration: {
        type: Number
    },
    category: {
        type: String,
        require: true
    },
    flag: {
        type: Boolean,
        require: true
    }

});

 const Course = new mongoose.model("course", course);
 module.exports = Course;
