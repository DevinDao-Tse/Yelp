const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')
const { campgroundSchema } = require('../joiSchema.js')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next()

}


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground data', 400)
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    req.flash('success', 'Successfully made new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', { camp })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true })
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}))


router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted Campground')
    res.redirect('/campgrounds')
})

module.exports = router





