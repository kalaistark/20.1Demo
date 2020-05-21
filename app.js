const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var faker = require('faker')

app.use(bodyParser.urlencoded(
    { extended:true }
))
mongoose.connect("mongodb+srv://admin:admin@cluster0-lfyxv.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true}).then(console.log("db connected")).catch(err => console.log(err))

const dataSchema = new mongoose.Schema({
    name:"String",
    team:"String"
})

var User = mongoose.model("User",dataSchema)

app.use(express.static('views'))

// response to '/' route
app.get('/',(req,res)=>{
    User.find({},(err,data)=>{
        if(err){
            console.log("can't find data",err)
        }
        else{
            res.render("index.ejs",{user:data})
        }
        // console.log(data)
    })
})

app.post('/test',(req,res)=>{
    var newUser = new User({
        name:req.body.name,
        team:req.body.team
    }).save().then(savedData => console.log("data saved",savedData)).catch(err => console.log(err))
    res.redirect('/')
})


// listen
app.listen(8000,()=>{
    console.log("server started @8000")
})


// app file branch v2

//for second commit

//for third commit
