
    const express = require("express");
    var user = require("../controller/userCtrl");
    const router = express.Router()
  

    router.post("/signup", user.signup);
    router.post("/find-user", user.findUser);
    router.put("/deleted-user", user.updateUserStatus);
    router.post("/update-user", user.updateUser);
    // router.post("/send", user.sendMsg)
    router.get('/users', user.allUsers)


    
  
    module.exports = router