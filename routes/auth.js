const router = require("express").Router();


router.get("/", (req,res)=>{
    res.send("Hello, this is the auth route")
});

module.exports = router;