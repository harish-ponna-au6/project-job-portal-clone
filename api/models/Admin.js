const  Sequelize = require("sequelize");
const sequelize = require("../../db");


const adminModel = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  jwt:{
    type: Sequelize.STRING,
    allowNull: true
  },
  isVerified:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }
}

const AdminDetails = sequelize.define("adminDetail", adminModel,{
  sequelize
})


module.exports = AdminDetails

