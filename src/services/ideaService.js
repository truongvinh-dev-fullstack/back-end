import db from "../models/index";
const CsvParser = require("json2csv").Parser;
const fs = require("fs");
const AdmZip = require("adm-zip");
var appRoot = require("app-root-path");

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
          include: [
            {
              model: db.User,
              attributes: ["firstname", "lastname"],
            },
          ],
          raw: true,
          nest: true,
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

let handleCreateIdea = (file_name, data) => {
  return new Promise(async (resolve, reject) => {
    let path = "./src/public/files/" + file_name;
    try {
      if (!file_name || !data) {
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
          file_name: file_name,
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
          include: [
            {
              model: db.User,
              attributes: ["firstname", "lastname"],
            },
          ],
          raw: true,
          nest: true,
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

let deleteFileByIdea = (ideaId, file_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let path = "./src/public/files/" + file_name;
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

let handleUpdateFile = (file_name, ideaId) => {
  return new Promise(async (resolve, reject) => {
    let path = "./src/public/files/" + file_name;
    try {
      if (!file_name || !ideaId) {
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

let handleDeleteIdeaByUser = (id, file_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let path = "./src/public/files/" + file_name;
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

let handleGetAllIdea = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let ideas = await db.Ideas.findAll();
      if (ideas) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: ideas,
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

let getIdeaLikeMost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let arrAllLike = await db.Ideas_islike.findAll({ where: { isLike: 1 } });
      let check = await checkIdeaLikeMost(arrAllLike);

      let idea = await db.Ideas.findOne({
        where: { id: check.mostIdea },
        include: [
          {
            model: db.User,
            attributes: ["firstname", "lastname"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (idea) {
        resolve({
          errCode: 0,
          data: idea,
          count: check.max,
        });
      } else {
        resolve({
          errCode: -1,
          message: "Fail",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkIdeaLikeMost = (arrAllLike) => {
  let mostIdea = arrAllLike[0].ideaId;
  let max = 0;
  for (let i = 0; i < arrAllLike.length; i++) {
    let curr = 0;
    for (let j = 0; j < arrAllLike.length; j++) {
      if (arrAllLike[i].ideaId == arrAllLike[j].ideaId) {
        curr++;
      }
    }
    if (curr > max) {
      mostIdea = arrAllLike[i].ideaId;
      max = curr;
    }
  }
  return { mostIdea: mostIdea, max: max };
};

let getIdeaNewPost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let idea = await db.Ideas.findOne({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            attributes: ["firstname", "lastname"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: idea,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let handleDeleteCsv = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allIdea = await db.Ideas.findAll({
        where: { categoryId: id },
        attributes: ["idea_name", "description", "file_name", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["firstname", "lastname"],
          },
        ],
        raw: true,
        nest: false,
      });

      const csvFields = [
        "idea_name",
        "description",
        "file_name",
        "createdAt",
        "User.firstname",
        "User.lastname",
      ];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(allIdea);

      resolve(csvData);
    } catch (e) {
      reject;
    }
  });
};

let downloadAllIdeaByCsv = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allIdea = await db.Ideas.findAll({
        where: { categoryId: id },
        attributes: ["file_name"],
      });

      const zip = new AdmZip();
      for (var i = 0; i < allIdea.length; i++) {
        zip.addLocalFile(appRoot + "/src/public/files/" + allIdea[i].file_name);
      }
      const downloadName = `${Date.now()}.zip`;
      const data = zip.toBuffer();
      resolve({
        downloadName: downloadName,
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  downloadAllIdeaByCsv: downloadAllIdeaByCsv,
  getAllIdeasByCategory: getAllIdeasByCategory,
  handleCreateIdea: handleCreateIdea,
  handleGetIdeasByUserTopic: handleGetIdeasByUserTopic,
  deleteFileByIdea: deleteFileByIdea,
  handleUpdateFile: handleUpdateFile,
  handleDeleteIdeaByUser: handleDeleteIdeaByUser,
  handleGetAllIdea: handleGetAllIdea,
  getIdeaLikeMost: getIdeaLikeMost,
  getIdeaNewPost: getIdeaNewPost,
  handleDeleteCsv: handleDeleteCsv,
};
