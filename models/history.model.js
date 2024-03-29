const mongoose = require("mongoose") //connecting to mongodb
const bcryptjs = require("bcryptjs"); const bcrypt = require("bcryptjs/dist/bcrypt");

let historySchema= mongoose.Schema({
    depositdate:{type: String, required:true },
    depositamount:{type: String, required:true, unique:true},
    email:{type:String, required:true, unique:true },
    accountnumber:{type:Number, required:true, unique:true },
    phonenumber:{type: String, required:true, unique:true },
   
}) 


let HistoryModel = mongoose.model("BankUsersDetails", historySchema)
module.exports = HistoryModel