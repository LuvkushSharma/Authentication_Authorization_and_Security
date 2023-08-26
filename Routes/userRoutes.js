const express = require('express');
const path = require('path');

const userController = require(path.join(
  __dirname,
  "../Controllers/userController.js"
));


const authController = require(path.join(
  __dirname,
  "../Controllers/authController"
));


const router = express.Router();

// -------- Lec_2  rest part -------
// We are using post method as user is creating i.e. all the user's information should be stored in the database.

/*

req.body :---->

{

  "name" : "Luvkush",
  "email" : "hello@gmail.com",
  "password" : "pass1234",
  "passwordConfirm" : "pass1234"

}

*/

router.route('/signup').post(authController.signUp);

router.route('/login').post(authController.login);

//////////////////////


// ------> Lec_10 -----

router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/resetPassword/:token').patch(authController.resetPassword);


// ------> Lec_13 -------

// ---- only for logged in user i.e. protected route will be applied to this functionality

router.route('/updateMyPassword').patch(authController.protect , authController.updatePassword)


/////////////////////////////

// ------------ Lec_14 ----------

router.route('/updateMe').patch(authController.protect , userController.updateMe);


///////////////////////////

// ------> Lec_15 -------

// ---- only for logged in user i.e. protected route will be applied to this functionality

//  we will not actually delete a user from the database.

router.route('/deleteMe').delete(authController.protect , authController.deleteMe)


/////////////////////////////

// Below routes can be helpful to the system administrator for getting users ,...

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;  