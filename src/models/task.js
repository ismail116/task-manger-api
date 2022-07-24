const mongoose = require('mongoose')


const taskSchema = mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:6
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'  //name of model
    },
    image:{
        type:Buffer
    }
})


////////////////////////////////////////////////////////////////////

/// sensitve data
taskSchema.methods.toJSON = function(){
    // this (doceumnt)
    const task = this

    // toObject --> convert document --> object
    const taskObject = task.toObject()

    return taskObject
}
////////////////////////////////////////////////////////////////////
const Task = mongoose.model('Task',taskSchema)
module.exports = Task