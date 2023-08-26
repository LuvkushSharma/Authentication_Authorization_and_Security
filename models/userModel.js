
// ######################### Lec_1 ##################

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  
  // When the user uploads the photo then it saves in the file system and that files
  // path will be saved in this.   
  photo: String,
  
  // ----> Lec_9
  ////////////////////
  role: {
    
    type: String,
    enum: ['user' , 'guide' , 'lead-guide' , 'admin'],
    default: 'user'

  } ,

  //////////////////////

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false 
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],

    // -------- Lec_3 --------
    // for validation we use validate property.
    // And we want to send the msg so, for that we have to make a object instead of array.
    validate : {
       
      // "this" keyword only works in case of creating user (create) and on save()
      // so, on updating also we have to use save()

      // i.e. this works in case
      // User.create()
      // user.save()
       validator : function (pc) {
          
          // abc === abc -> returns true
          // abc === xyz -> returns false
          return this.password === pc;
       },

       message : 'Password and ConfirmPassword are not the same'
    }

  },

  passwordChangedAt: Date,

  // ----- Lec_10 ------
  passwordResetToken: String,
  passwordResetExpires: Date,

  // ----- Lec_15 --------
  active : {
     
    type: Boolean,
    default: true,
    select: false
  }

});


// ---------- Lec_3 ----------

// -------> Encryption of password
// "pre" middleware on save

/*

The encryption, is gonna be happened between the moment that we receive that data and the moment where it's actually persisted to the database. So that's where the pre-save middleware runs. Between getting the data and saving it to the database.

And so that's the perfect time to manipulate the data.

*/

// We want to encrypt the password only when we are creating the User or updating the password. So, when we are updating the email then their is no need to update the password in that case.

const bcrypt = require('bcryptjs');

userSchema.pre('save' , async function (next) {
    
    // this points to the current document i.e. userSchema

    // If the password is not modified then just return and call the next middleware.
    if (!this.isModified('password')) return next();

    // We will hash the password using bcrypt
    // npm i bcryptjs

    // we also have to pass the cost parameter which means how cpu intensive this operation is. We are giving 12

    // We have two types of bcrypt 1. Synchronous and 2. Asynchronous

    // And we gonna use Asynchronous i.e. await this
    this.password = await bcrypt.hash(this.password , 12);
    
    // We only need it to check the password validation.
    // And we really not want to be persisted in the database.
    this.passwordConfirm = undefined;

    next();
});

// Slated Password at the end 
// $2a$12$7CkBjxaBT14N4MFoFCsOVOlrktDqgkOC/DHS8w6RJjGGO28p6/Pca

//////////////////////////////////////////////////////////////////////

// --------------- Lec_6 ------------------

// we will create a instance method that is gonna be available on all documents of a certain collection

// candidatePassword : password enetered by the user

// userPassword : password saved after the signing up of the user.

userSchema.methods.correctPassword = async function (candidatePassword , userPassword) {

   // this.password <---- not available as in password we had done : select:false

   // i.e. we passed the userPassword also.

   // Since , we cannot compare both the passwords as candidate password is the password coming from the user whereas userPassword is the hashed one.

   return await bcrypt.compare(candidatePassword , userPassword);

}


// --------------- Lec_7 -----------------

// JWTTimestamp : when the token was issued

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {

  console.log(this.passwordChangedAt);

  // If this property exists it means user has changed the password and if not then it means user not changed it's password.
  if (this.passwordChangedAt) {

    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  
  // by default we return false means token is valid as user not changed it's password
  return false;
}

////////////////////////////////////////////

// ---------- Lec_10 -------------

const crypto = require('crypto');

userSchema.methods.createPasswordResetToken = function () {

   // plain reset token string that we will pass to the user on it's email
   const resetToken = crypto.randomBytes (32).toString('hex');
   
   // hashed reset token that we will use for comparing the plain string with the hashed reset string.
   this.passwordResetToken = crypto.createHash ('sha256').update(resetToken).digest('hex');

   console.log({resetToken} , this.passwordResetToken);
   
   // Reset token expires in 10min
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   
   // used to send by the email
   return resetToken;
}


///////////////////////////////////////////////

// -------------- Lec_12 --------------

// Update changePasswordAt property for the user

// this function runs right before this document saves.

// We had applied a condition in the protect route authController that if the password is changed after the Token issuing time then the token is not valid.

// So, for comparing the time of both we need to update the passwordChangedAt property each time when we modified the password.

userSchema.pre('save' , function (next) {
   
  // If we didn't manipulated the password then donot update the changePasswordAt

  // or if the document is new then also go to the next middleware.
   if (!this.isModified ('password') || this.isNew) return next();
   
   // updating passwordChangedAt property 1 sec before.

   // As, in the resetPassword controller we are generating the new token.

   // 4) Log the user in, send JWT

   // So, if token generates before we modified the password then there will be a problem i.e. we are updating the password 1sec before. This is not 100% accurate approach but yeah this wwill work fine.

   this.passwordChangedAt = Date.now() - 1000;

   next();

})


//////////////////////////////////////////////


// --------------- Lec_15 ------------

// Deleting the user

// It will run before find 
// It will run for all the find methods i.e.
// findById , findByIdAndUpdate , findByIdAndDelete ,.....

// This is the query middleware i.e. "this" points to the current query.

// So, in the getAllUsers we are using User.find() method and then show them as res.json() but what we want is that before find we will find those documents which are active.

// $ne means not equal to
userSchema.pre(/^find/ , function (next) {

    this.find({active: {$ne : false}});
    next();
});


/////////////////////////////////////////////

// creating model out of the schema
// Where 'User' is the collection name in the database.
const User = mongoose.model('User' , userSchema);

module.exports = User;