const express = require('express');
const router = express.Router();

const { Business } = require('../models/BusinessModel');
const { Category } = require('../models/CategoryModel');
const { authenticate } = require('../functions');


// =====================
// PUBLIC ROUTES
// =====================

// GET all businesses
router.get('/all', async (req, res) => {
  try {
    const businesses = await Business.find().populate("category");
    if (!businesses.length) {
      return res.status(404).json({ message: "No businesses found" });
    }
    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching businesses" });
  }
});


// =====================
// ADMIN ROUTES
// =====================

// POST new business (admin)
router.post('/add-new', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: "Unauthorized" });

  try {
    const existingBusiness = await Business.findOne({ businessName: req.body.businessName });
    if (existingBusiness) return res.status(400).json({ message: "A business with this name already exists" });

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid category ID" });

    const newBusiness = new Business({ 
      businessName: req.body.businessName,
      description: req.body.description,
      images: req.body.images,
      telephone: req.body.telephone,
      website: req.body.website,
      email: req.body.email,
      address: req.body.address,
      user: req.user._id,
      category: category._id
    });

    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating business" });
  }
});

// PATCH existing business (admin)
router.patch('/update/:id', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: "Unauthorized" });

  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    let categoryId = business.category;
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ message: "Invalid category ID" });
      categoryId = category._id;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      {
        businessName: req.body.businessName,
        description: req.body.description,
        images: req.body.images,
        telephone: req.body.telephone,
        website: req.body.website,
        email: req.body.email,
        address: req.body.address,
        user: req.user._id,
        category: categoryId
      },
      { new: true }
    );

    res.json(updatedBusiness);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating business" });
  }
});

// DELETE business (admin)
router.delete('/delete/:id', authenticate, async (req, res) => {
  if (!req.user.admin) return res.status(403).json({ message: "Unauthorized" });

  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    await business.deleteOne();
    res.json({ message: "Business deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting business" });
  }
});


// =====================
// USER ROUTES
// =====================

// GET user's own business
router.get('/my-business', authenticate, async (req, res) => {
  try {
    const myBusiness = await Business.findOne({ user: req.user._id }).populate("category");
    if (!myBusiness) return res.status(404).json({ message: "You have not created a business yet" });

    res.json(myBusiness);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching your business" });
  }
});

// POST user's own business
router.post('/my-business/add', authenticate, async (req, res) => {
  try {
    const existingBusiness = await Business.findOne({ user: req.user._id });
    if (existingBusiness) return res.status(400).json({ message: "You already have a business listed" });

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid category ID" });

    const newBusiness = new Business({
      businessName: req.body.businessName,
      description: req.body.description,
      images: req.body.images,
      telephone: req.body.telephone,
      website: req.body.website,
      email: req.body.email,
      address: req.body.address,
      user: req.user._id,
      category: category._id
    });

    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating business" });
  }
});

// PATCH user's own business
router.patch('/my-business/update/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    if (business.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    let categoryId = business.category;
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ message: "Invalid category ID" });
      categoryId = category._id;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      {
        businessName: req.body.businessName,
        description: req.body.description,
        images: req.body.images,
        telephone: req.body.telephone,
        website: req.body.website,
        email: req.body.email,
        address: req.body.address,
        user: req.user._id,
        category: categoryId
      },
      { new: true }
    );

    res.json(updatedBusiness);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating business" });
  }
});

// DELETE user's own business
router.delete('/my-business/delete/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    if (business.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    await business.deleteOne();
    res.json({ message: "Business deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting business" });
  }
});

module.exports = router;






// const express = require('express');
// const router = express.Router();

// const { Business } = require('../models/BusinessModel');
// const { authenticate } = require('../functions');


// // GET route for all businesses for businesses display page visible to anyone
// // localhost:3000/equipment/all
// router.get('/all', async (request, response) => {
//     const business = await Business.find({});
    
//     if (!business) {
//     return response.status(400).json({ message: "No businesses found" });
//   }

//   response.json(business);
// });


// // POST route to add new business for ADMIN only
// // localhost:3000/business/add-new
// router.post('/add-new', authenticate, async (request, response) => {
//     // check if user is admin
//     if (!request.user.admin) {
//         return response.status(403).json({ message: "Unauthorized" });
//       }
//     // check if business already exists
//       const existingBusiness = await Business.findOne({ businessName: request.body.businessName });
//       if (existingBusiness) {
//         return response.status(400)
//           .json({ message: "A business with this name already exists" });
//       }
      
//       // define new business object
//       const newBusiness = new Business({ 
//         businessName: request.body.businessName,
//         description: request.body.description,
//         images: request.body.images,
//         telephone: request.body.telephone,
//         website: request.body.website,
//         email: request.body.email,
//         address: request.body.address,
//         user: request.user._id,
//         category: request.body.category
        
//       });
    
