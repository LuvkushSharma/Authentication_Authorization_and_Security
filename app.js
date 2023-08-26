// Importing 
const express = require('express');
const path = require('path');
const morgan = require('morgan');

// ------- Lec_16 ----------
const rateLimit = require('express-rate-limit');
// -------------------------

// -------- Lec_17 ----------
const helmet = require('helmet');
// ----------------------------


// ---------- Lec_18 -----------
const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');
// -----------------------------

// ---------- Lec_19 ---------

const hpp = require('hpp');

/////////////////////////////


// Importing AppError class
const AppError = require (path.join(__dirname ,'/utils/appError.js'));
const globalErrorHandler = require(path.join(__dirname ,'/Controllers/errorController.js'))

const tourRouter = require(path.join(__dirname , '/Routes/tourRoutes'));
const userRouter = require(path.join(__dirname , '/Routes/userRoutes'));


const app = express();

// --------- Middlewares -----------

// -------- Lec_17 ----------

// helmet middleware should be the first middleware of the app.js

// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

// And it's better to use the helmet early in your middleware stack so that its headers are sure to be set.

// Set Security HTTP headers
app.use(helmet());
// ---------------------------


// -------- Global Middlewares --------
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
}

// ---------- Lec_16 ---------

// ------- rate limiting -------

// rateLimit is a function that accepts the object of options

// So, we are allowing 100 requests from the same IP in one hour. 

// windowMs means window in milli sec

// And , if that limit is then crossed by a certain IP , they will get back an error message.

/*

const limiter = rateLimit({

     max: 100,
     windowMs : 60 * 60 * 1000,
     message: 'Too many requests from this IP, please try again in an hour.'
});

*/

// Let's for the etsting purpose take max as 3
// After using all the 3 requests in an hour if we try to do one more requests then we will get the error to see that error 

// Just see the tooManyRequestsError.png.

// And , it will automatically set the status to 429 i.e. too many requests.
const limiter = rateLimit({

    max: 3,
    windowMs : 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour.'
});

// Applying limiter middleware to the /api route and so it will then affect all of the routes taht basically start with this.
app.use('/api' , limiter);

/////////////////////////////////


// We are limiting the middleware to just read 10kb of data from req.body

// Body parser, reading data from body into req.body
app.use(express.json({ limit : '10kb'}));

// ---------- Lec_18 -----------

/*


Above body parser middleware reads the data into request.body, and only after that we can actually clean that data. Hence , this is a perfect place for doing the data sanitization.

npm i express-mongo-sanitize

and

npm i xss-clean

*/

// ---------> Data Sanitization

// Against NOSql query injection

// So, this middleware looks req.body and req.params and then it will basically filter out all of the dollar signs and dots
app.use(mongoSanitize());

// this will clean any user input from malicious HTML code
app.use(xss());

//////////////////////////////////

// -------------- Lec_19 ---------------

// ---------> Prevent Parameter Pollution

// And it's being used by the end so that it clears up the query string

// app.use(hpp());

// Allowing duplicates in query string
app.use(hpp( {

     whitelist: ['duration' , 'ratingsQuantity' , 'ratingsAverage' , 'maxGroupSize' , 'difficulty' , 'price']
}))

///////////////////////////////////////


// -------- Only for Lec_7 ---------
// app.use ((req , res , next) => {
        
//    console.log(req.headers);
//    next();
//  })



// Mounting the routers
app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users', userRouter);


// All the URL that gonna not handled before , will be handled here.
app.all('*' , (req , res , next) => {
    
    next(new AppError (`Can't find ${req.originalUrl} on this server` , 404));
})


// ----> Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;

