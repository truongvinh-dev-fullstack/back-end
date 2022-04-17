import express from "express";
import userController from "../controllers/userController";
import homeController from "../controllers/homeController";
import categoryController from "../controllers/categoryController";
import DepartmentController from "../controllers/departmentController";
import LikeCommentController from "../controllers/LikeCommentController";
import ideaController from "../controllers/ideaController";
var appRoot = require("app-root-path");

import multer from "multer";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appRoot + "/src/public/files/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const name = file.originalname.split(".")[0];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.post("/post-file", upload.single("file"), homeController.postfile);
  router.get("/get-crud", homeController.displayGetCrud);
  router.get("/getEditCRUD", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.post("/delete-crud", homeController.deleteCRUD);
  router.get("/api/get-all-file", homeController.handleGetAllFile);
  router.get("/download", homeController.handleDownloadFile);
  router.delete("/delete-file", homeController.handleDeleteFile);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  router.post(
    "/api/create-new-category",
    categoryController.handleCreateNewCategory
  );
  router.get(
    "/api/get-all-category-by-department",
    categoryController.handleGetAllCategoryByDepartment
  );
  router.put("/api/edit-category", categoryController.handleEditCategory);
  router.delete(
    "/api/delete-category",
    categoryController.handleDeleteCategory
  );

  router.post(
    "/api/create-new-department",
    DepartmentController.handleCreateNewDepartment
  );
  router.get(
    "/api/get-all-departments",
    DepartmentController.handleGetAllDepartments
  );
  router.put("/api/edit-department", DepartmentController.handleEditDepartment);
  router.delete(
    "/api/delete-department",
    DepartmentController.handleDeleteDepartment
  );

  // like and comment
  router.post(
    "/api/like-dislike-ideas",
    LikeCommentController.handleLikeorDislike
  );
  router.get("/api/status-islike", LikeCommentController.getStatusIsLike);
  router.get(
    "/api/getAllStatusByUserAndTopic",
    LikeCommentController.getAllStatusByUserAndTopic
  );
  router.get("/api/getAllLikeByTopic", LikeCommentController.getAllLikeByTopic);
  router.get(
    "/api/getAllDisLikeByTopic",
    LikeCommentController.getAllDisLikeByTopic
  );

  router.post(
    "/api/handlePostComment",
    LikeCommentController.handlePostComment
  );
  router.post(
    "/api/handleEditComment",
    LikeCommentController.handleEditComment
  );
  router.delete(
    "/api/delete-comment",
    LikeCommentController.handleDeleteComment
  );
  router.get(
    "/api/getAllCommentByIdea",
    LikeCommentController.getAllCommentByIdea
  );

  // idea controller
  router.get(
    "/api/get-all-ideas-by-category",
    ideaController.handleGetAllIdeasByCategory
  );

  router.post(
    "/api/creat-new-idea",
    upload.single("file"),
    ideaController.handleCreateIdea
  );
  router.get("/api/download-idea", ideaController.handleDownloadFile);
  router.get(
    "/api/get-all-idea-by-user-topic",
    ideaController.handleGetIdeasByUserTopic
  );

  router.delete("/api/delete-file-idea", ideaController.handleDeleteFileByIdea);
  router.delete("/api/delete-idea", ideaController.handleDeleteIdeaByUser);
  router.post(
    "/api/update-file-idea",
    upload.single("file"),
    ideaController.handleUpdateFile
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
