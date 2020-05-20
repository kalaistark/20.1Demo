const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var faker = require('faker')

app.use(bodyParser.urlencoded(
    { extended:true }
))


app.use(express.static('views'))

// response to '/' route
app.get('/',(req,res)=>{
    res.render("index.ejs")
})

app.post('/test',(req,res)=>{
    console.log(req.body)
    res.redirect('/')
})


// listen
app.listen(8000,()=>{
    console.log("server started @8000")
})

