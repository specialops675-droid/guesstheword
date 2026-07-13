const express=require("express");

const router=express.Router();


const authController=require("../controllers/authController");



router.get("/",(req,res)=>{


    res.sendFile(

        "login.html",

        {
            root:"views"
        }

    );


});



router.post("/login",

    authController.login

);



router.post("/register",

    authController.register

);



module.exports=router;