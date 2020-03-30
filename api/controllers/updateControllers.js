const JobDetails = require("../models/Job")
const JobSeekerDetails = require("../models/jobSeeker")
const JobProviderDetails = require("../models/JobProvider")
const { isAcceptedMailToSeeker, isAcceptedMailToProvider } = require("../utils/nodeMailer")

const cloudinary = require("../utils/cloudinary")
const convertBufferToString = require("../utils/convertBufferToString")

function jobSeekerJobsIncrement(totalPosted) {
    return totalPosted += 1
}

module.exports = {
    async updatingJob(req, res) {
        try {
            await JobDetails.update({ ...req.body }, {
                where: {
                    id:req.params.jobid
                }
            })
            console.log("job updated successfully by provider")
                return res.status(202).send('job updated successfully by provider')
           
        }
        catch (err) {
            console.log(err)
            return res.status(304)
        }
    },
    async isAcceptedJob (req,res){
        try{
            const [job, count] = await JobDetails.update({isAccepted:true,jobSeekerId: req.jobSeeker.id, jobSeekerName: req.jobSeeker.name, jobSeekerContactNumber: req.jobSeeker.contactNumber, jobSeekerAadhaarNumber: req.jobSeeker.aadhaarNumber},{
                where:{
                    id:req.params.jobid
                }
            })
            console.log("Is Accepted Count information ====", count)
            console.log("Is Accepted Job information ====", job)
            isAcceptedMailToProvider(job.jobProviderEmail, job.title, job.createdAt, req.jobSeeker.name);
            return res.send("Job accepted")
        }
        catch(err){
            console.log(err)
            return res.status(304)
        }
    },
  async uploadProviderProfilePicture(req,res){
    try {
      let imageContent = convertBufferToString(req.file.originalname,req.file.buffer)
      let imageResponse = await cloudinary.uploader.upload(imageContent)
      console.log("imageResponse = ",imageResponse)
      console.log("imageUrl=",imageResponse.url)
      console.log("req.jobProvider._id=",req.jobProvider._id)
      JobProviderDetail.findByIdAndUpdate(req.jobProvider._id,{profilePicture:imageResponse.secure_url})
      res.send("Provider uploaded Profile picture successfully") 
    } catch (error) {
      console.log(error)
    }
  },

 async uploadSeekerProfilePicture(req,res){
   try {
    let imageContent = convertBufferToString(req.file.originalname,req.file.buffer)
    let imageResponse = await cloudinary.uploader.upload(imageContent)
        JobSeekerDetail.findByIdAndUpdate(req.jobSeeker._id,{profilePicture:imageResponse.secure_url})      
        console.log(imageResponse)
        res.send("Seeker uploaded Profile picture successfully")
   } catch (error) {
    console.log(error)
   }
   } 
}  

    // isAcceptedJob: function (req, res) {

    //     JobDetail.findByIdAndUpdate(req.params.jobid, { isAccepted: true, jobSeekerId: req.jobSeeker._id, jobSeekerName: req.jobSeeker.name, jobSeekerContactNumber: req.jobSeeker.contactNumber, jobSeekerAadhaarNumber: req.jobSeeker.aadhaarNumber })
    //         .then((job) => {
    //             console.log(job);
    //             isAcceptedMailToProvider(job.jobProviderEmail, job.title, job.createdAt, req.jobSeeker.name);
    //             JobSeekerDetail.findById(req.jobSeeker._id)
    //                 .then((jobSeeker) => {
    //                     isAcceptedMailToSeeker(jobSeeker.email, job.title, job.createdAt, job.jobProviderName)
    //                     console.log("mail sent to seeker")
    //                     return jobSeekerJobsIncrement(jobSeeker.totalAccepted)
    //                 })
    //                 .then((totalAccepted) => JobSeekerDetail.findByIdAndUpdate(req.jobSeeker._id, { totalAccepted: totalAccepted }))
    //                 .catch((err) => res.send(err))

    //             console.log("job accepted")
    //             return res.status(202).send('job accepted')
    //         }).catch((err) => res.status(304))
    // },



    // //--------------------Admin Controlling-----------------

    // updatingAnything: function (req, res) {
    //     JobDetail.updateMany({}, { isAccepted: false })
    //         .then(() => {
    //             console.log("job updated successfully by admin")
    //             return res.status(202).send('job updated successfully by admin')
    //         })
    //         .catch((err) => res.status(304))
    // },


