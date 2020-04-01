var JobProviderDetails = require("../models/JobProvider");
var JobSeekerDetails = require("../models/JobSeeker");
const AdminDetails = require("../models/Admin")
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
            if (jobProvider.isBlocked) return res.status(401).send(`${jobProvider.name}, you are blocked for the misuse of SeasonalEmployment.com.....`);
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
            if (!payload.id) {
                return res.sendStatus(403)
            }
            const jobSeeker = await JobSeekerDetails.findOne({ where: { id: payload.id, jwt: token } })
            if (jobSeeker.isBlocked) return res.status(401).send(`${jobSeeker.name}, you are blocked for the misuse of SeasonalEmployment.com.....`);
            if (!jobSeeker) return res.sendStatus(401)
            req.jobSeeker = jobSeeker
            next()
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    },
    async authenticateAdminsToken (req,res,next){
        try {
            const token = req.header('Authorization')
            if (!token) return res.sendStatus(401)
            const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if (!payload.id) {
                return res.sendStatus(403)
            }
            const admin = await AdminDetails.findOne({where:{id: payload.id, jwt: token}})
            if (admin.isBlocked) return res.status(401).send(`${admin.name}, you are blocked for the misuse of SeasonalEmployment.com.....`);
            if(!admin) return res.sendStatus(401)
            req.admin = admin
            next()
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }
}

