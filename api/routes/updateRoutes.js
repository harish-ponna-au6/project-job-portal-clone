const { Router } = require("express");
const router = Router();
const upload = require("../utils/multer")
const {authenticateProvidersToken, authenticateSeekersToken} = require("../middlewares/authenticate")
const { updatingJob, isAcceptedJob, uploadProviderProfilePicture, uploadSeekerProfilePicture
    //  updatingAnything 
}=require("../controllers/updateControllers")

router.patch(`/api/jobprovider/udpatingjob/:jobid/`,authenticateProvidersToken, updatingJob)
router.patch(`/api/jobseeker/searchjobs/byjobid/:jobid/isaccepted/`,authenticateSeekersToken, isAcceptedJob)

// // --------------------Uploading Profile Picture------------------------------

router.post(`/api/jobprovider/uploadprofilepicture`, authenticateProvidersToken, upload.single("image"), uploadProviderProfilePicture);

 router.post(`/api/jobseeker/uploadprofilepicture`, authenticateSeekersToken, upload.single("image"), uploadSeekerProfilePicture); 



// --------------------Admin Updating--------------------
// router.patch(`/api/updatingAnything/`, updatingAnything);

module.exports=router;

