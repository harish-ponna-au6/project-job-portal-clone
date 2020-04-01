const JobDetails = require("../models/Job")
const JobSeekerDetails = require("../models/jobSeeker")
const JobProviderDetails = require("../models/JobProvider")
const { isAcceptedMailToSeeker, isAcceptedMailToProvider } = require("../utils/nodeMailer")
const { hash } = require("bcryptjs")

const cloudinary = require("../utils/cloudinary")
const convertBufferToString = require("../utils/convertBufferToString")

function jobSeekerJobsIncrement(totalPosted) {
    return totalPosted += 1
}

module.exports = {
// -------------------Updating Job by Job-Provider---------------
    async updatingJob(req, res) {
        try {
            await JobDetails.update({ ...req.body }, {
                where: { id: req.params.jobid, isAccepted:false }
            })
            console.log("job updated successfully by provider")
            return res.status(202).send('Job updated successfully by Job-Provider')
        }
        catch (err) {
            return res.status(500).send(err.message)
        }
    },

    // --------------------Accepting Job by Job Seeker---------------
    async isAcceptedJob(req, res) {
        try {
            var jobOne = await JobDetails.findOne({ where: { isAccepted: false, id: req.params.jobid } })
            if (jobOne.isAccepted) return res.send("Job has already been accepted")

            const [count, job] = await JobDetails.update({ isAccepted: true, jobSeekerId: req.jobSeeker.id, jobSeekerName: req.jobSeeker.name, jobSeekerContactNumber: req.jobSeeker.contactNumber, jobSeekerAadhaarNumber: req.jobSeeker.aadhaarNumber }, {
                where: { id: req.params.jobid },
                returning: true,
                plain: true
            })

            isAcceptedMailToProvider(job.jobProviderEmail, job.title, job.createdAt, req.jobSeeker.name);
            isAcceptedMailToSeeker(req.jobSeeker.email, job.title, job.createdAt, job.jobProviderName);

            const jobSeekerDetails = await JobSeekerDetails.findOne({ id: req.jobSeeker.id })
            const totalAccepted = jobSeekerJobsIncrement(jobSeekerDetails.totalAccepted);
            jobSeekerDetails.totalAccepted = totalAccepted;
            jobSeekerDetails.save()
            return res.status(202).send("Job accepted successfully")
        }
        catch (err) {
            return res.status(500).send(err.message)
        }
    },

    // ---------------------------Uploading Profile-Picture (Job-Provider & Job-Seeker)-----------
    async uploadProfilePicture(req, res) {
        try {
            if (req.jobProvider) { var model = JobProviderDetails; user = req.jobProvider }
            if (req.jobSeeker) { var model = JobSeekerDetails; user = req.jobSeeker }
            let imageContent = convertBufferToString(req.file.originalname, req.file.buffer)
            let imageResponse = await cloudinary.uploader.upload(imageContent)
            await model.update({ profilePicture: imageResponse.secure_url }, {
                where: { id: user.id }
            })
            res.status(202).send("uploaded Profile picture successfully")
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // ---------------------------Editing Profile (Job-Provider & Job-Seeker)-----------
    async editProfile(req, res) {
        try {
            if (req.jobProvider) { var model = JobProviderDetails; user = req.jobProvider }
            if (req.jobSeeker) { var model = JobSeekerDetails; user = req.jobSeeker }
            await model.update({ contactNumber: req.body.contactNumber, address: req.body.address }, {
                where: { id: user.id }
            })
            return res.status(202).send("Profile Updated successfully")
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // ---------------------------Changing Password (Job-Provider & Job-Seeker)-----------
    async editPassword(req, res) {
        try {
            if (req.jobProvider) { var model = JobProviderDetails; user = req.jobProvider }
            if (req.jobSeeker) { var model = JobSeekerDetails; user = req.jobSeeker }
            const hashedPassword = await hash(req.body.password, 10)
            console.log("hashed=", hashedPassword)
            console.log("user=", user)
            await model.update({ password: hashedPassword }, {
                where: {
                    id: user.id
                }
            })
            return res.status(202).send("Password changed successfully")

        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // ----------------------------------------Admin Blocking-----------------------------------------------
    async blocking(req,res){
        try {
            if(req.query.model==="Job-Provider") var model = JobProviderDetails;
            else if(req.query.model==="Job-Seeker") var model = JobSeekerDetails;
            else if(req.query.model==="Job") var model = JobDetails;
            else return res.send("please input valid query in route");
            const update = await model.update({isBlocked:true},{
                where:{id:req.params.id}
            });
            if(update[0]===0) res.send("Invalid Id");
            return res.status(202).send("Blocked Succesfully")
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }
}