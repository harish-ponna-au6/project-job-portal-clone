const JobDetails = require("../models/Job")
const JobProviderDetails = require("../models/JobProvider")
const JobSeekerDetails = require("../models/JobSeeker")

const jwt = require("jsonwebtoken")

module.exports = {

    // -----------------Searching Available Jobs--------------------
    async allAvailableJobs(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { isAccepted: false, isBlocked: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).json({ count: jobs.count, jobs: jobs.rows })
        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // -----------------Searching Job by Job id--------------------
    async searchJobById(req, res) {
        try {
            const job = await JobDetails.findOne({ where: { isAccepted: false, id: req.params.jobid, isBlocked: false } })
            console.log(job)
            return res.status(200).json(job)
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // -----------------Filtering Available Jobs--------------------
    async filterJobs(req, res) {
        try {
            if (!req.query) res.return("Please enter a definite query to filter out jobs")
            if (req.query.category) {
                console.log("Request.Query.Category = ", req.query.category);
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, category: req.query.category, isBlocked: false },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.city) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, city: req.query.city, isBlocked: false },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.pincode) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, city: req.query.pincode, isBlocked: false },
                    offset: (((req.params.pincode) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.preference) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, preference: req.query.preference, isBlocked: false },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            if (req.query.keyword) {
                var jobs = await JobDetails.findAndCountAll({
                    where: { isAccepted: false, keyword: req.query.keyword, isBlocked: false },
                    offset: (((req.params.pagenumber) - 1) * 5),
                    limit: 5,
                    order: [['updatedAt', 'DESC']]
                })
            }
            return res.status(200).json({ count: jobs.count, jobs: jobs.rows })
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    },

    // --------------------Viewing Accepted Jobs by Seeker-----------------

    async allJobsAcceptedTillDateByAParticularSeeker(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { jobSeekerId: req.jobSeeker.id, isBlocked: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).send({ count:jobs.count,allJobsAcceptedTillDateByAParticularSeeker: jobs.rows })


        } catch (error) {
            console.log(error.message)
            return res.status(500).send(error.message)
        }
    },

    // --------------------Viewing All Posted Jobs by A Provider-----------------

    async jobsPostedByAParticularProvider(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { jobProviderId: req.jobProvider.id, isBlocked: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).send({ count:jobs.count,allJobsPostedTillDateByAParticularProvider: jobs.rows })

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
                        activationToken: req.params.activationtoken, isBlocked: false
                    }
                })
                if (updated[0] !== 0) return res.status(202).send("Account activated Successfully, Please visit SeasonalEmployment.com and Login");
                return res.status(304).send("Account already activated")
            }
            return res.send("Invalid Token")
        }
        catch (err) {
            res.status(500).send(err.message)
        }
    },


    // --------------------------Admin Routes------------------------------------------------------------------------
// -----------------------------All Jobs-----------------------------------
    async allAvailableJobsincludingBlocked(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { isAccepted: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).json({ count: jobs.count, jobs: jobs.rows })
        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    },
    // ------------------- All Accepted Jobs----------------------
    async allAcceptedJobs(req, res) {
        try {
            console.log("hai")
            const jobs = await JobDetails.findAndCountAll({
                where: { isAccepted: true },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).json({ count: jobs.count, jobs: jobs.rows })
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // --------------All Providers List------------------------------------------------
    async allProviders(req, res) {
        try {
            const jobProviders = await JobProviderDetails.findAndCountAll({
                where: { isVerified: true },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).json({ count: jobProviders.count, jobProviders: jobProviders.rows })
        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    },

    // --------------All Seekers List------------------------------------------------

    async allSeekers(req, res) {
        try {
            const jobSeekers = await JobSeekerDetails.findAndCountAll({
                where: { isVerified: true },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            return res.status(200).json({ count: jobSeekers.count, jobSeekers: jobSeekers.rows })
        } catch (error) {
            return res.status(500).send(error.message)
        }
    }
}
