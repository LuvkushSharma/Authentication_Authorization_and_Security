
const mongoose = require('mongoose');
const validator = require ('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,

      maxlength: [40 , 'A tour name must have less or equal than 40 characters'],

      minlength: [10 , 'A tour name must have more or equal than 10 characters'],

      // Lec_11
      // validate : validator.isAlpha

      // and to specify the error message
      // by this we also not able to add spaces in the name.
      validate : [validator.isAlpha , 'Tour name must only contains characters']

    
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      
      enum: {

        values : ['easy' , 'medium' , 'difficult'],

        message: 'Difficulty is either: easy , medium , difficult'
      }
      
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      
      min: [1 , 'Rating must be above or equal to 1.0'],
      max: [5 , 'Rating must be below or equal to 5.0']
      
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    // Lec_11
    priceDiscount: {

       type : Number,

       // this callback function has the access to the value that the user has entered i.e. priceDiscount as val

       /*

       validate : function (val) {
          
          // if 100 < 200 then returns true
          // if 300 < 200 then returns false
          return val < this.price;
       }

       */

       validate : {

          validator : function (val) {
            
            // this only points to current doc on NEW document creation
            return val < this.price;
         },

         message : 'Discount price ({VALUE}) should be below the regular price'
       }
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },

    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },

    // It will store multiple images in an array of Strings
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select : false // hiding this field
     
    },
    startDates: [Date],
  }
);

//  'Tour' is the name of the model.
const Tour = mongoose.model('Tour', tourSchema);
  
module.exports = Tour;