const JobDetails = require("../models/Job");
const JobProviderDetails = require("../models/JobProvider");
const JobSeekerDetails = require("../models/jobSeeker");
const jwt = require("jsonwebtoken");
const {hash,compare} = require("bcryptjs")
const Joi = require("@hapi/joi");
const { sendMailToUser } = require("../utils/nodeMailer")


function jobProviderJobsIncrement(totalPosted) {
  return totalPosted += 1
}

module.exports = {
  async postingJob (req, res) {
    try {
      const job = await JobDetails.create({ ...req.body })
      console.log("job1",job)
      job.jobProviderId = req.jobProvider.id;
      job.jobProviderEmail = req.jobProvider.email;
      job.jobProviderName = req.jobProvider.name;
      job.save();
      console.log("job2",job)
      const user = await JobProviderDetails.findOne({id:req.jobProvider.id});
      console.log(user)
      const totalPosted = jobProviderJobsIncrement(user.totalPosted); 
      JobProviderDetails.update({ totalPosted: totalPosted },
        {
          where: {
            id: req.jobProvider.id,
          }
        })
      console.log("job posted successfully");
      res.status(200).send("job posted successfully");
    }
    catch (err) {
        console.log(err)
    }
  },
   async userRegister(req, res) {
    try {
      // const { name, email, password, aadhaarNumber, contactNumber, address, profilePicture, role } = req.body
      // const Schemavalidation = Joi.object({
      //   name: Joi.string().min(3).max(30).required(),
      //   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      //   password: Joi.string().min(3).max(8).required(),
      //   aadhaarNumber: Joi.number().required(),
      //   contactNumber: Joi.number().required(),
      //   address: Joi.string().min(10).max(50).required(),
      // })
      // const { error, result } = Schemavalidation.validate({ name: name, email: email, password: password, aadhaarNumber: aadhaarNumber, contactNumber: contactNumber, address: address })
      // if (error) return res.status(422).json({ Error: error.message })

      
      if (req.body.role == "Job-Provider") model = JobProviderDetails;
      if (req.body.role == "Job-Seeker") model = JobSeekerDetails;

        const activationToken = await jwt.sign({ id: Math.random() }, process.env.TEMP_TOKEN_SECRET)
        const user = await model.create({ ...req.body });
        const hashedPassword = await hash(req.body.password,10);
        user.password = hashedPassword;
        user.activationToken = activationToken;
        user.save()
        sendMailToUser("provider", req.body.email, activationToken);
        console.log("Provider registered Successfully");
        res.status(200).json(user);
    }
    catch (err) {
      console.log(err);
      if (err.name === "SequelizeValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
    }
  },
  async userLogin (req,res){
    try{
      var email = req.body.email;
      var password = req.body.password;
      if (!email || !password)
        return res.status(400).send("Incorrect credentials");

      if (req.body.role == "Job-Provider") model = JobProviderDetails;
      if (req.body.role == "Job-Seeker") model = JobSeekerDetails;
      
        const user = await model.findOne({email});
        if(!user) return res.status(400).send("Incorrect credentials");
        const isMatched = compare(password,user.password);
        if(!isMatched) throw new Error("Invalid credentials");
        if(!user.isVerified) return res.send("job provider not verified, please activate link sent to u through email");
        console.log(user)
        const token = await jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1000 * 600 * 10 })
        user.jwt = token;
        user.save()
        return res.send({token})
    }
    catch(err){
      console.log(err)
    }
  }
}

