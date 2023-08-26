// ------ Lec_6 -----

const path = require('path');
const User = require(path.join (__dirname , './../models/userModel'));

exports.getAllUsers = async (req, res) => {

    try {
        
      const users = await User.find();

      res.status(200).json ({

         status : 'success',
         results: users.length,
         data: {
          users
         }
      })

    } catch {

      res.status(404).json({
        status: 'fail',
        message: 'No user found !'
      });
    }

  };

//////////////////////////////////////////////

// ------------- Lec_14 ----------------

const AppError = require('../utils/appError');

const filterObj = (obj , ...allowedFields) => {

     const newObj = {};
    
    // Looping on all the fields that are basically in the document

    // i.e. checking each field whether it is allowed or not.
    Object.keys(obj).forEach(el => {

       if (allowedFields.includes(el)) newObj[el] = obj[el];

    });

    return newObj;
}

exports.updateMe = async (req , res, next) => {

    // 1️⃣) Create error if user POSTs password data as we had created a separate handler for that in the authController.js

    if (req.body.password || req.body.passwordConfirm) {

       return next (new AppError ('This route is not for password updates. Please use /updateMyPassword' , 400));

    }
    
    // 2️⃣) Filtered out unwanted field names that are not allowed be updated.

    // Since , we are not dealing with the password i.e. sensitive data i.e. we can directly update the data by using findById AndUpdate()

    // {new : true} so, that it returns the new object instead of old one.

    // We are passing 'x' instead of req.body as let's say if user wants to update his role he/she will directly updates his/her role by 

    // "role" : "admin"
    // Also they can update the Token i.e. we are just passing x and x contains the object which only updates the User name and User email

    // So, basically we want to filter the body so, that user will only be able to update the user name and user email.

    // So, if user tries to update the role then filter method filters out and it never find it in the database.

    // const updatedUser = await User.findByIdAndUpdate(req.user.id , x , {
      
    //   new : true , 
    //   runValidators : true
      
    // });
    
    // For , now we are allowing the user to update the name and email and later we can allow the usre to  update the uploaded photo.

    // Also implement this function i.e. filterObj just above this handler.
    const filteredBody = filterObj(req.body , 'name' , 'email');


    // 3️⃣) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , {
      
      new : true , 
      runValidators : true
      
    });


    res.status(200).json ({

       status : 'success',
       data : {

          user: updatedUser
       }

    });
}


/////////////////////////////////////////////

exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };

exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };

exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
};
  