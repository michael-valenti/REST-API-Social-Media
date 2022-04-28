const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Update User
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
            res.status(200).json("Account has been updated successfully.");
        } catch(err){
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You do not have permission to update this account.");
    }
});

//Delete User
router.delete("/:id", async(req,res)=>{
    //if the user ID in the request matches the user ID of the logged in user, or if they are an Admin
    if(req.body.userId === req.params.id  || req.body.isAdmin){
        try{
            //search DB for a matching ID
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully.");
        } catch(err){
            console.log(err);
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You do not have permission to delete this account.");
    }
});

//Get a User
router.get("/:id", async (req, res)=>{
    try{
    const user = await User.findById(req.params.id);
    //do not send password or updatedAt into the doc we will return
    const {password, updatedAt, ...other} = user._doc;
    res.status(200).json(other);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    });


//Follow a User
router.put("/:id/follow", async (req, res)=>{
    //check if users are the same (logged in user vs the one they are trying to follow)
    if(req.body.userId !== req.params.id){
        try{

                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$addToSet:{followers: req.body.userId}});
                await currentUser.updateOne({$addToSet:{following: req.params.id}});
                res.status(200).json("User has been followed.");
                }else{
                    res.status(403).json("You already follow this user.");
                }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you cannot follow yourself!")
    }
});

//Unfollow a User


module.exports = router;