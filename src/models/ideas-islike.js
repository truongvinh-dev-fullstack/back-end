"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ideas_islike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ideas_islike.belongsTo(models.Ideas, {
        foreignKey: "ideaId",
        targetKey: "id",
      });
    }
  }
  Ideas_islike.init(
    {
      ideaId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      isLike: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Ideas_islike",
    }
  );
  return Ideas_islike;
};
