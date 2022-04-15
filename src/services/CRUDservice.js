import db from "../models/index";
import bcrypt from "bcryptjs";
import { reject } from "bcrypt/promises";
import { resolve } from "app-root-path";
const fs = require("fs");

var salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswprdFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswprdFromBcrypt,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        role: data.role,
      });

      resolve();
    } catch (error) {
      console.log("false");
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Users = await db.User.findAll({
        raw: true,
      });
      resolve(Users);
    } catch (error) {
      reject(error);
    }
  });
};

let getUserById = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let User = await db.User.findOne({
        where: { id: UserId },
        row: true,
      });
      if (User) {
        resolve(User);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstname = data.firstname;
        user.lastname = data.lastname;

        await user.save();
        let allUser = await db.User.findAll({
          row: true,
        });
        resolve(allUser);
      } else {
        resolve();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (user) {
        await user.destroy();
        let allUser = await db.User.findAll({
          row: true,
        });
        resolve({
          errCode: 0,
          message: "Delete User successly!",
        });
      } else {
        resolve({
          errCode: 2,
          message: "User is not exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let postfile = (filename, path) => {
  return new Promise(async (resolve, reject) => {
    console.log("Check: ", filename, path);
    try {
      await db.Test_file.create({
        file: filename,
        path: path,
      });
      resolve({
        errCode: 0,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetAllFile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let files = await db.Test_file.findAll();
      if (files) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: files,
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

let deleteFile = (id, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -2,
          message: "Missing Id!",
        });
      } else {
        let file = await db.Test_file.findOne({
          where: { id: id },
          raw: false,
        });
        if (file) {
          await file.destroy();
          resolve({
            errCode: 0,
            message: "Delete done!",
          });
          // await unlinkAsync(path);
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }

            //file removed
          });
        } else {
          resolve({
            errCode: 1,
            message: "File is not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserById: getUserById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
  postfile: postfile,
  handleGetAllFile: handleGetAllFile,
  deleteFile: deleteFile,
};
