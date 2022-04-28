const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const helmet = require ("helmet");
const morgan = require ("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//initialize dotenv
dotenv.config();

//mongoose connection
mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("Connected to MongoDB successfully.")
});


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/",(req, res)=>{
    res.send("Welcome to the homepage!");
});

app.get("/users",(req, res)=>{
    res.send("Welcome to the users page!");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//listen on port 3000
app.listen(3000,()=>{
    console.log("The server is ready to rock n roll!");
});