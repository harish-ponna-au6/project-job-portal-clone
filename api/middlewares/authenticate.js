var JobProviderDetails = require("../models/JobProvider");
var JobSeekerDetails = require("../models/jobSeeker");
const jwt = require("jsonwebtoken");

module.exports = {
    
    // ----------------Job-Provider Authentication-----------------
    async authenticateProvidersToken(req, res, next) {
        try {
            const token = req.header('Authorization')
            if (!token) return res.sendStatus(401)
            const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if (!payload.id) {
                return res.sendStatus(403)
            }
            const jobProvider = await JobProviderDetails.findOne({ where: { id: payload.id, jwt: token } })
            if (!jobProvider) return res.sendStatus(401)
            req.jobProvider = jobProvider
            next()
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    },

    // ----------------Job-Seeker Authentication-----------------
    async  authenticateSeekersToken(req, res, next) {
        try {
            const token = req.header('Authorization')
            if (!token) return res.sendStatus(401)
            const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            console.log("PAYLOAD = ", payload)
            if (!payload.id) {
                return res.sendStatus(403)
            }
            const jobSeeker = await JobSeekerDetails.findOne({ where: { id: payload.id, jwt: token } })
            if (!jobSeeker) return res.sendStatus(401)
            req.jobSeeker = jobSeeker
            next()
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }
}

