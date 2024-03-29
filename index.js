const mongoose = require("mongoose")

const express = require("express");
const app = express();

require("dotenv").config()
const cors = require("cors")

let userRouter = require("./routes/user.route")

//mkiddleware
app.use(cors());
app.use(express.urlencoded({extended:true, limit:"50mb"}))
app.use(express.json({limit:"50mb"}))
app.use('/user', userRouter)

//connecting to mongoDB
let URI = process.env.URI
//"mongodb+srv://olutayostephen:AYANRINDE@cluster0.iibdlfl.mongodb.net/Regis_Bank_Application-db1?retryWrites=true&w=majority"
//mongodb+srv://olutayostephen:<password>@cluster0.iibdlfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    mongoose.connect(URI) 
     .then(()=>{console.log("mongo has connect")})
     .catch((err)=>{console.log("mongo refuse" + err)})

//port
//variable declaration
let PORT = process.env.PORT
app.listen(PORT,()=>{ console.log("app is listening at PORT : " + PORT) })

//HANDLING invalid url
app.use((req, res, next) => {
    const error = new Error ('Invalid URL');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500 );
    res.json({
        error: {message: error.message}
    })
})