//       try {
//         const savedBusiness = await newBusiness.save();
//         response.status(201).json(savedBusiness);
//       } catch (error) {
//         console.error(error);
//         response.status(500).json({ message: "An error occurred while trying to save the entry" });
//       };
// });


// // PATCH route to update business details, ADMIN only
// // localhost:3000/business/update/id
// router.patch('/update/:id', authenticate, async (request, response) => {
//   // check if user is admin
//   if (!request.user.admin) {
//     return response.status(403).json({ message: "Unauthorized" });
//   }
//   // define new object and update with request body data
//   try {
//     const updatedBusiness = await Business.findByIdAndUpdate(
//       request.params.id,
//       {businessName: request.body.businessName,
//         description: request.body.description,
//         images: request.body.images,
//         telephone: request.body.telephone,
//         website: request.body.website,
//         email: request.body.email,
//         address: request.body.address,
//         user: request.user._id,
//         category: request.body.category
//      },
        
//       { new: true }
//     );

//     if (!updatedBusiness) {
//       return response.status(404).json({ message: "Business not found" });
//     }

//     response.json(updatedBusiness);
//   } catch (error) {
//     console.error(error);
//     response.status(500)
//       .json({ message: "An error occurred while trying to update the entry" });
//   }
// });


// // DELETE route to remove business, ADMIN only
// // localhost:3000/business/delete/id
// router.delete('/delete/:id', authenticate, async (request, response) => {
//   // check if user is admin
//   if (!request.user.admin) {
//     return response.status(403).json({ message: "Unauthorized" });
//   }

//   try {
//     // find business by id
//     const businessToDelete = await Business.findById(request.params.id);

//     if (!businessToDelete) {
//       return response.status(404).json({ message: "Business not found"})
//     }

//     // delete the business
//     await Business.findByIdAndDelete( request.params.id );

//     response.json({ message: 'Business has been deleted successfully'});

//   } catch(error) {
//     console.error(error);
//     response.status(500).json({message: 'An error occurred whilst trying to delete the entry'});
//   }
// });


// // GET route for a user to fetch their own business
// // localhost:3000/business/my-business
// router.get('/my-business', authenticate, async (request, response) => {
//   try {
//     const userId = request.user._id;

//     const myBusiness = await Business.findOne({ user: userId });

//     if (!myBusiness) {
//       return response.status(404).json({ message: "You have not created a business yet" });
//     }

//     response.json(myBusiness);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ message: "An error occurred while fetching your business" });
//   }
// });


// // POST route for a USER to create a business
// // localhost:3000/business/my-business/add
// router.post('/my-business/add', authenticate, async (request, response) => {
//   try {
//     // Check if this user already has a business (optional, if you only allow one per user)
//     const existingBusiness = await Business.findOne({ user: request.user._id });
//     if (existingBusiness) {
//       return response.status(400).json({ message: "You already have a business listed" });
//     }

//     const newBusiness = new Business({
//       businessName: request.body.businessName,
//       description: request.body.description,
//       images: request.body.images,
//       telephone: request.body.telephone,
//       website: request.body.website,
//       email: request.body.email,
//       address: request.body.address,
//       user: request.user._id,
//       category: request.body.category
//     });

//     const savedBusiness = await newBusiness.save();
//     response.status(201).json(savedBusiness);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ message: "Error creating business" });
//   }
// });


// // PATCH route for a USER to update their own business
// // localhost:3000/business/my-business/update/:id
// router.patch('/my-business/update/:id', authenticate, async (request, response) => {
//   try {
//     const business = await Business.findById(request.params.id);

//     if (!business) {
//       return response.status(404).json({ message: "Business not found" });
//     }

//     // Ensure user owns the business
//     if (business.user.toString() !== request.user._id.toString()) {
//       return response.status(403).json({ message: "Unauthorized" });
//     }

//     const updatedBusiness = await Business.findByIdAndUpdate(
//       request.params.id,
//       {
//         businessName: request.body.businessName,
//         description: request.body.description,
//         images: request.body.images,
//         telephone: request.body.telephone,
//         website: request.body.website,
//         email: request.body.email,
//         address: request.body.address,
//         user: request.user._id,
//         category: request.body.category
//       },
//       { new: true }
//     );

//     response.json(updatedBusiness);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ message: "Error updating business" });
//   }
// });


// // DELETE route for a USER to delete their own business
// // localhost:3000/business/my-business/delete/:id
// router.delete('/my-business/delete/:id', authenticate, async (request, response) => {
//   try {
//     const business = await Business.findById(request.params.id);

//     if (!business) {
//       return response.status(404).json({ message: "Business not found" });
//     }

//     // Ensure user owns the business
//     if (business.user.toString() !== request.user._id.toString()) {
//       return response.status(403).json({ message: "Unauthorized" });
//     }

//     await business.deleteOne();
//     response.json({ message: "Business deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ message: "Error deleting business" });
//   }
// });

// module.exports = router;

