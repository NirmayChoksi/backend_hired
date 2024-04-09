const mongoose = require("mongoose");

const applicantDetailsSchema = mongoose.Schema({
  jobseekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobseeker",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
});

const jobMasterSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobType: { type: String, required: true },
  experience: { type: String, required: true },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  field: { type: String, required: true },
  educationalRequirements: { type: String, required: true },
  skills: [{ type: String }],
  closingDate: { type: Date, required: true },
  applicantDetails: [applicantDetailsSchema],
});

const JobApplication = mongoose.model("JobApplication", applicantDetailsSchema);
const JobMaster = mongoose.model("JobMaster", jobMasterSchema);

module.exports = { JobApplication: JobApplication, JobMaster: JobMaster };
