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
      Ideas.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Ideas.hasMany(models.Ideas_islike, {
        foreignKey: "ideaId",
      });
      Ideas.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Ideas.init(
    {
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      idea_name: DataTypes.STRING,
      description: DataTypes.TEXT,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ideas",
    }
  );
  return Ideas;
};
