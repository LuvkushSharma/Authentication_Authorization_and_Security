// ------------------ Lec_2 --------------

/*

const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    
    // const newUser = await User.create(req.body);
    
    const newUser = await User.create({

        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm

    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });


  } catch (err) {

    res.status(404).json({
      status: "fail",
      message: err,
    });

  }
};

// Now , go to the userRoute.js

*/

///////////////////////////////////////////////////////////////////

// -------------- Lec_5 ---------------

// Part_1 of Lec_5

/*

const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    
    // By this a serious security flaw can occur as anyone can login as admin and modified the data
    // const newUser = await User.create(req.body);
    
    // By this new code we only allow the data that we actually need to be put into the new user so, just the
    // name, the E-mail and then the passwords. And now , even if the user tries to manually input a role, we will not store that into the new user and the same for other stuff like for a photo

    // So, now we can actually no longer register as an admin and so if we need to add a new administrator to our system we can then very simply just create a new user normally and then go into MongoDB compass and basically edit that role in there.
    const newUser = await User.create({

        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm

    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });


  } catch (err) {

    res.status(404).json({
      status: "fail",
      message: err,
    });

  }
};

*/

// Part_2 of Lec_5

// Signing Up Users

// Usually when we signup to any web application then you also get automatically logged in.
// So, logged the user in as soon as he/she signUp

// npm i jsonwebtoken

// After creating the TOKEN we have to pass the TOKEN to the user.

/*

const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));
const jwt = require('jsonwebtoken');

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    
    const newUser = await User.create({

        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm

    });
    
    // 1st arg is the PAYLOAD : and we will pass the id of the user , not a lot of data we will pass.
    // in MongoDB we can access the id of the user by ._id

    // 2nd arg we will pass the secret
    // So, first save the secret in the config.env file.

    // Next , we can also pass some options like when the JWT token should expires.
    // So, define JWT Expiring time in the config.env file
    const token = jwt.sign({id : newUser._id} , process.env.JWT_SECRET , {
        
        // This will add additional data to the payload.
        expiresIn : process.env.JWT_EXPIRES_IN
    });

    

    res.status(201).json({
      status: "success",
      token, // <--------- passing JWT TOKEN
      data: {
        user: newUser,
      },
    });


  } catch (err) {

    res.status(404).json({
      status: "fail",
      message: err,
    });

  }
};

*/

///////////////////////////////////////////////

// -------------- Lec_6 --------------

// Logging In User

/*

const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));
const jwt = require('jsonwebtoken');

const AppError = require(path.join (__dirname , './../utils/appError'));

const signToken = (id) => {

   return jwt.sign({id} , process.env.JWT_SECRET , {
        
    expiresIn : process.env.JWT_EXPIRES_IN
});
}

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    
    const newUser = await User.create({

        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm

    });
    
    const token = signToken (newUser._id);

    res.status(201).json({
      status: "success",
      token, 
      data: {
        user: newUser,
      },
    });


  } catch (err) {

    res.status(404).json({
      status: "fail",
      message: err,
    });

  }
};


// ------------ Lec_6 --------------

// Implement the route for the login in the userRoute.js in Routes folder.

// ⚠️ Note :

// (select: false) in the userModel.js corresponding to the password.

// Since , we are getting the password in res.json() after creating the user and this is not a good practise.

// So, now create a getAllUsers function in the userControllers to get all the users.

// And we had used the find() method to find all the users and we can see that after going to that route i.e.

// 127.0.0.1/api/v1/users

// it is not showing the password in the res.json() which means we have to use the find method not findById

exports.login = async (req , res , next) => {

    try {

       // const email = req.body.email;
    // const password = req.body.password;

    // Using ES6 destructuring
    const {email , password} = req.body;

    // 1️⃣ Check if email and password exists
    if (!email || !password) {

        return next (new AppError ('Please provide email and password! 💥' , 400));
    }

    // 2️⃣ Check if user exists && password is correct

    // Finding user based on the email as a filter not by the id this time.
    // const user = User.findOne({email: email});

    // In ES6 if key and value are same then write anyone of them
    // const user = User.findOne({email});
    
    // select('+..) ---> here '+' means include
    const user = await User.findOne({email}).select('+password');

    // Now , for verifying the password just go to the userModel.js and create a function there

    // if user not exists then it simply return the Error. And if , if user exists then we also see whether the password is also correct or not.
  
    if (!user ||
      !await  user.correctPassword (password , user.password)
    ) {

       return next (new AppError ('Incorrect Email or Password' , 401));
    }


    // 3️⃣ If everything ok, send token to client.
    const token = signToken (user._id);

    res.status(200).json({

       status: 'success',
       token
    })

    } catch {

         res.status(404).json ({
            
             status : 'fail',
             message : 'Invalid credentials for login !'
         })
    }
}

*/

////////////////////////////////////////////////

// -------------- Lec_7 -------------

