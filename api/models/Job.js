const { Sequelize, Model } = require("sequelize");
const sequelize = require("../../db");

const jobDetailModel = {
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preferedSkills: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rateOfPayment: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    preference: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timeSlot: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contactNumber: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pincode: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    keyword: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobProviderId: {
        type: Sequelize.BIGINT,
        allowNull: true,
    },
    jobProviderName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobProviderEmail: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    jobSeekerId: {
        type: Sequelize.BIGINT,
        allowNull: true,
    },

    jobSeekerName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    jobSeekerContactNumber: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    jobSeekerAadhaarNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
    },
    isBlocked:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
}


const JobDetails = sequelize.define("jobDetail", jobDetailModel, {
    sequelize
})

module.exports = JobDetails