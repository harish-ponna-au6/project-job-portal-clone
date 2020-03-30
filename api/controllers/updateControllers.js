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
                where: {id: req.params.jobid}
            })

            console.log("job updated successfully by provider")
            return res.status(202).send('job updated successfully by provider')
        }
        catch (err) {
            console.log(err)
            return res.status(304)
        }
    },

    async isAcceptedJob(req, res) {
        try {
            const [count, job] = await JobDetails.update({ isAccepted: true, jobSeekerId: req.jobSeeker.id, jobSeekerName: req.jobSeeker.name, jobSeekerContactNumber: req.jobSeeker.contactNumber, jobSeekerAadhaarNumber: req.jobSeeker.aadhaarNumber }, {
                where: {id: req.params.jobid},
                returning: true,
                plain: true
            })
            isAcceptedMailToProvider(job.jobProviderEmail, job.title, job.createdAt, req.jobSeeker.name);
            isAcceptedMailToSeeker(req.jobSeeker.email, job.title, job.createdAt, job.jobProviderName);
            
            const jobSeekerDetails = await JobSeekerDetails.findOne({id:req.jobSeeker.id})
            const totalAccepted = jobSeekerJobsIncrement(jobSeekerDetails.totalAccepted);
            jobSeekerDetails.totalAccepted = totalAccepted;
            jobSeekerDetails.save()
            return res.send("Job accepted")
        }
        catch (err) {
            console.log(err)
            return res.status(304)
        }
    },

    async uploadProviderProfilePicture(req, res) {
        try {
            let imageContent = convertBufferToString(req.file.originalname, req.file.buffer)
            let imageResponse = await cloudinary.uploader.upload(imageContent)
            await JobProviderDetails.update({profilePicture: imageResponse.secure_url},{
                where:{id:req.jobProvider.id}
            })
            res.send("Provider uploaded Profile picture successfully")
        } catch (error) {
            console.log(error)
        }
    },

    async uploadSeekerProfilePicture(req, res) {
        try {
            let imageContent = convertBufferToString(req.file.originalname, req.file.buffer)
            let imageResponse = await cloudinary.uploader.upload(imageContent)
            JobSeekerDetails.update({ profilePicture: imageResponse.secure_url },{
                where:{id:req.jobSeeker.id}
            })
            res.send("Seeker uploaded Profile picture successfully")
        } catch (error) {
            console.log(error)
        }
    }
}





    // //--------------------Admin Controlling-----------------

    // updatingAnything: function (req, res) {
    //     JobDetail.updateMany({}, { isAccepted: false })
    //         .then(() => {
    //             console.log("job updated successfully by admin")
    //             return res.status(202).send('job updated successfully by admin')
    //         })
    //         .catch((err) => res.status(304))
    // },


