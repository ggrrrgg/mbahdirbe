const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { databaseConnect } = require('./database');

// Number of rounds to perform for bcrypt hashing
const saltRounds = 10;


async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
  }


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
        "password": await hashPassword("1amadmin"),
        "admin": true
    });

     await adminAdmin.save().then(() => {
        console.log('admin Seeded')
    });

// seed business

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
    })

});