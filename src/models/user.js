const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true // '         Omar                ' --> 'Omar'
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true, // 'OMAR@GMAIL.COM' --> 'omar@gmail.com'
        // npm i validator
        validate(value){
            // value --> email
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            let strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
           // 123456
            if(!strongPassword.test(value)){
                throw new Error('Password must include ..........')
            }
        }

    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
    // tasks:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId
    //     }
    // ]

})
///////////////////////////////////////////////////////////////////////

// virtual relation 
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

/////////////////////////////////////////////////////////
// password
// before save data --> hash password
userSchema.pre('save',async function(){
    // this --> document 
    const user = this
    // console.log(user)
    // before hash
    // console.log(user.password)
    //user.password =Aa@123456 = jskh8392rgwuedjsfh
    if(user.isModified('password'))
    user.password = await bcryptjs.hash(user.password,8)
    // after hash
    // console.log(user.password)
})
////////////////////////////////////////////////////////////

// login
// statics --> call function on model
// email --> req.body.email
userSchema.statics.findByCredentials = async(email,password)=>{
    // first step
    const user = await User.findOne({email})
    // console.log(user)
    if(!user){
        throw new Error ('Please check email or password')
    }

    // second password
    // user
    //Aa@1234567 --> 34ythbedfr43hebgfjds (Aa@123456)
    const isMatch = await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('Please check email or password')
    }
    return user

}
////////////////////////////////////////////////////////////////

userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},JWT_SECERT)
    // console.log(user.tokens.push(token))  // return length of array 
    // console.log(user.tokens.concat(token))
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}
////////////////////////////////////////////////////////////////////

/// sensitve data
userSchema.methods.toJSON = function(){
    // this (doceumnt)
    const user = this

    // toObject --> convert document --> object
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}





const User = mongoose.model('User',userSchema)
module.exports = User