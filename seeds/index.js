const mongoose = require('mongoose')
const campgrounds = require('../models/campgrounds')
const Campground = require('../models/campgrounds')
const {places, descriptors} = require('./seedHelper')
const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
})
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

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i =0;i<50; i++){
        const random100 = Math.floor(Math.random()*100)
        const price = Math.floor(Math.random()*20 + 10)
        const camp = new Campground({
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore suscipit, perspiciatis voluptatem neque facere est debitis aliquid? Totam odio voluptatibus, accusamus voluptatem laudantium fugit blanditiis aperiam repellat ad quidem quae.',
            price: price
        })
        await camp.save()
    }
}

seedDB().then(()=> {
    mongoose.connection.close
})