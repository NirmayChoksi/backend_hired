const { Testimonial } = require("../models/testimonial");

exports.createTestimonial = async (req, res) => {
  try {
    const { rating, feedback, companyId, clientId } = req.body;

    if (!rating || !feedback || !companyId || !clientId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const testimonial = new Testimonial({
      rating,
      feedback,
      companyId,
      clientId,
      testimonialDate: new Date(),
    });

    const result = await testimonial.save();

    if (!result) return res.json("Error creating testimonial");

    return res.json("Testimonial successfully created");
  } catch (error) {
    console.error(error);
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const testimonials = await Testimonial.find({ companyId }).populate(
      "clientId"
    );

    const transformedTestimonials = testimonials.map((testimonial) => {
      return transformTestimonialData(testimonial);
    });

    res.json(transformedTestimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

const transformTestimonialData = (testimonial) => {
  return {
    rating: testimonial.rating,
    feedback: testimonial.feedback,
    testimonialDate: testimonial.testimonialDate,
    clientName: `${testimonial.clientId.firstName} ${testimonial.clientId.lastName}`,
  };
};
