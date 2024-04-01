const express = require("express");
const router = express.Router()
const {signup, signin, dashboard, deposit, withdraw, resetpassword, accountresetpassword} = require("../controllers/user.controllers")
//const { deleteUser, editUser, api, uploadFiles} = require("../contollers/user.controllers")

//Routes
router.post("/signup", signup )
// router.get("/test", test)
router.post("/signin", signin)
router.get("/dashboard", dashboard)
router.post("/deposit", deposit)
router.post("/withdraw", withdraw)
router.post("/resetpassword", resetpassword)
router.post("/accountresetpassword", accountresetpassword)

module.exports = router