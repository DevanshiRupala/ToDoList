const mongoose = require('mongoose');
const validator = require('validator');

const requestSchema = new mongoose.Schema({
    from:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("not valid email")
        }
    },
    status:{
            type: String,
            enum: ['Aceept','Pending','denied'],
            default: 'Pending',
    },
    to:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("not valid email")
        }
    },
});

const requestdb = new mongoose.model("requests",requestSchema);

module.exports = requestdb;