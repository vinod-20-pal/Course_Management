const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const register = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    cpassword: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    tokens: [{
        token:{
            type: String,
            require: true
        }
    }]

});

register.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);
        const token = await jwt.sign({_id: this._id.toString()}, "mynameisinodpaliamsoftwareengineer",{
            expiresIn:"2 minutes" 
        });
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch(error){
        res.send("the error part" + error);
        console.log(error);
    }
}

const Register = new mongoose.model("register",register);
const createDocument = async () => {
    try {
        const reg = new Register({
            name:"abc",
            email:"abc@gmail.com",
            password: "singh",
            cpassword: "singh",
            role:"abc"
        });
        const result = await reg.save();
        console.log(result);
    } catch(err) {
        console.log(err);
    }

}
// createDocument();
module.exports = Register;