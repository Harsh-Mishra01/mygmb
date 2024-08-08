const express = require("express");
const router = express.Router();
const { getSpecificDocData } = require("../../controllers/care/GetSpecificDocData.js");

// Define a route to get specific doctor data
router.get("/specificDocData", getSpecificDocData);

module.exports = router;
