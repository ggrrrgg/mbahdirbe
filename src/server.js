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


const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

const BusinessRouter = require('./controllers/BusinessController');
app.use('/business', BusinessRouter);

const CategoryRouter = require('./controllers/CategoryController');
app.use('/category', CategoryRouter);

const UserRouter = require('./controllers/UserController');
app.use('/users', UserRouter);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

// test message to see the api is running
app.get("/", (request, response) => {

	response.send("Hello world, this server is hello!");

});

module.exports = {
	app,
	HOST,
	PORT
}

