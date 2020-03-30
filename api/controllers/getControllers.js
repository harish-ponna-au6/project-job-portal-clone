const JobDetails = require("../models/Job")
const JobProviderDetails = require("../models/JobProvider")
const JobSeekerDetails = require("../models/jobSeeker")
const jwt = require("jsonwebtoken")

module.exports = {

    async searchNotYetAcceptedJobs(req, res) {
        try {
            const jobs = await JobDetails.findAndCountAll({
                where: { isAccepted: false },
                offset: (((req.params.pagenumber) - 1) * 5),
                limit: 5,
                order: [['updatedAt', 'DESC']]
            })
            res.status(302).json({ 'jobs': jobs })
        }
        catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    },


    // searchNotYetAcceptedJobs: function (req, res) {
    //     JobDetail.find({ isAccepted: false })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: -1 })
    //         .then((notYetAcceptedJobs) => {
    //             JobDetail.find({})
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'notYetAcceptedJobs': notYetAcceptedJobs }) });

    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchJobsByCategory: function (req, res) {
    //     JobDetail.find({ isAccepted: false, category: req.params.category })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: -1 })
    //         .then((categoryJobs) => {
    //             JobDetail.find({ category: req.params.category })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'categoryJobs': categoryJobs }) });

    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchJobsByCity: function (req, res) {
    //     JobDetail.find({ isAccepted: false, city: req.params.city })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ timestamps: -1 })
    //         .then((cityJobs) => {
    //             JobDetail.find({ city: req.params.city })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'cityJobs': cityJobs }) });

    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchJobsByPincode: function (req, res) {
    //     JobDetail.find({ isAccepted: false, pincode: req.params.pincode })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ timestamps: -1 })
    //         .then((pincodeJobs) => {
    //             JobDetail.find({ pincode: req.params.pincode })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'pincodeJobs': pincodeJobs }) });

    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchJobById: function (req, res) {
    //     JobDetail.find({ isAccepted: false, _id: req.params.jobid })
    //         .then((job) => {
    //             res.status(302).json(job)
    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchJobByKeyword: function (req, res) {
    //     JobDetail.find({ isAccepted: false, keyword: req.params.keyword })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ timestamps: -1 })
    //         .then((keywordJobs) => {
    //             JobDetail.find({ keyword: req.params.keyword })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'keywordJobs': keywordJobs }) });
    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchAllJobs: function (req, res) {

    //     JobDetail.find({})
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: 1 })
    //         .then((allJobs) => {
    //             JobDetail.find({})
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'allJobs': allJobs }) });

    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // searchAcceptedJobs: function (req, res) {

    //     JobDetail.find({ isAccepted: true })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: 1 })
    //         .then((allAcceptedJobs) => {
    //             JobDetail.find({})
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'allAcceptedJobs': allAcceptedJobs }) });
    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // allJobsAcceptedTillDateByAParticularSeeker: function (req, res) {
    //     // JobDetail.find({jobSeekerDetail:req.jobSeeker._id})
    //     // .then((seekerJobs)=>res.status(200).json(seekerJobs))
    //     // .catch((err) => {
    //     //     console.log(err.message)
    //     //     return res.status(404).send(err.message)
    //     // });
    //     JobDetail.find({ jobSeekerId: req.jobSeeker._id })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: 1 })
    //         .then((seekerJobs) => {
    //             JobDetail.find({ jobSeekerId: req.jobSeeker._id })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'seekerJobs': seekerJobs }) });
    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    // jobsPostedByAParticularProvider: function (req, res) {
    //     JobDetail.find({ jobProviderId: req.jobProvider._id })
    //         .skip(((req.params.pagenumber) - 1) * 5)
    //         .limit(5)
    //         .sort({ createdAt: 1 })
    //         .then((providerJobs) => {
    //             JobDetail.find({ jobProviderId: req.jobProvider._id })
    //                 .countDocuments({}, function (err, count) { console.log("count = ", count); res.status(302).json({ 'count': count, 'providerJobs': providerJobs }) });
    //         })
    //         .catch((err) => {
    //             console.log(err.message)
    //             return res.status(404).send(err.message)
    //         });
    // },
    async providerAccountActivation(req, res) {
        try {
            if (!req.params.activationtoken) return res.status(401)
            const payload = await jwt.verify(req.params.activationtoken, process.env.TEMP_TOKEN_SECRET);
            if (payload) {
                const updated = await JobProviderDetails.update({ isVerified: true, activationToken: " " }, {
                    where: {
                        activationToken: req.params.activationtoken
                    }
                })
                console.log(updated);
                if(updated[0]!==0) return res.status(200).send("Account activated Successfully");
                return res.status(401).send("Account already activated")
            }
             res.send("Invalid Token")
        }
        catch (err) {
            console.log(err);
            return res.sendStatus(500)
        }
    },

    async seekerAccountActivation(req, res) {
        try {
            if (!req.params.activationtoken) return res.status(401)
            const payload = await jwt.verify(req.params.activationtoken, process.env.TEMP_TOKEN_SECRET);
            if (payload) {
                const updated=await JobSeekerDetails.update({ isVerified: true, activationToken: null }, {
                    where: {
                        activationToken: req.params.activationtoken
                    }
                })
                console.log(updated);
                if(updated[0]!==0) return res.status(200).send("Account activated Successfully");
                return res.status(401).send("Account already activated")
            }
            return res.send("Invalid Token")
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500)
        }
    },


    async accountActivation(req, res) {
        try {
            if(!req.query.user) throw new Error("invalid route")
            if(req.query.user==="Job-Provider") model =JobProviderDetails
            if(req.query.user==="Job-Seeker") model =JobSeekerDetails


            if (!req.params.activationtoken) return res.status(401)
            const payload = await jwt.verify(req.params.activationtoken, process.env.TEMP_TOKEN_SECRET);
            if (payload) {
                const updated=await model.update({ isVerified: true, activationToken: null }, {
                    where: {
                        activationToken: req.params.activationtoken
                    }
                })
                console.log(updated);
                if(updated[0]!==0) return res.status(200).send("Account activated Successfully");
                return res.status(401).send("Account already activated")
            }
            return res.send("Invalid Token")
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500)
        }
    },
}