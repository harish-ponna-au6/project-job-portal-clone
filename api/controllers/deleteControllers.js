const JobDetails = require("../models/Job")
const JobProviderDetails = require("../models/JobProvider")
const JobSeekerDetails = require("../models/JobSeeker")
const AdminDetails = require("../models/Admin")

function jobProviderJobsDecrement(totalPosted) {
    return totalPosted -= 1
}

module.exports = {
    // ----------------------Deleting a Posted-Job by Job-Provider------------------------
    async deletingJob(req, res) {
        try {
            const destroyed = await JobDetails.destroy({ where: { id: req.params.jobid } });
            if (!destroyed) throw new Error('Job do not exist(or)deleted already')
            const jobProviderDetails = await JobProviderDetails.findOne({ id: req.jobProvider.id })
            const totalPosted = jobProviderJobsDecrement(jobProviderDetails.totalPosted)
            jobProviderDetails.totalPosted = totalPosted;
            jobProviderDetails.save()
            return res.status(202).send("One job deleted Successfully")
        } catch (error) {
            return res.status(404).send(error.message)
        }
    },

    // ----------------------Logout from Account (Job-Provider & Job-Seeker)------------------------
    async userLogout(req, res) {
        try {
            if (req.jobProvider) { var model = JobProviderDetails; var user = req.jobProvider }
            if (req.jobSeeker) { var model = JobSeekerDetails; var user = req.jobSeeker }
            if (req.admin) { var model = AdminDetails; var user = req.admin }
            await model.update({ jwt: null }, {
                where: { id: user.id }
            })
            return res.status(202).send("You are successfully logged out");
        } catch (error) {
            res.status(404).send(error.message)
        }
    }
}