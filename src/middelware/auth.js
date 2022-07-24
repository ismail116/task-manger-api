// const auth = async(req,res,next)=>{
//     console.log('Auth Middelware')
//     next()
// }

////////////////////////////////////////////////////////////////////

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req,res,next) =>{
    try{
        // Bearer token   -(replace)-> token
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decode = jwt.verify(token,JWT_SECERT)
        //  console.log(decode)
        // 1,123
        const user = await User.findOne({_id:decode._id,tokens:token})
        // console.log(user)
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token

        next()
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'})
    }

}



module.exports = auth