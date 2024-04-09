const express = require("express");

const checkAuth = require("../middleware/check-auth");
const testimonialController = require("../controllers/testimonial");

const router = express.Router();

router.post("/post",checkAuth, testimonialController.createTestimonial);

router.get("/:companyId",  testimonialController.getTestimonials);

module.exports = router;
