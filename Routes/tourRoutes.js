const express = require ("express");
const path = require ('path');

const tourController = require(path.join(__dirname , '/../Controllers/tourControllers'));

const router = express.Router();

/*

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

*/

// ------------ Lec_7 ------------

// So , now ----> authController.protect
// middleware will runs first and if the user is logged in then only he/she is allowed to access all the tours.

/*

const authController = require(path.join(__dirname , './../Controllers/authController'));

router
  .route('/')
  .get(authController.protect , tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// again go back to the authController.js for implementing the middleware.  

module.exports = router;  

*/

// --------------- Lec_9 --------------

// User Roles and Permissions

const authController = require(path.join(__dirname , './../Controllers/authController'));

router
  .route('/')
  .get(authController.protect , tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect , 
    authController.restrictTo('admin' , 'lead-guide'),tourController.deleteTour);
  

module.exports = router;  


