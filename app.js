const express = require("express");
const hbs = require("hbs");
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const path = require('path');
// mongoose.connect('mongodb: // 127.0.0.1:27017/savery form', {
//     useUniFiedTopology: true, useNewUrlParser: true, useCreateIndex: true // Add this line to avoid deprecation warning
// });
mongoose.connect('mongodb://127.0.0.1:27017/sarveryForm', { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

// Create a MongoDB Schema for the survey form data
const surveySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures each email is unique
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

// Create a MongoDB model based on the survey schema
const Survey = mongoose.model('Survey', surveySchema);


app.use('/static', express.static('static'));
app.use('/static/img', express.static('img'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'view'));

app.set('view engine', 'hbs') // Set the template engine as hbs
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('index.hbs', params);
})


app.post('/submit', async (req, res) => {
    try {
        // Create a new Survey instance using the form data
        const newSurvey = new Survey({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            feedback: req.body.feedback
        });

        // Save the survey data to the MongoDB database
        await newSurvey.save();
        res.send('Sarvey successful submitted.....!!');
        // res.render('success', { name: req.body.name }); // Render a success page with the user's name
    } catch (error) {
        res.status(500).send('Error saving the survey data.');
    }
});


// Define the port the server will listen on
const port = 80;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
