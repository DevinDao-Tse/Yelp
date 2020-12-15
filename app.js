const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
// .then(()=>{
//     console.log('CONNECTION OPEN')
//   }).catch(err=>{
//     console.log('CANT CONNECT')
//     console.log(err)
//   })

const db = mongoose.connection
db.on("error", console.error.bind(console, 'connection error'))
db.once("open",()=>{
    console.log('Database connected')
})
 

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.get('/', (req, res)=>{
    res.render('home' , {home : 'HOME PAGE'})
})

app.post('/campground', async (req,res)=>{
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
    await camp.save()
    res.send(camp)
})






app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000')
})
