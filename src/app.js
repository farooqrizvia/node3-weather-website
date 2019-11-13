const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for express
const publicDirPath = path.join(__dirname, '../public/')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars and views location
app.set('view engine','hbs')
app.set('views',viewsPath )
hbs.registerPartials(partialsPath)

//setup static dir to server
app.use(express.static(publicDirPath))

app.get('' , (req, res) =>{
    res.render('index',{
        title:'Weather',
        name: 'Farooq Rizvia'
    })
})

app.get('/about', (req, res) =>{
    res.render('about',{
        title:'About me',
        name:'Farooq Rizvia'
    })
})

app.get('/help', (req, res) =>{
    res.render('help',{
        title:'Help',
        message:'This website give the weather forecast for any valid place',
        name: 'Farooq Rizvia'
    })
})
app.get('/weather', (req, res) =>{
    if(!req.query.address){
        return res.status(500).send({ error:'Please provide the address.'})
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forcastData) =>{
            if(error){
                return res.send({error});
            }
            res.send({
                forecast:forcastData,
                location,
                address:req.query.address
            })
        })
    })
    // res.send({
    //     forecast:"Its pleaseat here",
    //     location:"Bengaluru",
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) =>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req, res) =>{
    res.render('404',{
        title:'404',
        name:'Farooq Rizvia',
        errorMessage:'Help artical not found'
    })
})
app.get('*',(req,res) =>{
    res.render('404',{
        title:'404',
        name:'Farooq Rizvia',
        errorMessage:'Page not found'
    })
})

app.listen(3000, ()=>{
    console.log('Server is up on port 3000')
})