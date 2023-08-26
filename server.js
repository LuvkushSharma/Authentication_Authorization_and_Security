const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });


// Replacing the <PASSWORD> placeholder by DATABASE_PASSWORD in the connection string.
const DB = process.env.DATABASE.replace(
     '<PASSWORD>',
     process.env.DATABASE_PASSWORD
);

// ------------------ HOSTED DATABASE -----------------
// It returns a promise

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successful');
  })
  .catch((err) => console.log(err));   

// For testing API's on POSTMAN
const port = 3000;

// Listening to the server
app.listen(port , () => {

     console.log(`Server is listening at : 127.0.0.1:${port}`);
})