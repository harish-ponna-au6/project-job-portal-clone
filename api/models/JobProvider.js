const  Sequelize = require("sequelize");
const sequelize = require("../../db");


const jobProviderModel = {
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
  totalPosted: {
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
  }
}

const JobProviderDetails = sequelize.define("jobProviderDetail", jobProviderModel,{
  sequelize
})


module.exports = JobProviderDetails



















// const { hash, compare } = require("bcryptjs");


// class User extends Model {
//   static async findByEmailAndPassword(email, password) {
//     try {
//       const user = await User.findOne({
//         where: {
//           email
//         }
//       });
//       if (!user) throw new Error("Incorrect credentials");
//       const isMatched = await compare(password, user.password);
//       if (!isMatched) throw new Error("Incorrect credentials");
//       return user;
//     } catch (err) {
//       throw err;
//     }
//   }
// }
