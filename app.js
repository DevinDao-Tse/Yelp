const express = require('express')
const app = express()
const path = require('path')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.get('/', (req, res)=>{
    res.render('home' , {home : 'HOME PAGE'})
})






app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000')
})
