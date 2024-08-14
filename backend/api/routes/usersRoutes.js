const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController'); 
const { verifyRoles } = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../../config/roles_list'); 

router.post('/authenticate', userController.authenticateUser);
router.post('/', userController.createUser);       
router.get('/:user', verifyRoles(ROLES_LIST.Admin), userController.getUserDetails);        
router.post('/privilege', verifyRoles(ROLES_LIST.Admin), userController.changeUserPrivilege);
router.get('/verify', userController.verifyUser);      

module.exports = router; 