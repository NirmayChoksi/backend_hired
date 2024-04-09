const axios = require("axios");
const bcryptjs = require("bcryptjs");

const { User } = require("../models/user");
const { Company } = require("../models/user");
const { Client } = require("../models/user");
const { Investor } = require("../models/user");
const { Jobseeker } = require("../models/user");

const url =
  "https://hired-69643-default-rtdb.asia-southeast1.firebasedatabase.app/resumes/";

// exports.editUserDetails = (req, res, next) => {
//   bcryptjs.hash(req.body.password, 10).then((hash) => {
//     const post = new User({
//       _id: req.body.id,
//       displayName: req.body.displayName,
//       email: req.body.email,
//       password: hash,
//       address: req.body.address,
//       state: req.body.state,
//       city: req.body.city,
//       zip: req.body.zip,
//       phoneNumber: req.body.phoneNumber,
//       userType: req.body.userType,
//       industryDetails: req.body.userType,
//     });
//     User.updateOne(
//       {
//         _id: req.params.id,
//         user: req.userData.userId,
//         $or: { userType: "admin" },
//       },
//       post
//     )
//       .then((result) => {
//         if (result.matchedCount > 0) {
//           res.status(200).json({ message: "Update successful!" });
//         } else {
//           res.status(400).json({ message: "Not authorized!" });
//         }
//       })
//       .catch((error) => {
//         res.status(500).json({ message: "Couldn't update post" });
//       });
//   });
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const { id, userId } = req.params.id;
//     const {
//       displayName,
//       email,
//       password,
//       address,
//       state,
//       city,
//       zip,
//       phoneNumber,
//       userType,
//       industryDetails,
//     } = req.body;

//     const updatedData = await User.findByIdAndUpdate(
//       id,
//       {
//         displayName,
//         email,
//         password,
//         phoneNumber,
//         address,
//         city,
//         state,
//         zip,
//         industryDetails,
//         userType,
//       },
//       { new: true }
//     );
//     if (!data) {
//       res.json({
//         message: "data not updated",
//       });
//     }

//     let updateUserData;
//     switch (userType) {
//       case "company":
//         updateUserData = await Company.findByIdAndUpdate(userId, {
//           userId: id,
//           companyName: req.body.CompanyName,
//           compnayCIN: req.body.compnayCIN,
//           companyWebsite: req.body.companyWebsite,
//           companyDescription: req.body.companyDescription,
//           dateOfRegistration: req.body.dateOfRegistration,
//           isVerified: req.body.dateOfRegistration,
//         });
//         break;
//       case "client":
//         updateUserData = await Client.findByIdAndUpdate(userId, {
//           userId: id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//         });
//         break;
//       case "investor":
//         updateUserData = await Investor.findByIdAndUpdate(userId, {
//           userId: id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//         });
//         break;
//       case "jobseeker":
//         const userSpecificData = await Jobseeker.findById(userId);

//         if (!userSpecificData) {
//           return res.json({ message: "Jobseeker data not found" });
//         }

//         response = await axios.put(
//           url + userSpecificData.resume64 + ".json",
//           req.body.resume64
//         );

//         if (!respose) {
//           return res.json({ message: "Error updating resumes" });
//         }

//         updateUserData = await Jobseeker.findByIdAndUpdate(userId, {
//           userId: id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           resume: req.body.resume,
//           resume64: userSpecificData.resume64,
//         });
//         break;
//     }

//     if (!updateUserData) {
//       res.json({
//         message: "data not updated!",
//       });
//     }

//     res.json({
//       message: "data updated",
//       investor: updateUserData,
//       user: updatedData,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

