const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { User } = require('../models/UserModel');
const { Business } = require('../models/BusinessModel');
// const { Category } = require('../models/CategoryModel')

const { generateJwt, authenticate } = require('../functions');


// GET route to return all users route for admin only
// localhost:3000/users/all
router.get('/all', authenticate, async (request, response) => {
  if (!request.user.admin) {
    return response.status(403).json({ message: 'Unauthorised' });
  }  
  // find all users
  let result = await User.find({});
  if (!result) {
    return response.status(400).json({ message:'No users found' });
  }
  // return as json
    response.json({
        user: result
    });
});


// GET route for current user for user dashboard
// localhost:3000/users/me
router.get('/me', authenticate, async (request, response) => {
  // find user by id
  try {
    const user = await User.findOne({ _id: request.user._id });
    if (!user) {
      return response.status(404).json({ message: "No user found" });
    }
    // return as json
    response.json(user);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message:'An error occurred while fetching user data' });
  }
});


//  POST to route CREATE a user
// localhost3000:users/register-account
router.post('/register-account', async (request, response) => 
  {
    // check if user already exists by email address
    try {
      const existingUser = await User.findOne({ email: request.body.email });
      if (existingUser) {
        return response
          .status(400)
          .json({ message: "A user with this email address already exists" });
      }
      
      // make sure password is at least 8 characters
      const { password } = request.body;
      if (password.length < 8) {
        return response
          .status(400)
          .json({ message: "Password should be at least 8 characters long" });
      }
      // return user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      // define new user object
      const user = new User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        businessName: request.body.businessName,
        email: request.body.email,
        password: hashedPassword,
        admin: request.body.admin,
        
      });
      // save
      const savedUser = await user.save();
      // return as json
      response.json(savedUser);

    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ message: "An error occurred while creating the account." });
    }
  });


//  POST route to LOG IN
// localhost3000:users/login
  router.post("/login", async (request, response) => {
    // find user by email
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }
    // check if encrypted pws match
    const pwMatch = await bcrypt.compare(request.body.password, user.password);
    if (!pwMatch) {
      return response.status(400).json({ message: "Incorrect password" });
    }
    // generate jwt if ok
    let freshJwt = generateJwt(user._id.toString());

	  // respond with the jwt 
	    response.json({
		    jwt: freshJwt
	  });
    router.post("/login", async (request, response) => {
  console.log("Login payload:", request.body); // see what's arriving

  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    console.log("No user found for email:", request.body.email);
    return response.status(400).json({ message: "User not found" });
  }

  const pwMatch = await bcrypt.compare(request.body.password, user.password);
  if (!pwMatch) {
    console.log("Password mismatch for:", request.body.email);
    return response.status(400).json({ message: "Incorrect password" });
  }

  let freshJwt = generateJwt(user._id.toString());
  response.json({ jwt: freshJwt });
});
  });


//  PATCH route to UPDATE the current user
// localhost:3000/update-me
router.patch('/update-me', authenticate, async (request, response) => {
  try {
    // define req body data
    const update = { ...request.body };
    // find by id and update
    let user = await User.findByIdAndUpdate(request.user._id, update, {
      new: true
    })

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    // return json data to client
    response.json(user);
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "An error occurred while updating" });
  }
});


// DELETE route for current user to delete own account and any associated business listing
// localhost:3000/users/delete-me
router.delete("/delete-me", authenticate, async (request, response) => {
  try {
    // Check if the user exists
    if (!request.user || !request.user._id) {
      return response.status(400)
        .json({ message: "No account found" });
    }

     // Delete all businesses owned by this user
    await Business.deleteMany({ owner: req.user._id });

    // Delete the user account
    await User.findByIdAndDelete(req.user._id);
    
    response.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500)
      .json({ message: "An error occurred while trying to delete account" });
  }
});


// DELETE route for admin to delete any user and their businesses
// Usage: DELETE localhost:3000/users/delete/:userId
router.delete("/delete/:userId", authenticate, async (request, response) => {
  try {
    // check if user is admin
    if (!request.user.admin) {
      return response.status(403).json({ message: "Unauthorized" });
    }

    const userId = request.params.userId;

    // find user by id
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return response.status(404).json({ message: "User not found" });
    }

    // delete all businesses owned by this user
    await Business.deleteMany({ user: userId });

    // delete the user
    await userToDelete.deleteOne();

    response.json({ message: "User and associated businesses deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    response.status(500).json({ message: "Server error while deleting user" });
  }
});

module.exports = router;