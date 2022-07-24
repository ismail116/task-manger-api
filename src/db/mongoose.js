// npm init -y
// npm i mongoose
const mongoose = require('mongoose');
// datbase --> test
mongoose.connect(process.env.MONGODB_URL);
