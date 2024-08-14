const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomsController'); 
const { verifyRoles } = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../../config/roles_list'); 

// router.post('/', verifyRoles(ROLES_LIST.Admin), roomController.createRoom); 
// router.get('/', roomController.getRooms); 
// router.get('/:number', roomController.getRoom);
// router.put('/', verifyRoles(ROLES_LIST.Admin), roomController.updateRoom); 
// router.delete('/:number', verifyRoles(ROLES_LIST.Admin), roomController.deleteRoom);  

router.post('/', roomController.createRoom); 
router.get('/', roomController.getRooms); 
router.get('/:number', roomController.getRoom);
router.put('/', roomController.updateRoom); 
router.delete('/:number', roomController.deleteRoom);  


module.exports = router;