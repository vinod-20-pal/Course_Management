const mongoose = require('mongoose');
const Connect = mongoose.connect('mongodb://localhost:27017/loginform',
{ useNewUrlparser : true,
useUnifiedTopology : true,}).then(() => {
    console.log("connection sucessfully connected");
}).catch((err) => { console.log(err)});

module.exports = Connect;
