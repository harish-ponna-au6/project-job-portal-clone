const { Router } = require("express");
const router = Router();

const { userRegister,postingJob, userLogin} = require("../controllers/postControllers")

const {authenticateProvidersToken, authenticateSeekersToken} = require("../middlewares/authenticate")






// //-----------------Job Providers Routes-----------------------
router.post(`/api/jobprovider/postingjob`, authenticateProvidersToken, postingJob);

// //--------------------Register Route for Job - Provider/Seeker ------------------
router.post(`/api/user/register`,  userRegister); // parameter 'email' is name of that email input fiels

// //--------------------Login/Logout Routes for Job - Provider/Seeker ----------------------
router.post(`/api/user/login`,userLogin); 








module.exports=router;

