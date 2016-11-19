"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    useraccess: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }

  });

  return User;
};
