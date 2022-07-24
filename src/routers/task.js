const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middelware/auth')
const multer = require('multer')

const uploads =  multer({
    limits:{
            fileSize:1000000  //1MB
        },
        fileFilter(req,file,cb){
            // /\ . one of these(jpg|png|jpeg|jfif) $/
            if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
                return cb (new Error('Please upload an image'))
            }
            cb(null,true)
        }
    })

    router.post('/taskImage',auth,uploads.single('image'),async(req,res)=>{
    try{
        // spread operator (copy of data) ....
        const task = new Task({...req.body,owner:req.user._id})
        task.image = req.file.buffer
        await task.save()
        res.status(200).send(task)
    
    }
    catch(e){
        res.status(400).send(e.message)
    }
})




//////////////////////////////////////////////////////////////

// post

router.post('/task',auth,async(req,res)=>{
    try{
        // spread operator (copy of data) ....
        const task = new Task({...req.body,owner:req.user._id})
        await task.save()
        res.status(200).send(task)
    
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//////////////////////////////////////////////////////////////

// getall

// router.get('/tasks',auth,async(req,res)=>{
//     try{
//         const tasks = await Task.find({})
//         res.status(200).send(tasks)
//     }
//     catch(e){
//         res.status(500).send(e.message)
//     }

// })

///////////////////////////////////////////////////////////////////////////////


// router.get('/tasks',auth,async(req,res)=>{
//     try{
//         const tasks = await Task.find({owner:req.user._id})
//         res.status(200).send(tasks)
//     }
//     catch(e){
//         res.status(500).send(e.message)
//     }

// })
///////////////////////////////////////////////////////////////////////

router.get('/tasks',auth,async(req,res)=>{
    try{
       await req.user.populate('tasks')
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e.message)
    }

})

////////////////////////////////////////////////////////////////

router.get('/task/:id',auth,async(req,res)=>{
    try{
        // id task / _id owner
        const _id = req.params.id
        /**
         * (taskid (de0),owner(6e8)
         * 61a,6e8
         */
        const task = await Task.findOne({_id,owner:req.user._id})
        // console.log(task)
        if(!task){
           return res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////

router.patch('/task/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOneAndUpdate(
            {_id,owner:req.user._id},
            req.body,
            {
            new:true,
            runValidators:true
            }
        )
        if(!task){
            return res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

////////////////////////////////////////////////////////////////////

router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const _id= req.params.id
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
////////////////////////////////////////////////////////////////////


router.get('/userTask/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('no task is found')
        }
        await task.populate('owner')
        res.status(200).send(task.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router