const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require("nodemailer");


const { User } = require("../models/user");
const { Company } = require("../models/user");
const { Client } = require("../models/user");
const { Investor } = require("../models/user");
const { Jobseeker } = require("../models/user");
const url =
  "https://hired-69643-default-rtdb.asia-southeast1.firebasedatabase.app/resumes.json";

// exports.createUser = (req, res, next) => {
//   bcryptjs.hash(req.body.password, 10).then((hash) => {
//     const user = new User({
//       displayName: req.body.displayName,
//       email: req.body.email,
//       password: hash,
//       address: req.body.address,
//       state: req.body.state,
//       city: req.body.city,
//       zip: req.body.zip,
//       phoneNumber: req.body.phoneNumber,
//       userType: req.body.userType,
//       industryDetails: req.body.industryDetails,
//     });
//     user
//       .save()
//       .then((result) => {
//         const userType = req.body.userType;
//         let commonUserData;
//         switch (userType) {
//           case "company":
//             commonUserData = new Company({
//               companyId: result._id,
//               companyName: req.body.companyName,
//               companyCIN: req.body.companyCIN,
//               companyWebsite: req.body.companyWebsite,
//               companyDescription: req.body.companyDescription,
//               dateOfRegistration: req.body.dateOfRegistration,
//               isVerified: false,
//             });
//             break;
//           case "jobseeker":
//             commonUserData = new Jobseeker({
//               jobseekerId: result._id,
//               firstName: req.body.firstName,
//               lastName: req.body.lastName,
//               resume: req.body.resume,
//             });
//             break;
//           case "client":
//             commonUserData = new Client({
//               clientId: result._id,
//               firstName: req.body.firstName,
//               lastName: req.body.lastName,
//             });
//             break;
//           case "investor":
//             commonUserData = new Investor({
//               investorId: result._id,
//               firstName: req.body.firstName,
//               lastName: req.body.lastName,
//             });
//             break;
//         }
//         if (commonUserData) {
//           commonUserData
//             .save()
//             .then((result) => {
//               res.status(201).json({
//                 message: "User created!",
//                 result: result,
//               });
//             })
//             .catch((err) => {
//               console.error("Error saving user type data:", err);
//               User.deleteOne({ _id: result._id })
//                 .then(() => {
//                   console.error(
//                     "Deleted user due to error saving user type data"
//                   );
//                   res.status(500).json({
//                     message: "Error saving user type data! User deleted.",
//                   });
//                 })
//                 .catch((deleteErr) => {
//                   console.error(
//                     "Error deleting user after failed user type data save:",
//                     deleteErr
//                   );
//                   res.status(500).json({
//                     message: "Internal server error! 3",
//                   });
//                 });
//             });
//         } else {
//           res.status(400).json({ message: "Invalid user type!" });
//         }
//       })
//       .catch((err) => {
//         if (err.errors) {
//           res
//             .status(400)
//             .json({ message: "Validation errors!", errors: err.errors });
//         } else {
//           res.status(500).json({ message: "Internal server error! 1" });
//         }
//       });
//   });
// };

// exports.createUser = async (req, res) => {
//   try {
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

//     if (!(displayName && email && password && userType)) {
//       return res.status(400).json({ message: "Missing required fields!" });
//     }

//     const hash = await bcryptjs.hash(password, 10);
//     const user = new User({
//       displayName,
//       email,
//       password: hash,
//       address,
//       state,
//       city,
//       zip,
//       phoneNumber,
//       userType,
//       industryDetails,
//     });

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JSWTOKEN,
//       {
//         expiresIn: "1d",
//       }
//     );

//     user.verificationToken = token;

//     console.log(user.verificationToken);

//     const result = await user.save();

//     let commonUserData;

//     switch (userType) {
//       case "company":
//         commonUserData = new Company({
//           userId: result._id,
//           companyName: req.body.companyName,
//           companyCIN: req.body.companyCIN,
//           companyWebsite: req.body.companyWebsite,
//           companyDescription: req.body.companyDescription,
//           dateOfRegistration: req.body.dateOfRegistration,
//           isVerified: false,
//         });
//         break;
//       case "jobseeker":
//         const response = await axios.post(url, { resume64: req.body.resume64 });
//         if (!response) {
//           res.json({ message: "Error creating a user" });
//         }
//         commonUserData = new Jobseeker({
//           userId: result._id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           resume: req.body.resume,
//           resume64: response.data.name,
//         });
//         break;
//       case "client":
//         commonUserData = new Client({
//           userId: result._id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//         });
//         break;
//       case "investor":
//         commonUserData = new Investor({
//           userId: result._id,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//         });
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid user type!" });
//     }

//     await sendVerificationEmail(email, token);

//     if (!commonUserData) {
//       await User.findByIdAndDelete(result._id);
//       console.error("Deleted user due to error:", error);
//       return res.status(500).json({ message: "Internal server error!" });
//     }
//     const savedCommonUserData = await commonUserData.save();
//     return res.status(201).json({
//       message: "User created!",
//       result: savedCommonUserData,
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return res
//       .status(400)
//       .json({ message: "Validation errors!", errors: error.errors });
//   }
// };

