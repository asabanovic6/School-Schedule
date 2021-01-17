const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Grupa = sequelize.define("Grupa", {
        naziv: Sequelize.STRING
      });
    return Grupa;
};