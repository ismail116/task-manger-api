const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
require('dotenv').config()

const port = process.env.PORT 

// connect database
require('./db/mongoose')

// parse automatic
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
// postman
// app.get('/test',(req,res)=>{
//     res.send('Hello from postman')
// })
////////////////////////////////////////////////////////////////////////////

// hashing

// const bcryptjs = require('bcryptjs')
// const passwordFunction = async () =>{
//     const password = 'R123456'
//     // hashing --> hash
//     const hashedPassword = await bcryptjs.hash(password,8)
//     console.log(hashedPassword)

//     // verify
//     const compare = await bcryptjs.compare('R123456',hashedPassword)
//     console.log(compare)
// }
// passwordFunction()

//////////////////////////////////////////////////////////////////

// jsonwebtoken
// npm i jsonwebtoken

// const jwt = require('jsonwebtoken')

// const myToken = () =>{
//     // create token --> sign
//     // charcters (id) payload
//     // secretkey
//     // [header].[payload].[signature/secretkey]
//     // info token/userInfo/secret key
//     const token = jwt.sign({_id:'123'},'nodecourse')
//     console.log(token)

//     // iat --> issuedAt
//     const tokenVerify = jwt.verify(token,'nodecourse')
//     console.log(tokenVerify)
// }
// myToken()

/////////////////////////////////////////////////////////////////

// express middelware
/**
 * before express middelware
 * request --> run route handler
 * 
 * express middelware
 * request --> do sth(check token) --> run route handler
 */
////////////////////////////////////////////////////////////////

// relations 
// const Task = require('./models/task')
// const User = require('./models/user')
// const mainFun = async() =>{
//     // const task = await Task.findById('62d9167ac5fcac6f23ce7de0')
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('62d90be29e71ce722faef6e8')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// mainFun()
////////////////////////////////////////////////////////////////////////////

// const multer = require('multer')
// const uploads = multer({
//     dest:'images',
//     limits:{
//         // 1MB --> 1000000 byte
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.endsWith('.pfd')){
//             cb(new Error('Please upload pdf file'))
//         }
//         cb(null,true)
//     }
// })

// app.post('/image',uploads.single('avatar'),(req,res)=>{
//     res.send('File Uploaded')
// })


app.listen(port,()=>{console.log('Server is running '+ port)})

/////////////////////////////////////////////////////////////////

/**
 * 1) connection 2 lines --> name of database
 * 2) model --> properties of each document inside collection
 * 3) router --> routes CRUD operations
 * 4) app.js --> main file
 */