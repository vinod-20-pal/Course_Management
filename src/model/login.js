const mongoose = require('mongoose');

const login = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
})

const Login = new mongoose.model("login",login);
module.exports = Login;