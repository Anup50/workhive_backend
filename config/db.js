const mongoose = require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/db_work_hive");
        console.log("MongoDB Connected")
    }catch (e) {
        console.log("not connected")
    }

}

module.exports=connectDB;