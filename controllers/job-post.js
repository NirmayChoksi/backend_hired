const axios = require("axios");

const { JobApplication } = require("../models/job-post");
const { JobMaster } = require("../models/job-post");

exports.createJobPost = async (req, res) => {
  try {
    const {
      companyId,
      jobTitle,
      jobDescription,
      jobType,
      experience,
      salary,
      location,
      field,
      educationalRequirements,
      closingDate,
    } = req.body;
    if (
      !companyId ||
      !jobTitle ||
      !jobDescription ||
      !jobType ||
      !experience ||
      !salary ||
      !location ||
      !field ||
      !educationalRequirements ||
      !closingDate
    ) {
      return res.status(400).json({ message: "Missing required fields!" });
    }
    const jobPost = new JobMaster({
      companyId,
      jobTitle,
      jobDescription,
      jobType,
      experience,
      salary,
      location,
      field,
      educationalRequirements,
      closingDate,
      applicantDetails: [],
    });
    const result = await jobPost.save();
    if (!result) {
      return res.status(400).json({ message: "Error creating job post!" });
    }
    return res.status(201).json({ message: "Successfully created job post!" });
  } catch (error) {
    console.error(error);
  }
};

exports.getJobPosts = async (req, res) => {
  try {
    const today = new Date();
    const jobPosts = await JobMaster.find(
      { closingDate: { $gte: today } },
      { __v: 0 }
    ).populate({
      path: "companyId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    if (!jobPosts || jobPosts.length === 0) {
      return res.json({ message: "No jobs found!" });
    }

    const jobData = jobPosts.map(transformJobPost);

    return res.json(jobData);
  } catch (error) {
    console.error(error);
  }
};

exports.getJobPostByJobPostId = async (req, res) => {
  try {
    const jobPostId = req.params.jobPostId;
    const jobPost = await JobMaster.findById(jobPostId).populate({
      path: "companyId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    const jobData = transformJobPost(jobPost);

    return res.json(jobData);
  } catch (error) {
    console.error(error);
  }
};

exports.getJobPostsByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const jobPosts = await JobMaster.find({ companyId }).populate({
      path: "companyId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    if (!jobPosts || jobPosts.length === 0) {
      return res.json({
        message: "No job posts found for the given company ID.",
      });
    }

    const jobData = jobPosts.map(transformJobPost);

    return res.json(jobData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const jobPostId = req.params.jobPostId;
    const jobseekerId = req.body.jobseekerId;
    const jobPost = await JobMaster.findById(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }
    if (jobPost.closingDate < new Date()) {
      return res.status(400).json({ message: "Job application closed." });
    }
    const existingApplication = jobPost.applicantDetails.find(
      (application) =>
        application.jobseekerId.toString() === req.body.jobseekerId
    );
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    const newApplication = new JobApplication({
      jobseekerId,
      status: "pending",
    });

    jobPost.applicantDetails.push(newApplication);
    const result = await jobPost.save();
    if (!result) {
      return res
        .status(500)
        .json({ message: "An error occurred while applying for the job." });
    }
    return res.json({ message: "Job application submitted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobPostId, jobseekerId } = req.params;
    const { newStatus } = req.body;

    const jobPost = await JobMaster.findById(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    const application = jobPost.applicantDetails.find(
      (application) => application.jobseekerId.toString() === jobseekerId
    );
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found for the given jobseeker." });
    }

    application.status = newStatus;

    const result = await jobPost.save();
    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to update application status." });
    }

    return res.json({ message: "Application status updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

exports.getAppliedToJobs = async (req, res) => {
  try {
    const jobseekerId = req.params.jobseekerId;

    const appliedJobs = await JobMaster.find({
      "applicantDetails.jobseekerId": jobseekerId,
    }).populate({
      path: "companyId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    if (!appliedJobs || appliedJobs.length === 0) {
      return res.json({ message: "No jobs found for the given jobseeker." });
    }

    const filteredJobs = appliedJobs.filter((job) => {
      return job.applicantDetails.some(
        (application) => application.jobseekerId.toString() === jobseekerId
      );
    });

    const jobData = filteredJobs.map(transformJobPost);

    return res.json(jobData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const jobPostId = req.params.jobPostId;
    const jobPost = await JobMaster.findById(jobPostId);

    if (!jobPost || jobPost.length === 0) {
      return res.json({ message: "No jobs found for the given jobseeker." });
    }

    await jobPost.populate({
      path: "applicantDetails.jobseekerId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    const applicantList = jobPost.applicantDetails.map(trasformApplicationList);

    res.status(200).json(applicantList);
  } catch (error) {
    console.error(error);
  }
};

exports.getBase64 = async (req, res) => {
  try {
    const resume64 = req.params.resume64;
    result = await axios.get(
      `https://hired-69643-default-rtdb.asia-southeast1.firebasedatabase.app/resumes/${resume64}.json`
    );
    res.status(200).json(result.data.resume64);
  } catch (error) {}
};

const transformJobPost = (jobPost) => {
  return {
    jobPostId: jobPost._id,
    companyId: jobPost.companyId._id,
    userId: jobPost.companyId.userId._id,
    displayName: jobPost.companyId.userId.displayName,
    email: jobPost.companyId.userId.email,
    password: jobPost.companyId.userId.password,
    address: jobPost.companyId.userId.address,
    state: jobPost.companyId.userId.state,
    city: jobPost.companyId.userId.city,
    zip: jobPost.companyId.userId.zip,
    phoneNumber: jobPost.companyId.userId.phoneNumber,
    userType: jobPost.companyId.userId.userType,
    industryDetails: jobPost.companyId.userId.industryDetails,
    companyName: jobPost.companyId.companyName,
    companyCIN: jobPost.companyId.companyCIN,
    companyWebsite: jobPost.companyId.companyWebsite,
    companyDescription: jobPost.companyId.companyDescription,
    dateOfRegistration: jobPost.companyId.dateOfRegistration,
    isVerified: jobPost.companyId.isVerified,
    jobTitle: jobPost.jobTitle,
    jobDescription: jobPost.jobDescription,
    jobType: jobPost.jobType,
    experience: jobPost.experience,
    salary: jobPost.salary,
    location: jobPost.location,
    field: jobPost.field,
    educationalRequirements: jobPost.educationalRequirements,
    skills: jobPost.skills,
    closingDate: jobPost.closingDate,
    applicantDetails: jobPost.applicantDetails,
  };
};

const trasformApplicationList = (applicant) => {
  return {
    jobseekerId: applicant.jobseekerId._id,
    userId: applicant.jobseekerId.userId._id,
    displayName: applicant.jobseekerId.userId.displayName,
    email: applicant.jobseekerId.userId.email,
    password: applicant.jobseekerId.userId.password,
    address: applicant.jobseekerId.userId.address,
    state: applicant.jobseekerId.userId.state,
    city: applicant.jobseekerId.userId.city,
    zip: applicant.jobseekerId.userId.zip,
    phoneNumber: applicant.jobseekerId.userId.phoneNumber,
    userType: applicant.jobseekerId.userId.userType,
    industryDetails: applicant.jobseekerId.userId.industryDetails,
    firstName: applicant.jobseekerId.firstName,
    lastName: applicant.jobseekerId.lastName,
    resume: applicant.jobseekerId.resume,
    resume64: applicant.jobseekerId.resume64,
    status: applicant.status,
  };
};
