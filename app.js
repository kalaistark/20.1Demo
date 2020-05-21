const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var localStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')
var expSession = require('express-session')

app.use(bodyParser.urlencoded(
    { extended:true }
))
mongoose.connect("mongodb+srv://admin:admin@cluster0-lfyxv.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true}).then(console.log("db connected")).catch(err => console.log(err))

const adminSchema = new mongoose.Schema({
    username:"String",
    password:"String"
}
)
const dataSchema = new mongoose.Schema({
    name:"String",
    team:"String"
})
adminSchema.plugin(passportLocalMongoose);

var Admin = mongoose.model("Admin",adminSchema)
var User = mongoose.model("User",dataSchema)

app.use(expSession({
    secret:"Protosem",
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(Admin.authenticate()))
passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())


app.use(express.static('views'))

// response to '/' route
app.get('/',isLoggedIn,(req,res)=>{
    console.log(req.session)
    var currentUser = req.user
    User.find({},(err,data)=>{
        if(err){
            console.log("can't find data",err)
        }
        else{
            res.render("index.ejs",{user:data,logedin:currentUser})
        }
        // console.log(data)
    })
})

app.get('/update/:id',(req,res)=>{
    var id = req.params.id
    User.findById(id).then(post =>{
        res.render("update.ejs",{data:post})
    })
})

app.post('/test',(req,res)=>{
    var newUser = new User({
        name:req.body.name,
        team:req.body.team
    }).save().then(savedData => console.log("data saved",savedData)).catch(err => console.log(err))
    res.redirect('/')
})

app.get('/delete/:id',(req,res)=>{
    var id = req.params.id
    User.findByIdAndDelete(id).then(console.log("data deleted")).catch(err => console.log(err))
    res.redirect('/')
})
app.get('/register',(req,res)=>{
    res.render("log.ejs")
})

app.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/register')
})

app.post('/update/:id',(req,res)=>{
    var id = req.params.id
    var updatedData = {
        name:req.body.name,
        team:req.body.team
    }
    User.findByIdAndUpdate(id,updatedData).then(res.redirect('/')).catch(err => console.log(err))
})

app.post('/register',(req,res)=>{
    var newUser = new Admin({username:req.body.username})
    Admin.register(newUser, req.body.password, (err,user)=>{
        if(err){
            console.log("user not created",err)
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect('/')
            })
        }
    })
})
app.post('/login',passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/register"
}))

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/register')
}


// listen
app.listen(8000,()=>{
    console.log("server started @8000")
})

