const express = require('express');
const router = express.Router();

const { Business } = require('../models/BusinessModel');
const { authenticate } = require('../functions');


// GET route for all businesses for businesses display page visible to anyone
// localhost:3000/equipment/all
router.get('/all', async (request, response) => {
    const business = await Business.find({});
    
    if (!business) {
    return response.status(400).json({ message: "No businesses found" });
  }

  response.json(business);
});


// POST route to add new business for ADMIN only
// localhost:3000/business/add-new
router.post('/add-new', authenticate, async (request, response) => {
    // check if user is admin
    if (!request.user.admin) {
        return response.status(403).json({ message: "Unauthorized" });
      }
    // check if business already exists
      const existingBusiness = await Business.findOne({ itemName: request.body.itemName });
      if (existingBusiness) {
        return response.status(400)
          .json({ message: "A business with this name already exists" });
      }
      
      // define new equipment object
      const newBusiness = new Equipment({ 
        businessName: request.body.businessName,
        description: request.body.description,
        images: request.body.images,
        telephone: request.body.telephone,
        website: request.body.website,
        email: request.body.email,
        address: request.body.address
        
      });
    
      try {
        const savedBusiness = await newBusiness.save();
        response.status(201).json(savedBusiness);
      } catch (error) {
        console.error(error);
        response.status(500).json({ message: "An error occurred while trying to save the entry" });
      };
});


// PATCH route to update business details, ADMIN only
// localhost:3000/business/update/id
router.patch('/update/:id', authenticate, async (request, response) => {
  // check if user is admin
  if (!request.user.admin) {
    return response.status(403).json({ message: "Unauthorized" });
  }
  // define new object and update with request body data
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      request.params.id,
      {businessName: request.body.businessName,
        description: request.body.description,
        images: request.body.images,
        telephone: request.body.telephone,
        website: request.body.website,
        email: request.body.email,
        address: request.body.address},
        
      { new: true }
    );

    if (!updatedBusiness) {
      return response.status(404).json({ message: "Business not found" });
    }

    response.json(updatedBusiness);
  } catch (error) {
    console.error(error);
    response.status(500)
      .json({ message: "An error occurred while trying to update the entry" });
  }
});


// DELETE route to remove business, ADMIN only
// localhost:3000/business/delete/id
router.delete('/delete/:id', authenticate, async (request, response) => {
  // check if user is admin
  if (!request.user.admin) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  try {
    // find business by id
    const businessToDelete = await Business.findById(request.params.id);

    if (!businessToDelete) {
      return response.status(404).json({ message: "Business not found"})
    }

    // delete the business
    await Business.findByIdAndDelete( request.params.id );

    response.json({ message: 'Business has been deleted successfully'});

  } catch(error) {
    console.error(error);
    response.status(500).json({message: 'An error occurred whilst trying to delete the entry'});
  }
});

module.exports = router;