/*

const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));
const jwt = require("jsonwebtoken");

// Since jwt.verify returns a promise so , we will make the function promisify by using the node built-in util library that contains the promisify
const {promisify} = require('util');

const AppError = require(path.join(__dirname, "./../utils/appError"));

const signToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

};

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,

    });

    console.log(req.body.role);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Using ES6 destructuring
    const { email, password } = req.body;

    // 1️⃣ Check if email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password! 💥", 400));
    }

    // 2️⃣ Check if user exists && password is correct

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {

      return next(new AppError("Incorrect Email or Password", 401));

    }

    // 3️⃣ If everything ok, send token to client.
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });

  } catch {
    res.status(404).json({
      status: "fail",
      message: "Invalid credentials for login !",
    });
  }
};


// ---------- Lec_7 ----------

// Go to the tourRoutes.js and protect the route

//  authorization: 'Bearer place_token_here',
//  'content-type': 'application/json',
//  'user-agent': 'PostmanRuntime/7.32.3',

exports.protect = async (req , res , next) => {

    try {
  
      // 1️⃣ : Getting token and check if it's there

      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];

      }
      
      // their is no token
      if (!token) {

        return next(new AppError ('You are not loggen in! Please login to get access' , 401));
        
      }

      // 2️⃣ Verification of the token 

         // Change the authorization value in the header with the real token

         // Till now , jwt is returning the promises and we are handling that using await.
         // but , jwt.verify donot returns promise i.e. we will promisify it so, that it can return promise.
        const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);


        // We can get errors from JWT i.e. handling errors in the errorController.js

      // 3️⃣ User which is trying to access the route still exists or not.

      // Patah chale user delete ho gaya but token kaa time abhi bhi bacha thaa then user ke jaane ke baad bhi uski details koi access karna chahega then we will give this error
      const currentUser = await User.findById (decoded.id);

      if (!currentUser) {

        return next(new AppError ('The user belonging to this token does no longer exists.' , 401));
      }


      // 4️⃣ Check if user changed password after the token was issued.

      // create a instance method in the userModel.js

      console.log(decoded);

      if (currentUser.changePasswordAfter(decoded.iat)) {

         return next (new AppError ('User recently changed password! Please log in again.' , 401));
      }

      
      
      // If everything goes well then we will go the next middleware
      
      req.user = currentUser;
      next();

    } catch {

       res.status(401).json ({

           status: 'fail',
           message : 'You are not authenticated'
       })
    }
};

*/

///////////////////////////////////////////////

// ------------- Lec_9 ---------------

// User Roles


const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));
const jwt = require("jsonwebtoken");

const {promisify} = require('util');

const AppError = require(path.join(__dirname, "./../utils/appError"));

const signToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

};

// Creating a new User
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({

      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role
      
    });

    console.log(req.body.role);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Using ES6 destructuring
    const { email, password } = req.body;

    // 1️⃣ Check if email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password! 💥", 400));
    }

  
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {

      return next(new AppError("Incorrect Email or Password", 401));

    }

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data : user
    });

  } catch {
    res.status(404).json({
      status: "fail",
      message: "Invalid credentials for login !",
    });
  }
};


exports.protect = async (req , res , next) => {

    try {
  
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];

      }
      
      // their is no token
      if (!token) {

        return next(new AppError ('You are not loggen in! Please login to get access' , 401));
        
      }


      const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

      const currentUser = await User.findById (decoded.id);

      if (!currentUser) {

        return next(new AppError ('The user belonging to this token does not longer exists.' , 401));
      }

      if (currentUser.changePasswordAfter(decoded.iat)) {

         return next (new AppError ('User recently changed password! Please log in again.' , 401));
      }

      req.user = currentUser;
      next();

    } catch {

       res.status(401).json ({

           status: 'fail',
           message : 'You are not authenticated'
       })
    }
};


// -----> Lec_9

// Since , middleware function donot accepts arguments i.e. we will take the arguments in the simple function and returning the middleware.

// ⚠️ NOTE :
// Since , above middleware i.e. protect middleware will run first and it will create 

// req.user in the req object. Which we will use to access the role of the user in the below middleware.

exports.restrictTo = (...roles) => {
    
    // Now this is able to access the roles
    // due to closure property
    return (req , res , next) => {

        // roles ['admin' , 'lead-guide']
        // so, if role = 'user' then user does not have permission.
        
        // req.user was created in above middleware i.e. protect function.
        if (!roles.includes(req.user.role)) {

          return next (new AppError ('You donot have permission to perform this action' , 403));

        }

        next();
    }
}


///////////////////////////////////////////////

// ----------- Lec_10 -------------

// Password Reset Functionality

