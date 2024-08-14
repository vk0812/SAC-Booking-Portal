const asyncHandler = require("express-async-handler");
const Booking = require('../models/bookingsModel');
const Room = require('../models/roomsModel'); 
const User = require('../models/usersModel'); 
const createBookingSchema = require('../schemas/createBooking'); 
const moment = require('moment-timezone');
const rp = require('request-promise'); 

const { 
  verifyBookingExists, 
  checkForConflictedBooking, 
  checkIfBookingFinished,
  checkRoomExists,
  checkPrivileges
} = require('../utils/bookingFunctions'); 

const TZ = 'Asia/Kolkata';

// Create a new booking
const createBooking = asyncHandler(async (req, res) => { 
  try {
    await checkRoomExists(req, res);

    const { error } = createBookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message }); 
    }

    const booking = new Booking({
      from: moment(req.body.from).tz(TZ),
      to: moment(req.body.to).tz(TZ),
      room: req.body.room,
      user_id: req.user.id, 
      status: 'Pending Approval',
      councilName: req.body.councilName,
      fullName: req.body.fullName,
      contactNumber: req.body.contactNumber,
      purposeOfBooking: req.body.purposeOfBooking,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created', booking }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// Get a specific booking 
const getBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await checkPrivileges(req, res, booking); 

    res.json(booking);

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
});

// Update a booking's status
const changeBookingStatus = asyncHandler(async (req, res) => { 
  try {
    await checkIfBookingFinished(req, res); 
    const booking = await verifyBookingExists(req, res); 
    await checkForConflictedBooking(req, res); 

    booking.status = req.body.status;
    await booking.save();

    // ... Optional: Send email notification using rp or another library 

    res.json({ 
      message: `Booking ${req.body.status}`,
      booking: { status: req.body.status } 
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
});

// Delete a booking
const deleteBooking = asyncHandler(async (req, res) => { 
  try {
    await checkIfBookingFinished(req, res);
    const booking = await checkPrivileges(req, res); 
    await booking.deleteOne(); 

    res.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
});

// Resolve booking conflicts 
const resolveConflict = asyncHandler(async (req, res) => {
  try {
    const { approveId, rejectId } = req.body;

    await Promise.all([
      Booking.updateOne({ _id: approveId }, { status: 'Approved' }),
      Booking.updateOne({ _id: rejectId }, { status: 'Rejected' })
    ]);

    res.json({ message: 'Conflict resolved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to resolve conflict', error: error.message });
  }
});

module.exports = {
  createBooking,
  getBooking,
  changeBookingStatus,
  deleteBooking,
  resolveConflict,
};