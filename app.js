const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campgrounds')
const methodOverride = require('method-override')
const { resolveAny } = require('dns')

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
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


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








app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000')
})
