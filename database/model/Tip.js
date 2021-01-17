const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Tip = sequelize.define("Tip", {
        naziv: Sequelize.STRING
      });
    return Tip;
};