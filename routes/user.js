const express = require("express");

const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/user");

const router = express.Router();

router.put("/:id/:userId", checkAuth, userController.updateUser);

router.patch(
  "/verify-company/:userId",
  checkAuth,
  userController.verifyCompany
);

router.get("", userController.fetchUsers);

router.get("/verifiedCompanies", userController.fetchVerifiedCompanies);

router.get(
  "/unverifiedCompanies",
  checkAuth,
  userController.fetchUnverifiedCompanies
);

router.get("/total-users", userController.totalUsers);

router.get(
  "/count-unverified-companies",
  userController.countUnverifiedCompanies
);

router.get("/count-verified-companies", userController.countVerifiedCompanies);

router.get("/count-types", userController.countUsersByType);

router.get("/:id/:userType", checkAuth, userController.fetchUserByIdAndType);

router.get("/:userType", checkAuth, userController.fetchUsersByType);

router.patch("/change-password", checkAuth, userController.changePassword);

router.delete("/:id/:userId/:userType", checkAuth, userController.deleteUser);

module.exports = router;
