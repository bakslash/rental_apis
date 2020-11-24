const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER, 
    process.env.DATABASE_PASSWORD,{
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
 //prevent sequelize from pluralizing table names
  freezeTableName: true,
  });

  db.authenticate()
  .then(() => {
      console.log("Rental Application Database is connected!");
  }).catch(err => {
      console.log("Error: " + err);
  });
module.exports = db;