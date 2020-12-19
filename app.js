const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campgrounds')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')

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
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use((req,res,next)=>{
    console.log(req.path, req.headers)
    next()
})


app.get('/', (req, res)=>{
    res.render('home' , {home : 'HOME PAGE'})
})

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',async (req, res)=>{
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect('/campgrounds')
})

app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    // console.log(camp)
    res.render('campgrounds/show', {camp})
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const { id }= req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', {camp})
})

app.put('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true, runValidators: true})
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id',async (req, res)=>{
    const {id} =req.params
    console.log(req.body)
    // await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})





app.use((req,res)=>{
    res.status(404).send(`404 NOT FOUND`)
})


app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000')
})
