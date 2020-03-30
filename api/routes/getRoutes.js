const { Router } = require("express");
const router = Router();
const { searchNotYetAcceptedJobs, 
    // searchJobsByCategory,searchJobsByCity, searchJobsByPincode, searchJobById, searchJobByKeyword, searchAllJobs,searchAcceptedJobs, allJobsAcceptedTillDateByAParticularSeeker, jobsPostedByAParticularProvider, 
    providerAccountActivation, seekerAccountActivation ,accountActivation
}=require("../controllers/getControllers")
const {authenticateProvidersToken, authenticateSeekersToken} = require("../middlewares/authenticate")

// -----------------Job Providers Routes-----------------------

// router.get(`/api/jobprovider/postedjobs/:pagenumber/`,authenticateProvidersToken, jobsPostedByAParticularProvider)


// // -------------------Job Seekers Routes--------------------------------

// router.get(`/api/jobseeker/searchjobs/jobsacceptedtilldate/:pagenumber/`,authenticateSeekersToken, allJobsAcceptedTillDateByAParticularSeeker )

router.get(`/api/jobseeker/searchjobs/notyetaccepted/:pagenumber/`, searchNotYetAcceptedJobs)
// router.get(`/api/jobseeker/searchjobs/bycategory/:category/:pagenumber/`, searchJobsByCategory)
// router.get(`/api/jobseeker/searchjobs/bycity/:city/:pagenumber/`, searchJobsByCity)
// router.get(`/api/jobseeker/searchjobs/bypincode/:pincode/:pagenumber/`, searchJobsByPincode)
// router.get(`/api/jobseeker/searchjobs/byjobId/:jobid/`, authenticateSeekersToken, searchJobById)
// router.get(`/api/jobseeker/searchjobs/bykeyword/:keyword/:pagenumber/`, searchJobByKeyword)

// // ----------------Account Activation ----------
router.get(`/api/provideraccountactivation/:activationtoken`,providerAccountActivation)
router.get(`/api/seekeraccountactivation/:activationtoken`,seekerAccountActivation)

// router.get(`/api/accountactivation/:activationtoken`,accountActivation)

// ?user="Job-Provider"

// -----------------------Admin Routes---------------------------

// router.get(`/api/admin/searchjobs/alljobs/:pagenumber/`, searchAllJobs)
// router.get(`/api/admin/searchjobs/acceptedjobs/:pagenumber/`, searchAcceptedJobs)
// router.get(`/api/admin/searchjobs/notyetaccepted/:pagenumber/`, searchNotYetAcceptedJobs)



module.exports=router;

