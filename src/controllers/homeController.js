import db from "../models/index";
import CRUDservices from "../services/CRUDservice";

var appRoot = require("app-root-path");

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log(data);
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("uploadFile.ejs");
};

let postCRUD = async (req, res) => {
  let mess = await CRUDservices.createNewUser(req.body);
  console.log(mess);
  return res.send("post crud from server");
};

let postfile = async (req, res) => {
  // if (!req.file.filename || !req.file.path) {
  //   return res.status(200).json({
  //     errCode: 1,
  //     message: "Missing required parameters!",
  //   });
  // } else {
  //   let message = await CRUDservices.postfile(req.file.filename, req.file.path);

  // }
  // console.log("Check file: ", req.file);
  console.log("--------------");
  console.log("Check body: ", req.body.email);
  return res.status(200).json({
    errCode: 0,
    message: "Done!",
  });

  // await unlinkAsync(
  //   "E:\\Top-up\\Learn-React-Notejs-mysql\\Web-manage\\Nodejs\\src\\public\\files\\admin-testfile-1649855315763.pdf"
  // );
};

let displayGetCrud = async (req, res) => {
  let data = await CRUDservices.getAllUser();
  console.log("---------");
  console.log(data);
  return res.render("displayCRUD.ejs", {
    data: data,
  });
};

let getEditCRUD = async (req, res) => {
  let UserId = req.query.id;
  if (UserId) {
    let userdata = await CRUDservices.getUserById(UserId);
    return res.render("getEditCRUD.ejs", {
      data: userdata,
    });
  } else {
    return res.send("Fail");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDservices.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    data: allUser,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let allUser = await CRUDservices.deleteUserById(data);
    return res.render("displayCRUD.ejs", {
      data: allUser,
    });
  } else {
    return res.send("Fail");
  }
};

let handleGetAllFile = async (req, res) => {
  let message = await CRUDservices.handleGetAllFile();
  return res.status(200).json(message);
};
let handleDownloadFile = (req, res) => {
  let id = req.query.id;
  const file = `${appRoot}/src/public/files/${id}`;
  res.download(file);
};

let handleDeleteFile = async (req, res) => {
  console.log(req.body);
  if (!req.body.id) {
    return res.status(200).json({
      errCode: -1,
      message: "Missing Id!",
    });
  } else {
    let message = await CRUDservices.deleteFile(req.body.id, req.body.path);
    return res.status(200).json(message);
  }
};
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCrud: displayGetCrud,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
  postfile: postfile,
  handleGetAllFile: handleGetAllFile,
  handleDownloadFile: handleDownloadFile,
  handleDeleteFile: handleDeleteFile,
};
