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
    isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    jobProviderId: {
        type: Sequelize.BIGINT,
        allowNull:true,
        // references: {
        //     model: 'jobProviderDetail',
        //     key: 'id'
        // }
    },
    jobSeekerId: {
        type: Sequelize.BIGINT,
        allowNull:true,
        // references: {
        //     model: 'jobProviderDetail',
        //     key: 'id'
        // },
    },
    keyword:Sequelize.STRING,
    //  {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    jobProviderName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobProviderEmail: {
        type: Sequelize.STRING,
        allowNull: true
    },
    jobSeekerName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    jobSeekerContactNumber: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    jobSeekerAadhaarNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }

}


const JobDetails = sequelize.define("jobDetail", jobDetailModel, {
    sequelize
})

module.exports = JobDetails