const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAysnc = require('../utils/catchAsync')

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAysnc (async(req,res)=>{
    try{
        const {username, email, password} = req.body
        const user = new User({email, username})
        const newUser = await User.register(user, password)
        req.flash('success', 'Welcome to Yelp Camp')
        res.redirect('/')
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }

    

}))









module.exports = router












