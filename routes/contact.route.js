const express = require("express");
const router = express.Router();
const { createContactWithAdmin } = require("../controllers/contact.controller");

router.post("/with-admin", createContactWithAdmin);

module.exports = router;
