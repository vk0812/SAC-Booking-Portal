const asyncHandler = require("express-async-handler");
const Room = require('../models/roomsModel'); 
const createRoomSchema = require('../schemas/createRoom'); 
const Booking = require('../models/bookingsModel'); 

const {
  verifyUniqueRoom,
  checkRoomExists 
} = require('../utils/roomFunctions');

// Create a new room (requires admin privileges)
const createRoom = asyncHandler(async (req, res) => {
  try {
    await verifyUniqueRoom(req, res); 

    const { error } = createRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message }); 
    }

    const room = new Room({
      number: req.body.number,
      name: req.body.name,
    });

    await room.save();
    res.status(201).json({ message: 'Room successfully created', room }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
});

// Get a list of all rooms 
const getRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.find().select('-__v').sort('number');
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
});

// Get details of a specific room by its number
const getRoom = asyncHandler(async (req, res) => {
  try {
    const room = await checkRoomExists(req, res); // Assuming this function throws an error if not found
    res.json(room); 
  } catch (error) {
    console.error(error);
    // Error handling should already be done in checkRoomExists 
  }
});

// Update a room's details (requires admin privileges)
const updateRoom = asyncHandler(async (req, res) => {
  try {
    const room = await Room.findById(req.body._id); 

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the new room number already exists
    if (req.body.number && req.body.number !== room.number) {
      await verifyUniqueRoom(req, res); 
    }

    // Update room properties
    room.number = req.body.number || room.number; 
    room.name = req.body.name || room.name;

    await room.save();
    res.json({ message: 'Successfully updated', room  }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update room', error: error.message });
  }
});


// Delete a room by its number (requires admin privileges)
const deleteRoom = asyncHandler(async (req, res) => {
  try {
    const room = await checkRoomExists(req, res); 
    
    await Booking.deleteMany({ room: room._id }); // Delete associated bookings
    await room.deleteOne();

    res.json({ message: `${room.number} - ${room.name} deleted` });

  } catch (error) {
    console.error(error);
    // Error handling likely already done in checkRoomExists
  }
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom
};