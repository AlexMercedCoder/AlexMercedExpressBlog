const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const db = mongoose.connection;
const dbx = `mongodb+srv://${process.env.DBURL}:${process.env.DBURL}@alexmerced1-j5o9c.mongodb.net/test?retryWrites=true
`
const moment = require('moment');

console.log(dbx);
/////////////////////
//DATABASE
/////////////////////

// Configuration
const mongoURI = dbx + 'amblog';

// Connect to Mongo
mongoose.connect( mongoURI );

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on( 'open' , ()=>{
  console.log('Connection made!');
});

//Schema
const Blogs = require('./Models/blogs.js');

/////////////////////////
//RUNTIME DATA
/////////////////////////

/////////////////////
//MIDDLEWARE
/////////////////////
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));


/////////////////////
//Listener
/////////////////////
app.listen(port, () => console.log(`Hello Alex I'm listening on ${port}!`))


/////////////////////
//Root Route
/////////////////////
app.get('/', (req, res) => res.send('go to url/index to find my blog, learn more at AlexMercedCoder.com'))

/////////////////////
//Static Files
/////////////////////
app.use(express.static('public'));

/////////////////////
//Index Routes
/////////////////////
app.get('/index/', (request, response) => {
    Blogs.find({}, (error, data)=>{
        console.log(data)
        response.render('index.ejs', {
            data: data,
            tabTitle: 'Index',
            moment: moment
        });
    });
});


/////////////////////
//Create Routes
/////////////////////
app.post('/index/', (req, res) => {
    req.body.publishDate = new Date();
    console.log(req.body);
    Blogs.create(req.body, (error, created)=>{
        res.redirect('/index');
    });
});

app.get('/index/newblog', (req, res) => {
    res.render('new.ejs',
        {
            tabTitle: 'Create'
        });
});

/////////////////////
//Show Routes
/////////////////////
app.get('/index/:indexOf', function(req, res){
        Blogs.findById(req.params.indexOf, (err, foundData)=>{
            res.render('show.ejs', {
                Data:foundData,
                tabTitle: 'Show'
            });
        });
    });

/////////////////////
//Delete Route
/////////////////////

app.get('/index/delete/delete', (request, response) => {
    Blogs.find({}, (error, data)=>{
        console.log(data)
        response.render('delete.ejs', {
            data: data,
            tabTitle: 'Delete'
        });
    });
});

app.delete('/index/:indexOf', (req, res) => {
    console.log(req.params)
    Blogs.findByIdAndRemove(req.params.indexOf, (err, data)=>{
        res.redirect('/index');//redirect back to fruits index
    });
});

/////////////////////
//Update Routes
/////////////////////
app.get('/index/:indexOf/edit', (req, res)=>{
    Blogs.findById(req.params.indexOf, (err, foundData)=>{
        console.log(foundData)
        res.render(
    		'edit.ejs',
    		{
    			data: foundData,
                tabTitle: 'edit'

    		}
    	);
    });
});

app.put('/index/:indexOf', (req, res) => {
    Blogs.findByIdAndUpdate(req.params.indexOf, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/index');
    });
});
