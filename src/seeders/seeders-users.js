"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        // email: DataTypes.STRING,
        // password: DataTypes.STRING,
        // firstname: DataTypes.STRING,
        // lastname: DataTypes.STRING,
        // address: DataTypes.STRING,
        // gender: DataTypes.BOOLEAN,
        // typeRole: DataTypes.STRING,
        // keyRole: DataTypes.STRING,

        email: "admin@gmail.com",
        password: "123456",
        firstName: "John",
        lastName: "Doe",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
