import db from "../models/index";
const fs = require("fs");

let checkNameCategory = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findOne({
        where: { category_name: name },
      });
      if (category) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkNameCategory(data.name);
      if (check) {
        resolve({
          errCode: 1,
          message: "Category name is exist",
        });
      } else {
        await db.Category.create({
          category_name: data.name,
          description: data.description,
          start_date: data.startdate,
          first_closure_date: data.firstdate,
          final_closure_date: data.finaldate,
          departmentId: data.id,
        });
        resolve({
          errCode: 0,
          message: "Done!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllcategoryServiceById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let categories = await db.Category.findAll({
        where: { departmentId: id },
      });
      if (categories) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: categories,
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

let updateCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (category) {
        if (category.category_name == data.name) {
          category.category_name = data.name;
          category.description = data.description;
          category.start_date = data.startdate;
          category.first_closure_date = data.firstdate;
          category.final_closure_date = data.finaldate;

          await category.save();
          resolve({
            errCode: 0,
            message: "Update done!",
          });
        } else {
          let check = await checkNameCategory(data.name);
          if (check) {
            resolve({
              errCode: 1,
              message: "Topic name is exist",
            });
          } else {
            category.category_name = data.name;
            category.description = data.description;
            category.start_date = data.startdate;
            category.first_closure_date = data.firstdate;
            category.final_closure_date = data.finaldate;

            await category.save();
            resolve({
              errCode: 0,
              message: "Update done!",
            });
          }
        }
      } else {
        resolve({
          errcode: 2,
          message: "Category is not found!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let deleteCategory = (Id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findOne({
        where: { id: Id },
        raw: false,
      });
      if (category) {
        await category.destroy();
        resolve({
          errCode: 0,
          message: "Delete Category successly!",
        });
      } else {
        resolve({
          errCode: 2,
          message: "Category is not exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let categories = await db.Category.findAll();
      if (categories) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: categories,
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

module.exports = {
  getAllCategory: getAllCategory,
  createNewCategory: createNewCategory,
  getAllcategoryServiceById: getAllcategoryServiceById,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
};
