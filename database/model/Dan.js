const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Dan = sequelize.define("Dan", {
        naziv: Sequelize.STRING
      });
    return Dan;
};