"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Topics.hasMany(models.Ideas, {
        foreignKey: "topicId",
        as: "topicData",
      });
    }
  }
  Topics.init(
    {
      topic_name: DataTypes.STRING,
      description: DataTypes.TEXT,
      start_date: DataTypes.DATE,
      first_closure_date: DataTypes.DATE,
      final_closure_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Topics",
    }
  );
  return Topics;
};
