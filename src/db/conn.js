const mongoose = require("mongoose");
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connection establish");
}).catch((err) => {
    console.log("no connection");
});