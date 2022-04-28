const router = require("express").Router();
const Post = require("../models/Post");


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


//Like a post

//Get a post

//Generate timeline posts

module.exports = router;