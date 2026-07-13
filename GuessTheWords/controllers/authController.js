const bcrypt = require("bcrypt");

const User = require("../models/User");





exports.login = (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    User.findByUsername(username,(err,user)=>{

        if(err){

            return res.redirect(
                "/?error=1"
            );

        }

        if(!user){

            return res.redirect(
                "/?error=1"
            );

        }

        bcrypt.compare(
            password,
            user.password,
            (err,result)=>{

                if(err){

                    return res.redirect(
                        "/?error=1"
                    );

                }

                if(result){

                    req.session.user =
                    user.username;

                    res.redirect(
                        "/lobby"
                    );

                }
                else{

                    res.redirect(
                        "/?error=1"
                    );

                }

            }
        );

    });

};









exports.register = (req,res)=>{



    const username = req.body.username;

    const password = req.body.password;







    bcrypt.hash(

        password,

        10,

        (err,hash)=>{





            if(err){


                return res.send(

                    "Registration Error"

                );


            }







            User.create(

                username,

                hash,

                (err)=>{





                    if(err){


                      //  return res.send(

                      //      "Username already exists"

                       // );

return res.redirect(
    "/?exists=1"
);
                    }






                   // res.send(

                      //  "Account Created"

                  //  );

res.redirect(
    "/?registered=1"
);

                }



            );




        }


    );



};