/*


exports.forgotPassword = async (req , res , next) => {
     
  try {

     // 1️⃣ ) Get user based on Posted email
     const user = await User.findOne({email: req.body.email});

     if (!user) {

       return next (new AppError ('There is no user with this email address.' , 404));

     }

     // 2️⃣ ) Generate the random reset token

     // go to the userModel.js for step-2 implementation

     const resetToken = user.createPasswordResetToken ();
     
     // It will deactivate all the validators as we will pass the email but according to the User's schema we have to pass the password and confirm password and many more required field i.e. deactivating validators
     
     await user.save({validateBeforeSave : false});
     
     // 3️⃣ ) Send it to user's email


  } catch {

       res.status(404).json ({

          status: 'fail',
          message: 'Try again to reset the password !'
       })
  }

}

exports.resetPassword = (req , res , next) => {


}

*/

///////////////////////////////////////////////

// ----------------- Lec_11 -------------

const sendEmail = require(path.join(__dirname , './../utils/email'));


exports.forgotPassword = async (req , res , next) => {
     
  try {

     // 1️⃣ ) Get user based on Posted email
     const user = await User.findOne({email: req.body.email});

     if (!user) {

         return next (new AppError ('There is no user with email address.' , 404));
     }

     // 2️⃣ ) Generate the random reset token

     // go to the userModel.js for step-2 implementation

     const resetToken = user.createPasswordResetToken ();
     
     await user.save({validateBeforeSave : false});
     
     // --------- Lec_11 ------------
     // 3️⃣ ) Send it to user's email
     const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

     const message = `Forgot your password ? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

     
     try {

         await sendEmail ({

           email: user.email,
           subject: 'Your password reset token (valid for 10 min)',
           message
        });

        res.status(200).json({

           status: 'success',
           message: 'Token send to email'
        
        });
        
     } catch (err){

        User.createPasswordResetToken = undefined,

        user.passwordResetExpires = undefined;

        await user.save({validateBeforeSave : false});

        return next (new AppError ('There was an error sending the email. Try again later!') , 500);
     }


  } catch {

       res.status(404).json ({

          status: 'fail',
          message: 'Try again to reset the password !'
       })
  }

}

// Create it's route in the userRoute.js  and request in the POSTMAN

// ------------ Lec_12 ---------------

// used for hashing or encrypting the token
const crypto = require('crypto')

exports.resetPassword = async (req , res , next) => {

    try {

      // 1️⃣) Get user based on the token
    
    // Encrypting the plain token sended on the URL so, that we can compare it with the encrypted token in the database to get the User.

    // Since , we had specified the token as the parameter in the URL 👍
    // /resetPassword/:id
    const hashedToken = crypto
    .createHash ('sha256')
    .update(req.params.token)
    .digest('hex');
    
    // finding the user with the help of Token
    // const user = await User.findOne({passwordResetToken : hashedToken})

    // -----> checking whether the token has expired or not.
    // i.e. passwordResetExpires time > current time it means token is valid now.
    const user = await User.findOne({passwordResetToken : hashedToken , passwordResetExpires : {$gt: Date.now()}});

    // 2️⃣) If token has not expired, and there is user, set the new password

    // No user exists
    if (!user) {

      return next (new AppError ('Token is invalid or has expired') , 400);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // above working just modified the user but not saved that into database. And , for saving we'll use user.save()
    await user.save();

    // 3) Update changePasswordAt property for the user

    // For , this go to the userModel.js



    // 4) Log the user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });

    } catch (err) {

        console.log(err);

        res.status(500).json ({

           status : 'fail',
           message : 'Try again to reset the password !'
        });
    }
}


///////////////////////////////////////////////

// ------------ Lec_13 ----------------

// This password reset functionality is only for the loggen-in user but still we need the user to pass  in his current password. So, inorder to confirm that user actually is who he says he is.

exports.updatePassword = async (req , res , next) => {
    
   try {


    // 1️⃣) Get the user from the collection
  
    // we are getting req.user.id from the protect middleware.

    // We are using findById not findByIdAndUpdate becoz we want all the validators to run and if all are correct then only we will update the user. i.e. we are not directly updating the user.
    const user = await User.findById(req.user.id).select('+password');

    // 2️⃣) Check if Posted current password is correct

    if (!(await user.correctPassword(req.body.passwordCurrent , user.password))) {

       return next (new AppError ('Your current password is wrong.' , 401));
    }
  
  
    // 3️⃣) If so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    
    // We want to check the validation i.e. we didn't pass the validation off property in the user.save()
    await user.save();

  
    // 4️⃣) Log the user in , send JWT

    // You can also create a separate function for this below code as we used the same code fourth time.
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
    

   } catch (err) {

    console.log(err);

    res.status(500).json ({

       status : 'fail',
       message : 'Try again to reset the password !'
    })
       
   }
}

///////////////////////////////////////////////

// ----------- Lec_15 -------------

exports.deleteMe = async (req , res , next) => {
   
   try {

    // As , before this middleware protect middleware runs i.e. we are able to access req.user.id

    // And setting active as false.
    await User.findByIdAndUpdate(req.user.id , {active: false});

    res.status(204).json ({

      status: 'success',
      data: null

    });


   } catch (err) {

      res.status(400).json ({

          status : 'fail',
          message : err
      })
   }
}


