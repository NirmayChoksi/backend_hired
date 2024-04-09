const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  userType: {
    type: String,
    enum: ["admin", "company", "client", "investor", "jobseeker"],
    required: true,
  },
  industryDetails: { type: [String], required: false },
  emailVerification: { type: Boolean, default: false },
  verificationToken: {
    type: String,
  },
  resetPasswordTokens: {
    type: String,
  },
});

const companySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: { type: String, required: true },
  companyCIN: { type: String, required: true, unique: true },
  companyWebsite: { type: String, required: true, unique: true },
  companyDescription: { type: String, required: true },
  dateOfRegistration: { type: Date, required: true },
  isVerified: { type: Boolean, required: true },
  madePayment: { type: Boolean, required: false },
});

const jobseekerSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  resume: { type: String, required: true },
  resume64: { type: String, required: true },
});

const clientSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const investorSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
companySchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
const Company = mongoose.model("Company", companySchema);
const Jobseeker = mongoose.model("Jobseeker", jobseekerSchema);
const Client = mongoose.model("Client", clientSchema);
const Investor = mongoose.model("Investor", investorSchema);

module.exports = {
  User: User,
  Company: Company,
  Jobseeker: Jobseeker,
  Client: Client,
  Investor: Investor,
};
