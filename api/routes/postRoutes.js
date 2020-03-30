const { Router } = require("express");
const router = Router();

const { userRegister,postingJob, userLogin, forgotPasswordOTP} = require("../controllers/postControllers")

const {authenticateProvidersToken, authenticateSeekersToken} = require("../middlewares/authenticate")






//-----------------Job Provider Route-----------------------
router.post(`/api/jobprovider/postingjob`, authenticateProvidersToken, postingJob);

 //--------------------Account Register Route (Job-Provider & Job-Seeker)------------------
router.post(`/api/user/register`,  userRegister); // parameter 'email' is name of that email input fiels

 //--------------------Login Route (Job-Provider & Job-Seeker) ----------------------
router.post(`/api/user/login`,userLogin); 

//  -------Forgot Password (Sending OTP to Email to Reset Password)
router.post(`/api/user/forgotpassword`,forgotPasswordOTP)







module.exports=router;

