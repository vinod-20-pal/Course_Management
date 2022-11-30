const express = require('express');
const app = express();
const mongooes = require('mongoose');
const Login = require('./src/model/login');
const Register = require('./src/model/register');
const Course = require('./src/model/courses');
const Connect = require('./src/db/connect');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const port = 3000;

app.use(express.json());
app.use(cookieparser());
let userDetails;
 // register by any user

//  const createToken = async() => {
//     const token = await jwt.sign({_id:"210399"}, "mynameisinodpaliamsoftwareengineer",{
//         expiresIn:"2 minutes" 
//     });
//     console.log(token);
//     const userVer = await jwt.verify(token,"mynameisinodpaliamsoftwareengineer");
//     console.log(userVer);
//  }

//  createToken();
const middleware = (req,res,next) => {
    console.log("Hello I am middleware");
    if(req.originalUrl.includes("approvecourse") && this.userDetails.role == "super admin") {
        next();
    } else if(req.originalUrl.includes("getcoursedata") && this.userDetails.role == 'employee') {
        next();
    } 
    else {
        res.status(400).send("Please generate cookie");
    }
}

app.post('/register', async(req,res) => {
    try{
        const Name = req.body.name;
        const Email = req.body.email;
        const Password = req.body.password;
        const Cpassword = req.body.cpassword;
        const Role = req.body.role;
        if(Password==Cpassword){
        const register = new Register({
            name: Name,
            email: Email,
            password: Password,
            cpassword: Cpassword,
            role: Role 
        });
        const token = await register.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly:true
        });
        console.log(cookie);
        const result = await register.save();
        res.status(201).send("sucess");
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

// login by any user
app.post('/login', async(req,res) => {
    try {
        const Email = req.body.email;
        const Password = req.body.password;
        const Role = req.body.role;
        const userDetail = await Register.findOne({email:Email});
        if(Password == userDetail.password) {
            const token = await userDetail.generateAuthToken();
            console.log(token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly:true
            });
            this.userDetails = userDetail;
            res.status(201).send(userDetail);
        } else{
            res.send("Password are not matching");
        }
    } catch(err) {
        res.status(400).send("invalid email");
    }
});

app.post('/logout',(req,res) => {
    try{
        this.userDetails  = null;
        res.status(200).send("sucess");
    } catch(err) {
        res.status(400).send(err);
    }
});
// create course only by admin user
app.post('/createcourse', middleware, async(req,res) => {
    try {
        const Title = req.body.title;
        const Description = req.body.description;
        const Url = req.body.url;
        const Topics = req.body.topics;
        const Duration = req.body.duration;
        const Category = req.body.category;
        const Flag = req.body.flag;
        const courses = new Course({
            title: Title,
            description: Description,
            url: Url,
            topics: Topics,
            duration: Duration,
            category: Category,
            flag: Flag 
        });
        if(this.userDetails){
            const result = await courses.save();
            console.log(result);
            res.status(201).send("sucess");
        } else {
            res.status(400).send('Please generate cookie');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

// update course by admin user
app.patch('/updatecourse/:id', middleware, async(req,res) => {
    try {
        const _id = req.params.id;
        const updateData = await Course.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        if(this.userDetails) {
            res.status(200).send(updateData);   
        } else {
            res.status(400).send('Please generate cookie');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

// delete course by admin user
app.delete('/deletecourse/:id', middleware, async(req,res) => {
    try {
        const _id = req.params.id;
        console.log(_id);
        const deleteData = await Course.findByIdAndDelete(_id);
        console.log(deleteData);
        if(!_id){
            return res.status(400).send();
        }
        if(this.userDetails){
            res.send(deleteData);
        } else {
            res.status(400).send('Please generate cookie');
        }
    } catch(err) {
        res.status(500).send(err);
    }
});

// course approve by Super admin
app.patch('/approvecourse/:id', middleware, async(req,res) => {
    try {
        console.log(`${req.cookies.jwt}`);
        const _id = req.params.id;
        const approveCourse = await Course.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        if(this.userDetails){
            res.status(200).send(approveCourse);
        } else {
            res.status(400).send('Please generate cookie');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

app.get('/getcoursedata', middleware, async(req,res) => {
    try {
        const getCourseData = await Course.find().sort({"title":1});
        const newArray = getCourseData.filter((data) => {
            if(data.flag){
                return data;
            }
        });
        if(this.userDetails){
            res.status(200).send(newArray);
        } else {
            res.status(400).send('Please generate cookie');
        }
    } catch(err) {
        res.status(400).send();
    }
});

app.listen(port, (res,err) => {
    console.log(`Server is running at port no ${port}`);
});
