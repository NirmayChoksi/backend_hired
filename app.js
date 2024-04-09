const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const userRoutes = require("./routes/user");
const testimonialRoutes = require("./routes/testimonial");
const jobPostRoutes = require("./routes/job-post");
const chatRoutes = require("./routes/chats");

const app = express();

// Connect to MongoDB using environment variables
mongoose
  .connect(
    `mongodb+srv://niru2002:${process.env.MONGOKEY}@cluster0.fgecezi.mongodb.net/hired?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

// Middleware for parsing requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for CORS
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/job-post", jobPostRoutes);
app.use("/api/chats", chatRoutes);

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
