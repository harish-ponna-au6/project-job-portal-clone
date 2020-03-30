const JobDetails = require("../models/Job")
const JobProviderDetails = require("../models/JobProvider")
const JobSeekerDetails = require("../models/jobSeeker")

function jobProviderJobsDecrement(totalPosted) {
    return totalPosted -= 1
}

module.exports = {
    async deletingJob(req, res) {
        try {
            const destroyed = await JobDetails.destroy({where:{ id: req.params.jobid }});
            if(!destroyed) throw new Error('Job do not exist(or)deleted already') 
            const jobProviderDetails = await JobProviderDetails.findOne({ id: req.jobProvider.id })
            const totalPosted = jobProviderJobsDecrement(jobProviderDetails.totalPosted)
            jobProviderDetails.totalPosted = totalPosted;
            jobProviderDetails.save()
            return res.status(202).send("One job deleted Successfully")
        } catch (error) {
            console.log(error.message);
            return res.status(404).send('Job do not exist(or)deleted already')

        }
    },

    async jobProviderLogout (req, res) {
        try {
            await JobProviderDetails.update({ jwt: "" }, {
                where: { id: req.jobProvider.id }
            })
            console.log("You are successfully logged out.")
            return res.status(202).send("You successfully logged out");
        } catch (error) {
            res.status(404).send(err.message)
        }
    },

    async jobSeekerLogout (req, res) {
        try {
            console.log("You are succefully logged out.")
            return status(202).send("You successfully logged out.");
        } catch (error) {
            res.status(404).send(err.message)
        }
       
    }
}