exports.updateUser = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const {
      displayName,
      email,
      password,
      address,
      state,
      city,
      zip,
      phoneNumber,
      userType,
      industryDetails,
    } = req.body;

    const updatedUserData = await User.findByIdAndUpdate(
      id,
      {
        displayName,
        email,
        password,
        address,
        state,
        city,
        zip,
        phoneNumber,
        userType,
        industryDetails,
      },
      { new: true }
    );

    if (!updatedUserData) {
      return res
        .status(404)
        .json({ message: "User not found or data not updated" });
    }

    let updatedUserSpecificData;
    switch (userType) {
      case "company":
        updatedUserSpecificData = await updateCompany(userId, req.body);
        break;
      case "client":
        updatedUserSpecificData = await updateClient(userId, req.body);
        break;
      case "investor":
        updatedUserSpecificData = await updateInvestor(userId, req.body);
        break;
      case "jobseeker":
        updatedUserSpecificData = await updateJobseeker(userId, req.body);
        break;
      default:
        return res.status(400).json({ message: "Invalid userType" });
    }

    if (!updatedUserSpecificData) {
      return res
        .status(404)
        .json({ message: "User-specific data not updated" });
    }

    const transformedData = transformUpdatedUserData(
      updatedUserData,
      updatedUserSpecificData
    );

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Company.findByIdAndUpdate(userId, {
      $set: { isVerified: true },
    });
    if (!result) {
      res.json({
        message: "data not updated!",
      });
    }
    return res.status(200).json({
      message: "Company verified successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

// exports.fetchUsers = (req, res, next) => {
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;
//   const postQuery = Post.find();
//   let fetchedPosts;
//   if (pageSize && currentPage) {
//     postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//   }
//   postQuery
//     .then((documents) => {
//       fetchedPosts = documents;
//       return Post.find().countDocuments();
//     })
//     .then((count) => {
//       res.status(200).json({
//         message: "Posts fetched successfully!",
//         posts: fetchedPosts,
//         maxPosts: count,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Failed to fetch posts!",
//       });
//     });
// };

// exports.fetchUser = async (req, res, next) => {
//   User.findById(req.params.id, { __v: 0 })
//     .then(async (User) => {
//       if (User) {
//         const userType = User.userType;
//         switch (userType) {
//           case "company":
//             Company.find({ userId: User._id }).then((userData) => {
//               const userTypeData = userData[0];
//               const combinedData = {
//                 ...User._doc,
//                 userId: userTypeData.userId,
//                 firstName: userTypeData.firstName,
//                 lastName: userTypeData.lastName,
//               };
//               res.status(200).json(combinedData);
//             });
//             const data = await Company.find({userId : User._id})

//             break;
//           case "client":
//             Client.find({ userId: User._id }).then((userData) => {
//               const userTypeData = userData[0];
//               const combinedData = {
//                 ...User._doc,
//                 userId: userTypeData.userId,
//                 firstName: userTypeData.firstName,
//                 lastName: userTypeData.lastName,
//               };
//               res.status(200).json(combinedData);
//             });
//             break;
//           case "investor":
//             Investor.find({ userId: User._id }, { __v: 0 }).then((userData) => {
//               const userTypeData = userData[0];
//               const combinedData = {
//                 ...User._doc,
//                 userId: userTypeData.userId,
//                 firstName: userTypeData.firstName,
//                 lastName: userTypeData.lastName,
//               };
//               res.status(200).json(combinedData);
//             });
//             break;
//           case "jobseeker":
//             Jobseeker.find({ userId: User._id }).then((userData) => {
//               const userTypeData = userData[0];
//               const combinedData = {
//                 ...User._doc,
//                 userId: userTypeData.userId,
//                 firstName: userTypeData.firstName,
//                 lastName: userTypeData.lastName,
//               };
//               res.status(200).json(combinedData);
//             });
//             break;
//         }
//       } else {
//         res.status(404).json({ message: "User not found!" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Failed to fetch user data!",
//       });
//     });
// };

// exports.fetchUsers = async (req, res) => {
//   try {
//     const usersData = [];
//     const users = await User.find({}, { __v: 0 });
//     if (!users || users.length === 0) {
//       return res.json({ message: "No users found!" });
//     }
//     for (let user of users) {
//       if (user.userType === "admin") {
//         continue;
//       }
//       let userSpecificData;
//       switch (user.userType) {
//         case "company":
//           userSpecificData = await Company.find({ userId: user._id }).populate(
//             "userId"
//           );
//           break;
//         case "client":
//           userSpecificData = await Client.find({ userId: user._id }).populate(
//             "userId"
//           );
//           break;
//         case "investor":
//           userSpecificData = await Investor.find({ userId: user._id })
//             .populate("userId")
//             .select({ __v: 0 });
//           break;
//         case "jobseeker":
//           userSpecificData = await Jobseeker.find({
//             userId: user._id,
//           }).populate("userId");
//           break;
//       }
//       if (!userSpecificData || userSpecificData.length === 0) {
//         continue;
//       }
//       // const userData = {
//       //   ...userSpecificData[0],
//       //   ...userSpecificData[0].userId,
//       // };
//       usersData.push(userSpecificData);
//     }
//     res.status(201).json({
//       message: "Successfully found userData",
//       data: usersData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.fetchUsers = async (req, res) => {
  try {
    const usersData = await Promise.all(
      (
        await User.find({}, { __v: 0 })
      )
        .filter((user) => user.userType !== "admin")
        .map(async (user) => {
          let userSpecificData;
          switch (user.userType) {
            case "company":
              userSpecificData = await Company.findOne({
                userId: user._id,
              }).populate("userId");
              break;
            case "client":
              userSpecificData = await Client.findOne({
                userId: user._id,
              }).populate("userId");
              break;
            case "investor":
              userSpecificData = await Investor.findOne({ userId: user._id })
                .populate("userId")
                .select({ __v: 0 });
              break;
            case "jobseeker":
              userSpecificData = await Jobseeker.findOne({
                userId: user._id,
              }).populate("userId");
              break;
          }
          return userSpecificData;
        })
    );

    const transformedUsers = usersData
      .filter((userData) => userData !== null)
      .map(transformUserData);

    return res.status(200).json(transformedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fetchVerifiedCompanies = async (req, res) => {
  try {
    const verifiedCompanies = await Company.find({ isVerified: true }).populate(
      "userId"
    );

    if (verifiedCompanies.length === 0) {
      return res.status(404).json({ message: "No verified companies found" });
    }

    const transformedUserData = verifiedCompanies.map((company) => {
      return transformUserData(company);
    });

    res.status(200).json(transformedUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching verified companies" });
  }
};

exports.fetchUnverifiedCompanies = async (req, res) => {
  try {
    const unVerifiedCompanies = await Company.find({
      isVerified: false,
    }).populate("userId");

    if (unVerifiedCompanies.length === 0) {
      return res.status(404).json("No unverified companies found");
    }

    const transformedUserData = unVerifiedCompanies.map((company) => {
      return transformUserData(company);
    });

    res.status(200).json(transformedUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching verified companies" });
  }
};

exports.fetchUserByIdAndType = async (req, res) => {
  try {
    const { id, userType } = req.params;

    let userData;
    switch (userType) {
      case "company":
        userData = await Company.findById(id, { __v: 0 }).populate("userId");
        break;
      case "client":
        userData = await Client.findById(id, { __v: 0 }).populate("userId");
        break;
      case "investor":
        userData = await Investor.findById(id, { __v: 0 }).populate("userId");
        break;
      case "jobseeker":
        userData = await Jobseeker.findById(id, { __v: 0 }).populate("userId");
        break;
      case "admin":
        userData = await User.findById(id, { __v: 0 });
    }

    if (!userData) {
      res.json({
        message: "user not found!",
      });
    }

    const transformedUserData = transformUserData(userData);

    res.status(201).json(transformedUserData);
  } catch (error) {
    console.error(error);
  }
};

exports.fetchUsersByType = async (req, res) => {
  try {
    const userType = req.params.userType;
    let userData;
    switch (userType) {
      case "company":
        userData = await Company.find({}, { __v: 0 }).populate("userId");
        break;
      case "client":
        userData = await Client.find({}, { __v: 0 }).populate("userId");
        break;
      case "investor":
        userData = await Investor.find({}, { __v: 0 }).populate("userId");
        break;
      case "jobseeker":
        userData = await Jobseeker.find({}, { __v: 0 }).populate("userId");
        break;
      default:
        break;
    }
    if (!userData) {
      res.json({
        message: "users not found!",
      });
    }

    const transformedUsers = userData
      .filter((userData) => userData !== null)
      .map(transformUserData);

    res.status(201).json(transformedUsers);
  } catch (error) {
    console.error(error);
  }
};

// exports.deleteUser = (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
//     .then((result) => {
//       if (result.deletedCount > 0) {
//         res.status(200).json({ message: "Post deleted!" });
//       } else {
//         res.status(400).json({ message: "User is not authorized!" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Failed to delete post!",
//       });
//     });
// };

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userData.userId;

    if (!oldPassword && !newPassword && !userId)
      throw new Error("Missing required fields!");

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid email.");
    }

    const passwordMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new Error("Old password does not match!");
    }

    const hash = await bcryptjs.hash(newPassword, 10);

    const result = await User.findByIdAndUpdate(userId, {
      $set: { password: hash },
    });

    if (!result) {
      throw new Error("Error updating password");
    }

    return res.status(200).json({
      message: "Password successfully changed!",
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;
    const userType = req.params.userType;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      res.json({ message: "User not found or deletion failed" });
    }
    let userDeleteResult;
    switch (userType) {
      case "company":
        userDeleteResult = await Company.findByIdAndDelete(userId);
        break;
      case "client":
        userDeleteResult = await Client.findByIdAndDelete(userId);
        break;
      case "investor":
        userDeleteResult = await Investor.findByIdAndDelete(userId);
        break;
      case "jobseeker":
        userDeleteResult = await Jobseeker.findByIdAndDelete(userId);
        break;
    }
    if (!userDeleteResult) {
      res.json({ message: "User not found or deletion failed" });
    }
    res.json({ message: "user deleted" });
  } catch (error) {
    console.error(error);
  }
};

exports.totalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json(totalUsers);
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.countVerifiedCompanies = async (req, res) => {
  try {
    const count = await Company.countDocuments({ isVerified: true });
    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting verified companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.countUnverifiedCompanies = async (req, res) => {
  try {
    const count = await Company.countDocuments({ isVerified: false });
    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting verified companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.countUsersByType = async (req, res) => {
  try {
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$userType",
          count: { $sum: 1 },
        },
      },
    ]);

    const countsByType = {};
    userCounts.forEach(({ _id, count }) => {
      countsByType[_id] = count;
    });

    res.status(200).json(countsByType);
  } catch (error) {
    console.error("Error counting users by type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function updateCompany(userId, data) {
  return await Company.findByIdAndUpdate(userId, {
    companyName: data.companyName,
    compnayCIN: data.compnayCIN,
    companyWebsite: data.companyWebsite,
    companyDescription: data.companyDescription,
    dateOfRegistration: data.dateOfRegistration,
    isVerified: data.isVerified,
  });
}

async function updateClient(userId, data) {
  return await Client.findByIdAndUpdate(userId, {
    firstName: data.firstName,
    lastName: data.lastName,
  });
}

async function updateInvestor(userId, data) {
  return await Investor.findByIdAndUpdate(userId, {
    firstName: data.firstName,
    lastName: data.lastName,
  });
}

async function updateJobseeker(userId, data) {
  try {
    const userSpecificData = await Jobseeker.findById(userId);

    if (!userSpecificData) {
      return { error: "Jobseeker data not found" };
    }

    const response = await axios.put(
      url + userSpecificData.resume64 + ".json",
      { resume64: data.resume64 }
    );

    if (!response) {
      return { error: "Error updating resume" };
    }

    const updatedJobseeker = await Jobseeker.findByIdAndUpdate(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      resume: data.resume,
      resume64: userSpecificData.resume64,
    });

    return updatedJobseeker;
  } catch (error) {
    console.error("Error updating jobseeker:", error);
    return { error: "Internal Server Error" };
  }
}

const transformUserData = (user) => {
  let userData;
  let userType;
  if (user.userType) userType = user.userType;
  else userType = user.userId.userType;
  switch (userType) {
    case "company":
      userData = {
        companyId: user._id,
        companyCIN: user.companyCIN,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyDescription: user.companyDescription,
        dateOfRegistration: user.dateOfRegistration,
        isVerified: user.isVerified,
        madePayment: user.madePayment,
      };
      break;
    case "client":
      userData = {
        clientId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      break;
    case "investor":
      userData = {
        investorId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      break;
    case "jobseeker":
      userData = {
        jobseekerId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        resume: user.resume,
        resume64: user.resume64,
      };
      break;
    case "admin":
      return {
        userId: user._id,
        displayName: user.displayName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        emailVerification: user.emailVerification,
      };
      break;
    default:
      break;
  }

  return {
    userId: user.userId._id,
    displayName: user.userId.displayName,
    email: user.userId.email,
    password: user.userId.password,
    address: user.userId.address,
    state: user.userId.state,
    city: user.userId.city,
    zip: user.userId.zip,
    phoneNumber: user.userId.phoneNumber,
    userType: user.userId.userType,
    industryDetails: user.userId.industryDetails,
    emailVerification: user.userId.emailVerification,
    ...userData,
  };
};

const transformUpdatedUserData = (userData, userSpecificData) => {
  switch (userData.userType) {
    case "company":
      return {
        userId: userData._id,
        displayName: userData.displayName,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        state: userData.state,
        city: userData.city,
        zip: userData.zip,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        industryDetails: userData.industryDetails,
        companyId: userSpecificData._id,
        compnayCIN: userSpecificData.companyCIN,
        companyName: userSpecificData.companyName,
        companyWebsite: userSpecificData.companyWebsite,
        companyDescription: userSpecificData.companyDescription,
        dateOfRegistration: userSpecificData.dateOfRegistration,
        isVerified: userSpecificData.isVerified,
      };
      break;
    case "client":
      return {
        userId: userData._id,
        displayName: userData.displayName,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        state: userData.state,
        city: userData.city,
        zip: userData.zip,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        industryDetails: userData.industryDetails,
        clientId: userSpecificData._id,
        firstName: userSpecificData.firstName,
        lastName: userSpecificData.lastName,
      };
      break;
    case "investor":
      return {
        userId: userData._id,
        displayName: userData.displayName,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        state: userData.state,
        city: userData.city,
        zip: userData.zip,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        industryDetails: userData.industryDetails,
        investorId: userSpecificData._id,
        firstName: userSpecificData.firstName,
        lastName: userSpecificData.lastName,
      };
      break;
    case "jobseeker":
      return {
        userId: userData._id,
        displayName: userData.displayName,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        state: userData.state,
        city: userData.city,
        zip: userData.zip,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        industryDetails: userData.industryDetails,
        jobseekerId: userSpecificData._id,
        firstName: userSpecificData.firstName,
        lastName: userSpecificData.lastName,
        resume: userSpecificData.resume,
        resume64: userSpecificData.resume64,
      };
      break;
    default:
      break;
  }
};
