const Sequelize = require("sequelize");
const sequelize = require("../../db");

const jobSeekerModel = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  aadhaarNumber: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true
  },
  gender:{
    type: Sequelize.STRING,
    allowNull: false
  },
  contactNumber: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  profilePicture: {
    type: Sequelize.STRING,
    allowNull: true
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalAccepted: {
    type: Sequelize.BIGINT,
    allowNull:true
  },
  
  jwt: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  activationToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isBlocked:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
  }
}

const JobSeekerDetails = sequelize.define("jobSeekerDetail", jobSeekerModel, {
  sequelize
})

module.exports = JobSeekerDetails

