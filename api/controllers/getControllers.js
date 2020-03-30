const JobDetails = require("../models/Job")
const JobProviderDetails = require("../models/JobProvider")
const JobSeekerDetails = require("../models/jobSeeker")
const jwt = require("jsonwebtoken")

module.exports = {

// -----------------Searching Available Jobs--------------------
    async searchNotYetAcceptedJobs(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { isAccepted: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            res.status(200).json({ 'jobs': jobs })
        }
        catch (err) {
            return res.status(500).send(error.message)
        }
    },

// -----------------Searching Job by Job id--------------------
    async searchJobById (req, res) {
        try {
            const job = await JobDetails.findOne({where:{ isAccepted: false, id: req.params.jobid }})
            console.log(job)
            return res.status(200).json(job)
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // -----------------Viewing Available Jobs--------------------
    async filterJobs(req, res) {
        try {
            if (!req.query) res.return("Please enter a definite query to filter out jobs")
            if (req.query.category) {
                console.log("Request.Query.Category = ", req.query.category);
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, category: req.query.category },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.city) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, city: req.query.city },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.pincode) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, city: req.query.pincode },
                    offset: (((req.params.pincode) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.preference) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, preference: req.query.preference },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.keyword) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, keyword: req.query.keyword },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            res.status(200).json({ 'jobs': jobs })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }
    },

    // --------------------Viewing Accepted Jobs by Seeker-----------------
    async allJobsAcceptedTillDateByAParticularSeeker(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { jobSeekerId: req.jobSeeker.id },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).send({ allJobsAcceptedTillDateByAParticularSeeker: jobs })


        } catch (error) {
            console.log(error.message)
            return res.status(500).send(error.message)
        }
    },
    
       // --------------------Viewing Accepted Jobs by Seeker-----------------
    async jobsPostedByAParticularProvider(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { jobProviderId: req.jobProvider.id },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).send({ allJobsPostedTillDateByAParticularProvider: jobs })

        } catch (error) {
            console.log(error.message)
            return res.status(500).send(error.message)
        }
    },

    // ---------------------Account Activation (Job-Provider & Job-Seeker)-----------------------
    async accountActivation(req, res) {
        try {
            if (!req.query.user) throw new Error("invalid route")

            else if (req.query.user === "Job-Provider") model = JobProviderDetails
            else if (req.query.user === "Job-Seeker") model = JobSeekerDetails;
            else throw new Error("invalid route")


            if (!req.params.activationtoken) return res.status(401)
            const payload = await jwt.verify(req.params.activationtoken, process.env.TEMP_TOKEN_SECRET);
            if (payload) {
                const updated = await model.update({ isVerified: true, activationToken: null }, {
                    where: {
                        activationToken: req.params.activationtoken
                    }
                })
                if (updated[0] !== 0) return res.status(202).send("Account activated Successfully");
                return res.status(304).send("Account already activated")
            }
            return res.send("Invalid Token")
        }
        catch (err) {
            res.status(500).send(err.message)
        }
    },
}
