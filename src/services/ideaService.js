import db from "../models/index";
const fs = require("fs");

let getAllIdeasByCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId) {
        resolve({
          errCode: -1,
          message: "Missing category id",
        });
      } else {
        let data = await db.Ideas.findAll({
          where: { categoryId: categoryId },
        });
        if (data) {
          resolve({
            errCode: 0,
            message: "Find ALl Done!",
            data: data,
          });
        } else {
          resolve({
            errCode: 0,
            message: "Find ALl Done!",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleCreateIdea = (filename, path, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!filename || !path || !data) {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        });

        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        await db.Ideas.create({
          categoryId: data.categoryId,
          userId: data.userId,
          idea_name: data.name,
          description: data.description,
          file_name: filename,
          linkFile: path,
        });
        resolve({
          errCode: 0,
          message: "Done!",
        });
      }
    } catch (e) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        //file removed
      });
      reject(e);
    }
  });
};

let handleGetIdeasByUserTopic = (userId, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !categoryId) {
        resolve({
          errCode: -1,
          message: "Missing parameter!",
        });
      } else {
        let ideas = await db.Ideas.findAll({
          where: {
            userId: userId,
            categoryId: categoryId,
          },
        });
        if (ideas) {
          resolve({
            errCode: 0,
            message: "Done!",
            data: ideas,
          });
        } else {
          resolve({
            errCode: -2,
            message: "Ideas is not found!",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteFileByIdea = (ideaId, file_name, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ideaId || !file_name || !path) {
        resolve({
          errCode: -1,
          message: "Missing parameter!",
        });
      } else {
        let idea = await db.Ideas.findOne({
          where: { id: ideaId },
          raw: false,
        });
        if (idea) {
          idea.file_name = "";
          idea.linkFile = "";
          await idea.save();

          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          resolve({
            errCode: 0,
            message: "Delete done!",
          });
        } else {
          resolve({
            errCode: -2,
            message: "Idea is not found!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleUpdateFile = (file_name, path, ideaId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file_name || !path || !ideaId) {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        resolve({
          errCode: -1,
          message: "Missing parameter!",
        });
      } else {
        let idea = await db.Ideas.findOne({
          where: { id: ideaId },
          raw: false,
        });
        if (idea) {
          idea.file_name = file_name;
          idea.linkFile = path;
          await idea.save();

          resolve({
            errCode: 0,
            message: "Update done!",
          });
        } else {
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          resolve({
            errCode: -2,
            message: "Idea is not found!",
          });
        }
      }
    } catch (e) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      reject(e);
    }
  });
};

let handleDeleteIdeaByUser = (id, linkFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing parameter!",
        });
      } else {
        let idea = await db.Ideas.findOne({
          where: { id: id },
          raw: false,
        });
        if (idea) {
          await idea.destroy();
          fs.unlink(linkFile, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          resolve({
            errCode: 0,
            message: "Delete done!",
          });
        } else {
          resolve({
            errCode: 2,
            message: "Idea is not found!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllIdeasByCategory: getAllIdeasByCategory,
  handleCreateIdea: handleCreateIdea,
  handleGetIdeasByUserTopic: handleGetIdeasByUserTopic,
  deleteFileByIdea: deleteFileByIdea,
  handleUpdateFile: handleUpdateFile,
  handleDeleteIdeaByUser: handleDeleteIdeaByUser,
};
