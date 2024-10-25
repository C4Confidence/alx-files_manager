// routes/index.js
const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', FilesController.postUpload);  // New endpoint for file upload
router.get('/files/:id', FilesController.getShow);   // New endpoint for retrieving a file by ID
router.get('/files', FilesController.getIndex);       // New endpoint for retrieving files with pagination

module.exports = router;
