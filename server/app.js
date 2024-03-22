const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const usermodel = require('./models/userSchema');
const otpmodel = require('./models/otpmodel');
const taskmodel = require('./models/taskSchema');
const nodemailer = require("nodemailer");
const requestmodel = require('./models/requestSchema');

const app = express();
app.use(express.json());
const port = 8000;

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mydb")

app.post("/register",(req,res) => {
    usermodel.create(req.body).then(users => {res.json(users);
      
        try{
            const transporter = nodemailer.createTransport({
              host:'smtp.gmail.com',
              port:587,
              secure:false,
              requireTLS:true,
              auth:{
                user:"j52323030@gmail.com",
                pass:'xhaxzbwrczissgod'
            }
            });

            const mailOptions = {
                from:"j52323030@gmail.com",
                to:req.body.email,
                subject:"sending email with nodemailer",
                html:"<p>you have regestered successfully</p>"
            }

            transporter.sendMail(mailOptions,(err,info) => {
                if(err)
                console.log(err);
                else
                console.log(info.response);
            })
         }catch(err)
         {
            console.log(err);
         }
    }).catch(err => res.json(err))
});

app.post('/sendEmail', async (req, res) => {
    try {
      console.log(req.body.email);
      const user = await usermodel.findOne({ email: req.body.email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const otp = Math.floor(Math.random() * 10000);

      await otpmodel.deleteMany({email : req.body.email});

      const createdOtp = await new otpmodel ({
        userId: user._id,
        email: req.body.email,
        otp: otp,
        expiresAt: currentTime,
      });
      createdOtp.save();
      
      const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
          user:"j52323030@gmail.com",
          pass:'xhaxzbwrczissgod'
      }
      });
  
      const mailOptions = {
        from: "j52323030@gmail.com",
        to: req.body.email,
        subject: 'Sending email with nodemailer',
        text: `Here is your OTP number: ${otp}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log(info.response);
      return res.status(200).json({ message: 'OTP sent successfully' });
     } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending OTP email' });
    }
  });

app.post("/",(req,res) => {
  usermodel.findOne({ email: req.body.email, password: req.body.password })
  .then(user => {
    if (user) {
      res.status(200).json({message : "logged in"});
    } else {
      console.log("user not found");
      res.status(500).json({message : "not found"});
    }
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
})

app.post("/sendOtp",(req,res) => {
    otpmodel.find({email:req.body.email, otp:req.body.otp})
    .then((user) => {
        const currentTime = new Date();
        if(user.expireAt - currentTime < 0)
        {
          res.status(500).json({message: 'Otp is expired'});
        }
        else
        {
          res.json(user);
        }
    })
    .catch((err) => res.json(err))
})

app.post("/sendPass",(req,res) => {
    usermodel.updateOne({email:req.body.email},{ $set : {password:req.body.Pass}})
    .then((updated) => {res.status(200).json({message:"updated"})});
})

app.post("/addtask", (req, res) => {
  usermodel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("user not found");
        return res.status(404).json({ error: 'User not found' });
      }
      if(!req.body.request){
        taskmodel.create({
          description: req.body.description,
          dueDate: req.body.date,
          userId: user._id,
          priority: req.body.priority
        })
        .then((task) => {       
            console.log(task);
           res.status(201).json(task);
      
         })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Task creation failed', details: err });
        });
      }
      else{
        taskmodel.create({
          description: req.body.description,
          dueDate: req.body.date,
          userId: user._id,
          share:true,
          from:req.body.email,
          to:req.body.request,
          status:'pending',
          priority: req.body.priority,
        })
        .then((task) => {       
            console.log(task);
           res.status(201).json(task);
      
         })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Task creation failed', details: err });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'User lookup failed', details: err });
    });
});

app.post("/showtasks", (req, res) => {
  usermodel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("user not foun");
        return res.status(404).json({ error: 'User not found' });
      }
      taskmodel.find({$and:[{userId:user._id},{status:{$in:['not_share','accept']}}]})
        .then((tasks) => {
          console.log("res sent");
          res.status(200).json(tasks);
        })
        .catch((err) => {
          console.log("error on fetvhing");
          res.status(500).json({ error: 'Error fetching tasks', details: err });
        });
    })
    .catch((err) => {
      console.log("look up faile");
      res.status(500).json({ error: 'User lookup failed', details: err });
    });
});

app.post("/deletetask",(req,res) => 
{
  taskmodel.findByIdAndRemove({_id : req.body.e})
  .then((task) => {
    usermodel.findOne({_id : task.userId})
    .then((user) => {res.json({email : user.email})});
  })
  .catch((err) => {
    res.json({error : 'error in finding'});
  })
});

app.post("/completetask", (req, res) => {
    taskmodel.updateOne({_id : req.body.id }, {$set : {completed : true}})
      .then((r) => {
        res.json(r);
      })
})

app.post("/accept",(req,res)=>{
  taskmodel.updateOne({ _id: req.body.task._id }, { $set: { status: "accept" }})
  .then(() => {
    console.log("Task updated successfully");
    return taskmodel.findOne({ _id: req.body.task._id });
  })
  .then((updatedTask) => {
    console.log(updatedTask); 
  })
  .catch((err) => {
    console.log(err);
  });
  usermodel.findOne({email:req.body.task.to})
    .then((user)=>{
      if (!user) {
        console.log("User not found.");
        res.status(404).json({ error: 'User not found' });
        return; 
      }
      taskmodel.create({
        description: req.body.task.description,
        dueDate: req.body.task.dueDate,
        userId: user._id,
        share:true,
        from:req.body.task.from,
        to:user.email,
        status:'accept',
      })
        .then((task) => {       
          console.log(task);
          res.status(201).json(task);
        })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Task creation failed', details: err });
      });
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.post("/decline",(req,res)=>{
  taskmodel.updateOne({ _id: req.body.task._id }, { $set: { status: "declined" }})
  .then(() => {
    console.log("Task updated successfully");
    return taskmodel.findOne({ _id: req.body.task._id });
  })
  .then((updatedTask) => {
    console.log(updatedTask);
    res.status(201).json(updatedTask); 
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ error: 'Task creation failed', details: err });
  });
});

app.post("/showpentasks", (req, res) => {
  console.log("i am in show pen task");
  console.log(req.body.email)
  usermodel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("user not foun",req.body.email);
        return res.status(404).json({ error: 'User not found' });
      }
      taskmodel.find({$and:[{to:user.email},{status:{$in:['pending']}}]})
        .then((tasks) => {
          console.log("i am here");
          res.status(200).json(tasks);
        })
        .catch((err) => {
          console.log("error on fetvhing");
          res.status(500).json({ error: 'Error fetching tasks', details: err });
        });
    })
    .catch((err) => {
      console.log("look up faile");
      res.status(500).json({ error: 'User lookup failed', details: err });
    });
});

app.get("/showcharts", async (req,res) => {
  console.log(req.query.email)
  user = await usermodel.findOne({email : req.query.email});
  console.log(user);
  const aggregateQuery = [
    {
      $match: {
        userId: user._id,
        completed: true,
      },
    },
    {
      $group: {
        _id: { $month: `$dueDate` }, // Group by the month of the "dueDate" field
        count: { $sum: 1 }, // Count the number of tasks in each group (month)
      },
    },
    {
      $sort: { _id: 1 }, // Sort the results by month (ascending order)
    },
  ];

  const tasksByMonth = await taskmodel.aggregate(aggregateQuery);

  console.log(tasksByMonth);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const expiredTasksByMonth = await taskmodel.aggregate([
  {
    $match: {
      completed: false, // Filter for tasks that are not completed
      dueDate: { $lt: firstDayOfMonth }, // Filter for tasks with a dueDate before the first day of the current month
    },
  },
  {
    $group: {
      _id: { $month: `$dueDate` }, 
      count: { $sum: 1 }, // Count the number of tasks in each group
    },
  },
  {
    $sort: { _id: 1 }, // Sort the results by month (ascending order)
  },
]);
console.log(expiredTasksByMonth);
res.json({ tasksByMonth, expiredTasksByMonth }) 
})

app.listen(port,()=>
{
    console.log("running")
});