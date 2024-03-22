const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
      },
      completed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      share:{
        type: Boolean,
        default: false,
      },
      from:{
        type:String,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("not valid email")
        },
      },
      status:{
        type:String,
        enum:['pending','not_share','accept','declined'],
        default:'not_share',
      },
      to:{
        type:String,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("not valid email")
        },
      },
});

const taskdb = new mongoose.model("task",taskSchema);

module.exports = taskdb;