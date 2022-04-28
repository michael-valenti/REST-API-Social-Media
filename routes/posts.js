const router = require("express").Router();
const req = require("express/lib/request");
const res = require("express/lib/response");
const Post = require("../models/Post");
const User = require("../models/User");


//Create a post

router.post("/", async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//Update a post

router.put("/:id", async (req, res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("Post updated successfully.");

    }else{
        res.status(403).json("You are only allowed to update your posts!");
    }
}catch(err){
    res.status(500).json(err);
}
});

//Delete a post

router.delete("/:id", async (req, res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne({$set:req.body});
        res.status(200).json("Post deleted successfully.");

    }else{
        res.status(403).json("You are only allowed to delete your posts!");
    }
}catch(err){
    res.status(500).json(err);
}
});


//Like/dislike a post

router.put("/:id/like", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("You have liked the post!");
        } else {
            await post.updateOne({$pull: {likes:req.body.userId}});
            res.status(200).json("You have disliked the post");
        }
    }catch(err){
        res.status(500).json(err);
    }
});
//Get a post

router.get("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);S
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

//Generate timeline posts

router.get("/timeline/all", async (req, res)=>{

//let postArray = [];

try{

    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId:currentUser._id});
    const followerPosts = await Promise.all(
        currentUser.followers.map(friendId=>{
            return Post.find({userId: friendId});
        })
    );
    res.json(userPosts.concat(...followerPosts));
}catch(err){
    res.status(500).json(err);
}
});

module.exports = router;