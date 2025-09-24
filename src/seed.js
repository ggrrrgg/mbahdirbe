const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const { databaseConnect } = require('./database');

// Number of rounds to perform for bcrypt hashing
const saltRounds = 10;


// async function hashPassword(password) {
//     return await bcrypt.hash(password, saltRounds);
//   }


databaseConnect().then(async () => {
    console.log('Seeding DB');

    const { User } = require('./models/UserModel');
    const { Business } = require('./models/BusinessModel');
    const { Category } = require('./models/CategoryModel');


// admin user

let adminAdmin = new User({
        "firstName": "Admin",
        "lastName": "Admin",
        "businessName": "MbahBD",
        "email": "admin@mbahbd.com",
        "password": "1amadmin",
        "admin": true
    });

     await adminAdmin.save().then(() => {
        console.log('admin Seeded')
    });
let hiHiBiz = new User({
        "firstName": "hi",
        "lastName": "hi",
        "businessName": "hiBiz",
        "email": "hi@hi.com",
        "password": "12345678",
        "admin": false
    });

     await hiHiBiz.save().then(() => {
        console.log('hiHiBiz Seeded')
    });

    // seed Categories

let cafeRestaurant = new Category({
        "name": "Cafes & Restaurants",
        "description": "Cafes & places to eat around town"
});
    await cafeRestaurant.save().then(() => {
        console.log('cafeRestaurant Seeded')
    });

let tradies = new Category({
        "name": "Tradies",
        "description": "local tradies"
});
    await tradies.save().then(() => {
        console.log('tradies Seeded')
    });

// seed business

let hiBiz = new Business({
    "businessName": "hiBiz",
    "description": "new biz",
    "images":"",
    "email":"hi@biz.com",
    "telephone": "0459345678",
    "website":"",
    "address":"3 murwillumbah st",
    "user": hiHiBiz._id,
    "category": cafeRestaurant._id
});
await hiBiz.save().then(() => {
    console.log('hiBiz Seeded')
})



});