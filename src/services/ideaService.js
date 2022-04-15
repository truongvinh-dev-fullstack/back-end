import db from "../models/index";
const fs = require("fs");

let getAllIdeasByTopic = (topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!topicId) {
        resolve({
          errCode: -1,
          message: "Missing topic name",
        });
      } else {
        let data = await db.Ideas.findAll({
          where: { topicId: topicId },
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
          topicId: data.topicId,
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

module.exports = {
  getAllIdeasByTopic: getAllIdeasByTopic,
  handleCreateIdea: handleCreateIdea,
};
