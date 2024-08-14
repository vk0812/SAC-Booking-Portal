const express = require('express');
const router = express.Router(); 
const bookingController = require('../controllers/bookingController');

const { verifyRoles } = require('../middlewares/verifyRoles'); 
const ROLES_LIST = require('../../config/roles_list');

router.post('/', verifyRoles(ROLES_LIST.User), bookingController.createBooking);
router.get('/:id', verifyRoles(ROLES_LIST.User), bookingController.getBooking); 
router.patch('/:id/status', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Moderator), bookingController.changeBookingStatus); 
router.delete('/:id', verifyRoles(ROLES_LIST.User), bookingController.deleteBooking); 
router.patch('/conflict', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Moderator), bookingController.resolveConflict); 

module.exports = router; 