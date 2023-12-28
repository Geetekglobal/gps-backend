const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.sendToken = (user, req,res, statuscode)=>{
        const token = user.gettoken();
        res.cookie('token',token,{
            expires : new Date(Date.now() + 1* 24*60*60*1000),
            httpOnly : true,
            // secure : true
        })
        user.password = undefined;
        res.json({message:'user Logged in ', user} )
}

exports. isLoggedin = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        const {id} = jwt.verify(token , "SECRETKEYJWT");
        const user = await User.findById(id).exec()
        req.user = user;
        req.user.properties = properties;
        next()
    } catch (error) {
        if(error.name === "JsonWebTokenError"){
           return res 
           .status(500)
           .json({message : "cannot access resources"})
        }
        else if(error.name === "TokenExpiredError"){
            res.status(500).json({message : "session timeout! login again"})
        }
        else{

            res.status(500).json(error)
        }
    }
}