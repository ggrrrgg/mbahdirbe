// import the server package 
const express = require('express');
const app = express();

// import cors
const cors = require('cors');

// set cors to allow access from any origin
const corsOptions = {
  origin: "*", 
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// import dotenv
require('dotenv').config();


const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

// const UserRouter = require('./controllers/UserController');
// app.use('/users', UserRouter);