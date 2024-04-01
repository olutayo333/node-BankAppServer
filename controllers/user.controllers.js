
const userModel = require("../models/user.model");
let jwt = require("jsonwebtoken");
let nodemailer = require("nodemailer");     

const signup = (req,res)=>{
    let userData = { 
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            accountnumber: req.body.accountnumber,
            phonenumber:req.body.phonenumber,
            balance:req.body.balance,     
     }  

     let form = new userModel(userData)
     let userEmail = req.body.email   
     
        userModel.find({email:userEmail})
        .then ((result)=>{ console.log(result);
            if(result.length>0){ res.send({status:false, message:"Email Already Exist, Please use another Email"}); console.log('user already exist')}
            else{
                form.save()
                .then(()=>{console.log("data saved succesfully ");res.send({status:true, message:"signup was successful"})})
                .catch((err)=>{console.log('Data could not be saved' + err); res.send({status:false, message:"signup not successful"})})                
            }
        })
        .catch((err)=>{console.log(err)})
        console.log(req.body)          
    }  

    let signinEmail; let signinPassword; 
    const signin = (req, res) =>{
        let {email,password} = req.body; signinEmail = req.body.email; signinPassword=req.body.password
        userModel.findOne({email:email} && {password:password})
        .then((user)=>{
            if(!user){res.send({status:false, message:"invalid login credentials"})}
            else{
                let secret = process.env.SECRET
                let token = jwt.sign({email}, secret, {expiresIn:900} ); console.log(token)
                    //let mapeduser = user.map(i=>(i.name, i.accountnumber, i.phonenumber, i.email))
                res.send({status:true, token, message:"signin successful", user})

                // FOR PASSWORD UNHASHING
                // user.validatePassword(password, (err,same)=>{
                //     if (!same){res.send({status:false, message:"Password Incorrect"})}
                //     else{
                //         let token = jwt.sign({email}, secret, {expiresIn:900} ); console.log(token)
                //         res.send({status:true, token, message:"signin successful", result})
                //     }
                // })
            }
        })
    }

    const accountresetpassword= (req,res)=>{
        console.log(req.body);
      let {oldpassword, balance, name, resetemail } = req.body  ;  let newpassword= req.body.newpassword
      userModel.findOne( {email:resetemail} && {password:oldpassword} && {balance:balance} )
      
       .then((user)=>{  console.log(user);
        let email = user.email; let name=user.name; let phonenumber=user.phonenumber; let accountnumber=user.accountnumber
        if (!user){res.send({status:false, message:"Incorrect password"})}
        else{
            userModel.findOneAndUpdate({email:resetemail}, {name, email, password:newpassword, accountnumber, phonenumber, balance}, {new:true}) 
            .then((result)=>{console.log("password reset succcessful"); res.send({status:true, message:`New password is ${newpassword}`, result})})
            .catch((err)=>{console.log(err); res.send({status:false, message:"password reset failed",})})
        }
    })
      
    }
    const resetpassword=(req,res)=>{
        let temporarypassword = Math.floor((Math.random()*100000000))
        let{resetemail, resetaccountnumber} = req.body; 
         userModel.findOne({email:resetemail} && {accountnumber:resetaccountnumber})
         .then((user)=>{ console.log(user); 
            let email = user.email; let name=user.name; let phonenumber=user.phonenumber; let balance = user.balance;      
            if (!user){res.send({status:false, message:"The supplied information did not match any user in our database"})}
            else{    
                            
                             userModel.findOneAndUpdate({email:resetemail}, {name, email, password:temporarypassword, accountnumber:resetaccountnumber, phonenumber, balance}, {new:true})
                             .then((result)=>{console.log("PAssword reset successful");  res.send({status:true, message:" A temporary Password has been sent to your email", temporarypassword}) 
                            
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                    user: process.env.USER_EMAIL,
                                    pass: process.env.USER_PASS
                                    }
                                });    
                                var mailOptions = {
                                    from: 'REGIS BANK',
                                    to: resetemail,
                                    subject: 'Password Reset',
                                    html: `<h1> Your temporary password is :${temporarypassword}  </h1> <br>
                                            <h2> Please login to your account and reset your password properly</h2>
                                            ` 
                                };
            
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                    console.log("reset failed", error); res.send({status:false, message:"password reset failed"})
                                    }
                                    else {
                                        console.log('Email sent: ' + info.response);
                                        } })
                            
                            } )
                             .catch((err)=>{console.log("password reset Failed");  })
                    
                }
        })
    }

    const dashboard = (req, res) =>{
        let token = req.headers.authorization.split(" ")[1];
        let secret = process.env.SECRET
        jwt.verify(token, secret, (err,result)=>{
         if(err){console.log(err); res.send({status:false, message:"can't signin"})}
         else{
                userModel.findOne({email:signinEmail})
                .then((user)=>{
                if(!user){res.send({status:false, message:"cant get you to dashbaord"})}
                else{res.send({status:true, token, message:"Welcome to dashboard", user})}
                }) 
            }
         }) 
    }

    const deposit = (req,res) =>{ console.log(req.body);
        let balance = req.body.intermediatbalance; let email= signinEmail;  let name= req.body.name;  let accountnumber = req.body.accountnumber
        let password= signinPassword; let phonenumber=req.body.phonenumber; 
        userModel.findOneAndUpdate({email:signinEmail}, {name, email, password, accountnumber, phonenumber, balance}, {new:true})
        .then((result)=>{console.log("Deposit successful"); res.send({status:true, message:`Deposit Successful`, result})})
        .catch((err)=>{console.log("Deposit Failed"); res.send({status:false, message:`Deposit Failed`})})
    }

    const withdraw = (req,res) =>{console.log(req.body);
        let balance = req.body.intermediatbalance; let email= signinEmail;  let name= req.body.name;  let accountnumber = req.body.accountnumber
        let password= signinPassword; let phonenumber=req.body.phonenumber
        userModel.findOneAndUpdate({email:signinEmail}, {name, email, password, accountnumber, phonenumber, balance}, {new:true})
        .then((result)=>{console.log("Withdraw successful"); res.send({status:true, message:`Withdraw Successful`, result})})
        .catch((err)=>{console.log("Withdraw Failed"); res.send({status:false, message:`Withdraw Failed`})})
    }

    

        
// const test = (req,res) =>{
//     console.log("testing oooo");
//     res.send({message:"testing ooo"})
// }

    module.exports = {signup, signin, dashboard, deposit, withdraw, resetpassword, accountresetpassword}