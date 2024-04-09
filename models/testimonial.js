const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema({
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  testimonialDate: { type: Date, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = {
  Testimonial: Testimonial,
};
