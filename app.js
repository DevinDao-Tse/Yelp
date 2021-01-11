const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campgrounds')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const {campgroundSchema, reviewSchema } = require('./joiSchema.js')
const Review = require('./models/review')
const cookieParser = require('cookie-parser')


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
// app.use(morgan('short'))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())


const validateCampground = (req,res, next)=>{
    const {error} = campgroundSchema.validate(req.body)
    console.log(error)
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }else next()
    
}

const validateReview = (req, res, next)=>{
    const { error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}


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

app.post('/campgrounds',validateCampground, catchAsync(async (req, res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground data', 400)
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect('/campgrounds') 
}))

app.get('/campgrounds/:id',catchAsync(async (req, res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {camp})
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
    const { id }= req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', {camp})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res)=>{
    const {id} = req.params
    await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true, runValidators: true})
    res.redirect(`/campgrounds/${id}`)
}))


app.delete('/campgrounds/:id',async (req, res)=>{
    const {id} =req.params
    console.log(req.body)
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res)=>{
    // const {id} = req.params
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewid', catchAsync(async(req,res)=>{
    const {id, reviewid} = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/campgrounds/${id}`)

}))


app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})


app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000')
})
