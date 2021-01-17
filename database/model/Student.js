const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Student = sequelize.define("Student", {
        ime: Sequelize.STRING,
        index: Sequelize.STRING
      });
    return Student;
};