exports.createUser = async (req, res) => {
  try {
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

    if (!(displayName && email && password && userType)) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const hash = await bcryptjs.hash(password, 10);
    const user = new User({
      displayName,
      email,
      password: hash,
      address,
      state,
      city,
      zip,
      phoneNumber,
      userType,
      industryDetails,
      verificationToken: "",
      resetPasswordToken: "",
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JSWTOKEN,
      {
        expiresIn: "1h",
      }
    );

    user.verificationToken = token;

    const result = await user.save();

    let commonUserData;

    switch (userType) {
      case "company":
        commonUserData = new Company({
          userId: result._id,
          companyName: req.body.companyName,
          companyCIN: req.body.companyCIN,
          companyWebsite: req.body.companyWebsite,
          companyDescription: req.body.companyDescription,
          dateOfRegistration: req.body.dateOfRegistration,
          isVerified: false,
          madePayment: false,
        });
        break;
      case "jobseeker":
        try {
          const response = await axios.post(url, {
            resume64: req.body.resume64,
          });
          commonUserData = new Jobseeker({
            userId: result._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            resume: req.body.resume,
            resume64: response.data.name,
          });
        } catch (error) {
          console.error("Error creating a jobseeker:", error);
          return res.status(500).json({ message: "Error creating a user" });
        }
        break;
      case "client":
        commonUserData = new Client({
          userId: result._id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });
        break;
      case "investor":
        commonUserData = new Investor({
          userId: result._id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type!" });
    }

    await sendVerificationEmail(email, token);

    if (!commonUserData) {
      await User.findByIdAndDelete(result._id);
      console.error("Deleted user due to error:", error);
      return res.status(500).json({ message: "Internal server error!" });
    }
    const savedCommonUserData = await commonUserData.save();
    return res.status(201).json({
      message: "User created!",
      result: savedCommonUserData,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

exports.verifyEmail = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).send({ message: "Please provide a token" });
  }
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JSWTOKEN
    );

    const tokenExpirationTime = new Date(decodedToken.exp * 1000);
    const currentTime = new Date();
    if (currentTime > tokenExpirationTime) {
      throw new Error("TokenExpiredError");
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send({
        message: "User not found. Already verified or token expired.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }

    if (user._id.toString() !== decodedToken.userId) {
      return res.status(400).send({ message: "Invalid token" });
    }

    user.emailVerification = true;
    user.verificationToken = "";

    await user.save();

    res.status(200).json({ message: "Email verification successful." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      throw new Error("Email address is required.");
    }

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    // Check if the user has already been verified
    if (user.emailVerification) {
      throw new Error("Email already verified.");
    }

    // Generate a new verification token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JSWTOKEN,
      { expiresIn: "1d" }
    );

    // Update the user's verification token
    user.verificationToken = token;
    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, token);

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.userLogin = (req, res, next) => {
//   let fetchedUser;
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       if (!user) {
//         return res.status(401).json({
//           message: "Auth failed",
//         });
//       }
//       fetchedUser = user;
//       return bcryptjs.compare(req.body.password, user.password);
//     })
//     .then((result) => {
//       if (!result) {
//         return res.status(401).json({
//           message: "Auth failed",
//         });
//       }
//       const token = jwt.sign(
//         { email: fetchedUser.email, userId: fetchedUser._id },
//         process.env.JSWTOKEN,
//         { expiresIn: "24h" }
//       );
//       res.status(200).json({
//         token: token,
//         expiresIn: 86400,
//         userId: fetchedUser._id,
//         userType: fetchedUser.userType,
//       });
//     })
//     .catch((err) => {
//       return res.status(401).json({
//         message: "Invalid authentication credentials!",
//       });
//     });
// };

exports.userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      throw new Error("Missing required login credentials.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email.");
    }

    if (!user.emailVerification) {
      throw new Error("Email Verification Pending");
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JSWTOKEN,
      { expiresIn: "24h" }
    );

    const userType = user.userType;
    const userId = user._id;
    let userSpecificData;
    switch (userType) {
      case "company":
        userSpecificData = await Company.findOne({ userId: userId }).populate(
          "userId"
        );
        break;
      case "client":
        userSpecificData = await Client.findOne({ userId: userId }).populate(
          "userId"
        );
        break;
      case "investor":
        userSpecificData = await Investor.findOne({ userId: userId }).populate(
          "userId"
        );
        break;
      case "jobseeker":
        userSpecificData = await Jobseeker.findOne({ userId: userId }).populate(
          "userId"
        );
        break;
      case "admin":
        userSpecificData = {
          _id: user._id,
          userId: { displayName: user.displayName },
        };
      default:
        break;
    }

    if (!userSpecificData) {
      throw new Error("Invalid email or password.");
    }

    res.status(200).json({
      token,
      expiresIn: 86400,
      userId,
      userType,
      userSpecificId: userSpecificData._id,
      displayName: userSpecificData.userId.displayName,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JSWTOKEN,
      {
        expiresIn: "1h",
      }
    );

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await sendResetEmail(email, token);

    res
      .status(200)
      .json({ message: "Password reset instructions sent to your email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).send({ message: "Please provide a token" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JSWTOKEN
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gamil.com",
  port: 3000,
  secure: false,
  auth: {
    user: "hired.sxca@gmail.com",
    pass: "plik iddr vqlp rqpu",
  },
});

const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: "hired.sxca@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 6px; border-radius: 10px; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Email Verification</h1>
        <p>Hello ${email},</p>
        <p>We have recently received a request for sign up.</p>
        <p>Please verify this email within 5 minutes to sign up successfully.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:4200/email-verification/token/${token}" style="background-color: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="margin-top: 20px;">Note: If you have not made this request, please ignore this email.</p>
        <p style="font-size: 12px; color: #999; text-align: center;">Thank you</p>
      </div>
      `,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (email, token) => {
  const mailOptions = {
    from: "hired.sxca@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 6px; border-radius: 10px; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p>Hello ${email},</p>
        <p>We have recently received a request for sign up.</p>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:4200/reset-password/${token}" style="background-color: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="margin-top: 20px;">Note: If you have not made this request, please ignore this email.</p>
        <p style="font-size: 12px; color: #999; text-align: center;">Thank you</p>
      </div>
      `,
  };

  await transporter.sendMail(mailOptions);
};

