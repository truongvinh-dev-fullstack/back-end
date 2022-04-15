"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ideas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ideas.belongsTo(models.Topics, {
        foreignKey: "topicId",
        as: "topicData",
      });
      Ideas.hasMany(models.Ideas_islike, {
        foreignKey: "ideaId",
      });
    }
  }
  Ideas.init(
    {
      topicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      idea_name: DataTypes.STRING,
      description: DataTypes.TEXT,
      file_name: DataTypes.STRING,
      linkFile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ideas",
    }
  );
  return Ideas;
};
