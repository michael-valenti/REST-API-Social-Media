const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



//REGISTER
router.post("/register", async (req,res)=>{


try{
    //salt and hash password using bcrypt to generate a secure password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    //save the user information
    const user = await newUser.save();
    //send 200 HTTP success code if successful
    res.status(200).json(user);
} catch (err){
    console.log(err);
    res.status(500).json(err);
}
});

//Login
router.post("/login", async (req,res)=>{
    try{
        //check if email exists in our db
const user = await User.findOne({email:req.body.email});
//if it doesn't exist and we receive a 404 error, tell the server the user was not found
!user && res.status(404).json("User not found!");

//use bcrypt to compare the password entered, to the one that is hashed in our DB
const validPassword = await bcrypt.compare(req.body.password, user.password)
//If password is incorrect
!validPassword && res.status(400).json("Password Incorrect!");

//if successful, return our user in json format to postman
res.status(200).json(user);


    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
