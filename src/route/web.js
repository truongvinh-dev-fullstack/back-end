import express from "express";
import userController from "../controllers/userController";

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

  router.get("/api/get-all-category", categoryController.handleGetAllCategory);
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
  router.delete(
    "/api/delete-like-dislike-by-idea",
    LikeCommentController.handleDeleteLikeDislikeByIdea
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

  router.get("/api/get-all-ideas", ideaController.handleGetAllIdeas);

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
  router.get("/api/idea-like-most", ideaController.handleGetIdeaLikeMost);
  router.get("/api/get-idea-new", ideaController.handleGetIdeaNewPost);

  router.get("/api/download-zip", ideaController.handleDownloadZip);
  router.get("/api/download-csv", ideaController.handleDownloadCsv);

  return app.use("/", router);
};

module.exports = initWebRoutes;
