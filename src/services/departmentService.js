import db from "../models/index";
const fs = require("fs");

let checkNameDepartment = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let department = await db.Department.findOne({
        where: { department_name: name },
      });
      if (department) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewDepartment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkNameDepartment(data.name);
      if (check) {
        resolve({
          errCode: 1,
          message: "Topic name is exist",
        });
      } else {
        await db.Department.create({
          department_name: data.name,
        });
        resolve({
          errCode: 0,
          message: "Department is created",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDepartments = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let department = await db.Department.findAll();
      if (department) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: department,
        });
      } else {
        resolve({
          errCode: 1,
          message: "Error from server",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateDepartment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let department = await db.Department.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (department) {
        if (department.department_name == data.name) {
          resolve({
            errCode: 0,
            message: "Don't change!",
          });
        } else {
          let check = await checkNameDepartment(data.name);
          if (check) {
            resolve({
              errCode: 1,
              message: "Department name is exist",
            });
          } else {
            department.department_name = data.name;

            await department.save();
            resolve({
              errCode: 0,
              message: "Update done!",
            });
          }
        }
      } else {
        resolve({
          errcode: 2,
          message: "Department is not found!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let deleteDepartment = (Id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let department = await db.Department.findOne({
        where: { id: Id },
        raw: false,
      });
      if (department) {
        await department.destroy();
        resolve({
          errCode: 0,
          message: "Delete successly!",
        });
      } else {
        resolve({
          errCode: 2,
          message: "Department is not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewDepartment: createNewDepartment,
  getAllDepartments: getAllDepartments,
  updateDepartment: updateDepartment,
  deleteDepartment: deleteDepartment,
};
