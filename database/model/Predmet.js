const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Predmet = sequelize.define("Predmet", {
      naziv: Sequelize.STRING
    });
    return Predmet;
};