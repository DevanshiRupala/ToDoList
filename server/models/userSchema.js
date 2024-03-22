const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("not valid email")
        }
    },
    password:{
       type:String,
       required:true,
       minlength:8
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
    shareTask: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'requests' 
    }],
});

const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;