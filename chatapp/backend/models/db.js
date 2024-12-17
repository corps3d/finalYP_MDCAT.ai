const mongoose = require("mongoose");
require("dotenv").config()

// MONGO DB Connection
mongoose.connect(process.env.MONGO_URI).then(
    () => {
        console.log("Connected to the database!")
    }
).catch(
    err => {
        console.log(err)
    }
)