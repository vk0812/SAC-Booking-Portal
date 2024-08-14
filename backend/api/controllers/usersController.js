const asyncHandler = require("express-async-handler");
const User = require('../models/usersModel');
const bcrypt = require('bcrypt'); 
const authenticateUserSchema = require('../schemas/authenticateUser');
const createUserSchema = require('../schemas/createUser');

const { 
    verifySSOCode, 
    getUserDetails: getUserDetailsUtil, 
    verifyUniqueUser
} = require('../utils/userFunctions'); 

// Authenticate a user
const authenticateUser = asyncHandler(async (req, res) => {
    try {
        const { error } = authenticateUserSchema.validate(req.body); 
        if (error) {
        return res.status(400).json({ message: error.details[0].message }); 
        }

        const user = await verifySSOCode(req, res); 
        const userDetails = await getUserDetailsUtil(user); 
        res.json(userDetails); 
    } catch (error) {
        console.error(error);
    }
});


// Create a new user 
const createUser = asyncHandler(async (req, res) => {
    try {
        await verifyUniqueUser(req, res); 

        const { error } = createUserSchema.validate(req.body); 
        if (error) {
            return res.status(400).json({ message: error.details[0].message }); 
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            // ... other user properties
        });

        await user.save();
        const userDetails = await getUserDetailsUtil(user); // Get additional user details

        res.status(201).json({ message: 'User created', user: userDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user', error: error.message }); 
    }
});

// Get details of a specific user (admin only)
const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ ldap_username: req.params.user }).lean();

        if (!user) {
        return res.status(404).json({ message: `No user with username ${req.params.user} present` });
        }

        res.json(user); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get user details', error: error.message });
    }
});

// Change user privileges (admin only)
const changeUserPrivilege = asyncHandler(async (req, res) => {
  try {
    const { privilege, ldap_username, value } = req.body; 

    const user = await User.findOne({ ldap_username }); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (privilege === 'admin') {
      user.admin = value; 
    } else if (privilege === 'moderator') {
      user.moderator = value; 
    } else {
      return res.status(400).json({ message: 'Invalid privilege' });
    }

    await user.save();
    res.json({ message: `Changed ${user.ldap_username}'s ${privilege} privilege to ${user[privilege]}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to change user privilege', error: error.message });
  }
});


// Verify a user (This example route just returns a string. You'll need to implement your actual verification logic)
const verifyUser = asyncHandler(async (req, res) => {
    res.send('Verification successful'); 
});


module.exports = {
    authenticateUser,
    createUser,
    getUserDetails,
    changeUserPrivilege,
    verifyUser
};