const JobDetails = require("../models/Job");
const JobProviderDetails = require("../models/JobProvider");
const JobSeekerDetails = require("../models/jobSeeker");
const jwt = require("jsonwebtoken");
const {hash,compare} = require("bcryptjs")
const Joi = require("@hapi/joi");
const { sendMailToUser } = require("../utils/nodeMailer")
const cloudinary = require("../utils/cloudinary")
const convertBufferToString = require("../utils/convertBufferToString")

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
  // postingJob: function (req, res) {
  //   const { category, duration, title, description, preferedSkills, preference, rateOfPayment, timeSlot, contactNumber, city, pincode, address } = req.body
  //   const Schemavalidation = Joi.object({
  //     category: Joi.string().required(),
  //     duration: Joi.number().min(1).max(100).required(),
  //     title: Joi.string().min(3).max(40).required(),
  //     description: Joi.string().min(10).max(300).required(),
  //     preferedSkills: Joi.string().min(3).max(100).required(),
  //     preference: Joi.string().min(3).max(40).required(),
  //     rateOfPayment: Joi.number().min(1).max(50000).required(),
  //     timeSlot: Joi.string().required(),
  //     contactNumber: Joi.number().min(10000000).max(9999999999),
  //     city: Joi.string().min(3).max(20),
  //     pincode: Joi.number().min(100000).max(999999).required(),
  //     address: Joi.string().min(15).max(100).required()

  //   })
  //   const { error, result } = Schemavalidation.validate({ category: category, duration: duration, title: title, description: description, preferedSkills: preferedSkills, preference: preference, rateOfPayment: rateOfPayment, timeSlot: timeSlot, contactNumber: contactNumber, city: city, pincode: pincode, address: address })
  //   if (error) return res.status(422).json({ Error: error.message })
  //   console.log(result)
  //   const jobdetail = new JobDetail({ ...req.body, jobProviderId: req.jobProvider._id, jobProviderEmail: req.email, jobProviderName: req.name });
  //   jobdetail
  //     .save()
  //     .then(() => {
  //       JobProviderDetail.findById(req.jobProvider._id).then((jobProvider) => jobProviderJobsIncrement(jobProvider.totalPosted)).then((totalPosted) => {
  //         JobProviderDetail.findByIdAndUpdate(req.jobProvider._id, { totalPosted: totalPosted }
  //         ).then(() => console.log("no. of jobs posted by job provider", totalPosted))
  //       })
  //       console.log("job posted successfully");
  //       res.status(200).json(jobdetail);
  //     })
  //     .catch(err => {
  //       console.log("POSTING JOBS ====== ", err.message);
  //       return res.status(403).send(err.message);
  //     });
  // },
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
  },

  // userLogin: function (req, res) {
  //   if (req.body.role == "Job-Provider") {
  //     var email = req.body.email;
  //     var password = req.body.password;
  //     if (!email || !password)
  //       return res.status(400).send("Incorrect credentials");
  //     JobProviderDetail.findByEmailAndPassword(email, password)
  //       .then(function (user) {
  //         if (!user.isVerified) return res.status(404).send("job provider not verified, please activate link sent to u through email")
  //         jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1000 * 60 * 10 }, function (err, token) {
  //           if (err) {
  //             console.log(err.message);
  //             return res.status(500).send("Server Error");
  //           }
  //           user.jwt = token;
  //           req.jwt = token
  //           user.save()

  //           console.log(user)
  //           res.status(200).send(user);
  //         });
  //       })
  //       .catch(function (err) {
  //         console.log(err.message);
  //         res.status(403).send("Login Failed");
  //       });
  //   }
  //   else {
  //     var email = req.body.email;
  //     var password = req.body.password;
  //     if (!email || !password)
  //       return res.status(400).send("Incorrect credentials");
  //     JobSeekerDetail.findByEmailAndPassword(email, password)
  //       .then(function (user) {
  //         if (!user.isVerified) return res.send("job seeker not verified, please activate link sent to u through email")
  //         jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 6000 * 60 * 1 }, function (err, token) {
  //           if (err) {
  //             console.log(err.message);
  //             return res.status(500).send("Server Error");
  //           }
  //           user.jwt = token;
  //           req.jwt = token
  //           user.save()
  //           console.log(user)
  //           res.status(200).send(user);
  //         });
  //       })
  //       .catch(function (err) {
  //         console.log(err.message);
  //         res.status(403).send("Login Failed");
  //       });
  //   }
  // },
  // uploadProviderProfilePicture:function(req,res){
  //   let imageContent = convertBufferToString(req.file.originalname,req.file.buffer)
  //   cloudinary.uploader.upload(imageContent).then(function(imageResponse){
  //     console.log("imageResponse = ",imageResponse)
  //     console.log("imageUrl=",imageResponse.url)
  //     console.log("req.jobProvider._id=",req.jobProvider._id)
  //     JobProviderDetail.findByIdAndUpdate(req.jobProvider._id,{profilePicture:imageResponse.secure_url})
  //     .then((user)=> console.log(user))
  //     .catch((err)=>console.log(err.message))
  //       res.send("Provider uploaded Profile picture successfully")
  //   })

  // },

  // uploadSeekerProfilePicture:function(req,res){
  //   let imageContent = convertBufferToString(req.file.originalname,req.file.buffer)
  //   cloudinary.uploader.upload(imageContent).then(function(imageResponse){
  //     JobSeekerDetail.findByIdAndUpdate(req.jobSeeker._id,{profilePicture:imageResponse.secure_url})
  //     .then((user)=> res.status(200))
  //     .catch((err)=>console.log(err.message))
  //       console.log(imageResponse)
  //       res.send("Seeker uploaded Profile picture successfully")
  //   })

  // }
}

    // userLogin : async (req, res) => {
    //   if(req.body.role === 'Job-Provider'){
    //     const {email, password} = req.body
    //     if(!email || !password){
    //       return res.status(400).send('Invalid email and Password')
    //     }else{
    //       const user = await JobProviderDetail.find({email : email})
    //       if(!user){
    //         return res.send({Error : ' '})
    //       }else{
    //         const ismatched = await bcrypt.compare(password, user[0].password)
    //         if(!ismatched){
    //           return res.send({Error : ''})
    //         }else{
    //           const token = await jwt.sign({_id : user._id}, process.env.privatekey, {expiresIn : 60})
    //           user[0].jwt = token
    //           await JobProviderDetail.findByIdAndUpdate()
    //           console.log('logged in')
    //         }
    //       }
    //     }
    //   }
    // }