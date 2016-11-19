var express = require("express");
var bodyParser = require('body-parser');
var contactForm = require('../controllers/contactForm.js');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/contact', contactForm.handleContactSubmit);

module.exports = router;