const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middelware/auth')
const multer = require('multer')

/**
 * CRUD
 * Create --> post
 * Read --> get
 * Update --> patch
 * Delete --> delete
 * 
 */
// SignUp
// version1
// router.post('/signup',(req,res)=>{
//     // req.body --> data which i want to save
//     // console.log(req.body)
//     const user = new User(req.body)
//     user.save().then(()=>{
//         res.status(200).send(user)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })
/////////////////////////////////////////////////////////////////

// version 2 (token)
router.post('/signup',async(req,res)=>{
    try{
        const user = new User(req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(201).send({user})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// login
router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        // console.log(token)
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

///////////////////////////////////////////////////////////////////

// get all users without filter
router.get('/users',auth,(req,res)=>{
    // array of users
    // find --> list of documents
    User.find({}).then((data)=>{
        res.status(200).send(data)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

router.get('/usersAge',auth,(req,res)=>{
    // array of users
    User.find({age:50}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
//////////////////////////////////////////////////////////////////
// new route
// get Profile
router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})

///////////////////////////////////////////////////////////////////

// get by id
// /:id --> id (dynamic)
router.get('/users/:id',auth,(req,res)=>{
    // console.log(req.params)
    const id = req.params.id
    User.findById(id).then((user)=>{
        if(!user){
          return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
/////////////////////////////////////////////////////////////////////

// update by id
// version 1
// router.patch('/users/:id',async(req,res)=>{
//     try{
        
//         const user = await User.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         })
//         if(!user){
//             return res.status(404).send('No user is found')
//         }
//         res.status(200).send(user)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

/////////////////////////////////////////////////////////////////////////////////

// version 2--> update certain data
// router.patch('/users/:id',async(req,res)=>{
//     try{
//         // keys of object --> array
//         const updates = Object.keys(req.body)
//         console.log(updates)
//         const allowedUpdates = ['name','age']
//         /**
//          * ['name','age','password]   
//          * el --> name              --> ['name','age'] true
//          * el --> age               -->  --> ['name','age'] true
//          * el --> passowrd         -->  --> ['name','age'] false
//          */
//         const isValid = updates.every((el)=>allowedUpdates.includes(el))
//         console.log(isValid)

//         if(!isValid){
//             return res.status(400).send("Can't update")
//         }
        

//         /////////////////////////////////////////////////
//         const user = await User.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         })
//         if(!user){
//             return res.status(404).send('No user is found')
//         }
//         res.status(200).send(user)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

////////////////////////////////////////////////////////////////////////////////

// version 3 (Password)

router.patch('/users/:id',auth,async(req,res)=>{
    try{
        // keys of object --> array
        const updates = Object.keys(req.body)
        console.log(updates)
        const allowedUpdates = ['name','age','password']
        /**
         * ['name','age','password]   
         * el --> name              --> ['name','age'] true
         * el --> age               -->  --> ['name','age'] true
         * el --> passowrd         -->  --> ['name','age'] false
         */
        const isValid = updates.every((el)=>allowedUpdates.includes(el))
        console.log(isValid)

        if(!isValid){
            return res.status(400).send("Can't update")
        }
        

        /////////////////////////////////////////////////
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        // ['name','password']
        /**
         * 1st --> el -> name 
         * user.name = req.body.name ('amr')
         * 
         * 2nd loop --> el --> password
         * user.password = req.body.password
         */
        // user.name = req.body.name
        // user.password = req.body.password
        // .......
        // update
        updates.forEach((el)=> (user[el] = req.body[el]))
        await user.save()
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

///////////////////////////////////////////////////////////////////////////////


// delete by id

router.delete('/users/:id',auth,async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
           return res.status(404).send('No user is found')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})


//////////////////////////////////////////////////////////////////////////////

//logout
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((el)=>{

            return el !== req.token
        })  
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

//////////////////////////////////////////////////////////////////////////////
//logout all 

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
//////////////////////////////////////////////////////////////

    
    // images
    const uploads= multer({
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
    router.post('/profileImage',auth,uploads.single('image'),async(req,res)=>{
        try{
            req.user.avatar = req.file.buffer
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(400).send(e)
        }
    })


/**
 * collection --> model / router
 * task.js 
 * description string,trim,required minlength 10
 * title string,trim,required
 * completed: boolean / fasle
 * 
 * router --> task.js CRUD
 */





module.exports = router
