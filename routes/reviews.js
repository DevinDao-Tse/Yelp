const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')
const Review = require('../models/review')
const { reviewSchema } = require('../joiSchema.js')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    // const {id} = req.params
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.delete('/:reviewid', catchAsync(async (req, res) => {
    const { id, reviewid } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router










