const { Router } = require("express");
const router = Router();
const { deletingJob, jobProviderLogout, jobSeekerLogout }=require("../controllers/deleteControllers")
const {authenticateProvidersToken, authenticateSeekersToken} = require("../middlewares/authenticate")


// -------------------------Job-Provider Route-----------------------
router.delete(`/api/jobprovider/deletingjob/:jobid/`,authenticateProvidersToken, deletingJob)
router.delete(`/api/user/jobprovider/logout/`,authenticateProvidersToken, jobProviderLogout); 

// -------------------------Job-Seeker Route-----------------------
router.delete(`/api/user/jobseeker/logout/`, authenticateSeekersToken, jobSeekerLogout); 

module.exports=router;
