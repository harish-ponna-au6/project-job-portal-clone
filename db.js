const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URI);



sequelize.sync();

sequelize
  .authenticate()
  .then(() => console.log("POSTGRESQL Connected successfully!"))
  .catch(err => console.log(`Error: ${err.message}`));

module.exports = sequelize;