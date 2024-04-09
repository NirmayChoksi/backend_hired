const express = require("express");

const checkAuth = require("../middleware/check-auth");
const jobPostController = require("../controllers/job-post");

const router = express.Router();

router.post("", checkAuth, jobPostController.createJobPost);

router.get("", jobPostController.getJobPosts);

router.get(
  "/jobpost/:jobPostId",
  checkAuth,
  jobPostController.getJobPostByJobPostId
);

router.get(
  "/company/:companyId",
  checkAuth,
  jobPostController.getJobPostsByCompanyId
);

router.post("/:jobPostId", checkAuth, jobPostController.applyForJob);

router.patch(
  "/:jobPostId/:jobseekerId",
  checkAuth,
  jobPostController.updateApplicationStatus
);

router.get(
  "/jobseeker/:jobseekerId",
  checkAuth,
  jobPostController.getAppliedToJobs
);

router.get("/applicants/:jobPostId", jobPostController.getApplicants);

router.get("/resume64/:resume64", jobPostController.getBase64);

module.exports = router;
