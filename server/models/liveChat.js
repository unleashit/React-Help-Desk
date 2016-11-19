"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("LiveChat", {
        socketId: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        connected: DataTypes.BOOLEAN,
        messages: DataTypes.TEXT,
        date: DataTypes.STRING
    });
};