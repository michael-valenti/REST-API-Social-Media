const router = require("express").Router();


router.get("/", (req,res)=>{
    res.send("Hello, this is the user route")
});

module.exports = router;