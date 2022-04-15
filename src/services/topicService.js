import db from "../models/index";
const fs = require("fs");

let checkNameTopic = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let topic = await db.Topics.findOne({
        where: { topic_name: name },
      });
      if (topic) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewTopic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkNameTopic(data.name);
      if (check) {
        resolve({
          errCode: 1,
          message: "Topic name is exist",
        });
      } else {
        await db.Topics.create({
          topic_name: data.name,
          description: data.description,
          start_date: data.startdate,
          first_closure_date: data.firstdate,
          final_closure_date: data.finaldate,
        });
        resolve({
          errCode: 0,
          message: "Topic name is created",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let allTopicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let topics = await db.Topics.findAll();
      if (topics) {
        resolve({
          errCode: 0,
          message: "Find ALl Done!",
          data: topics,
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

let updateTopic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let topic = await db.Topics.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (topic) {
        if (topic.topic_name == data.name) {
          topic.topic_name = data.name;
          topic.description = data.description;
          topic.start_date = data.startdate;
          topic.first_closure_date = data.firstdate;
          topic.final_closure_date = data.finaldate;

          await topic.save();
          resolve({
            errCode: 0,
            message: "Update done!",
          });
        } else {
          let check = await checkNameTopic(data.name);
          if (check) {
            resolve({
              errCode: 1,
              message: "Topic name is exist",
            });
          } else {
            topic.topic_name = data.name;
            topic.description = data.description;
            topic.start_date = data.startdate;
            topic.first_closure_date = data.firstdate;
            topic.final_closure_date = data.finaldate;

            await topic.save();
            resolve({
              errCode: 0,
              message: "Update done!",
            });
          }
        }
      } else {
        resolve({
          errcode: 2,
          message: "Topic is not found!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let deleteTopic = (Id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let topic = await db.Topics.findOne({
        where: { id: Id },
        raw: false,
      });
      if (topic) {
        await topic.destroy();
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

let handleLikeDisLike = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId || !data.ideaId) {
        resolve({
          errCode: -1,
          message: "Missing userId or ideaId",
        });
      } else {
        let check = await db.Ideas_islike.findOne({
          where: { userId: data.userId, ideaId: data.ideaId },
        });

        if (check) {
          let newAction = 1;
          if (check.isLike == data.action) {
            newAction = 3;
          } else {
            newAction = data.action;
          }

          let update = await db.Ideas_islike.findOne({
            where: { userId: data.userId, ideaId: data.ideaId },
            raw: false,
          });

          update.isLike = newAction;
          await update.save();
          resolve({
            errCode: 0,
            message: "Update action",
            status: newAction,
          });
        } else {
          await db.Ideas_islike.create({
            ideaId: data.ideaId,
            userId: data.userId,
            isLike: data.action,
          });
          resolve({
            errCode: 0,
            message: "Create new action",
            status: data.action,
          });
        }
        resolve({
          errCode: -2,
          message: "Fail action",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getStatusIsLike = (userId, ideaId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !ideaId) {
        resolve({
          errCode: -1,
          message: "Missing userId or ideaId",
        });
      } else {
        let check = await db.Ideas_islike.findOne({
          where: { userId: userId, ideaId: ideaId },
        });
        if (check) {
          let status = check.isLike;
          resolve({
            errCode: 0,
            status: status,
          });
        } else {
          resolve({
            errCode: 0,
            status: 3,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllStatusByUserAndTopic = (userId, topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !topicId) {
        resolve({
          errCode: -1,
          message: "Missing userId or ideaId",
        });
      } else {
        let check = await db.Ideas_islike.findAll({
          where: { userId: userId },
          include: [
            {
              model: db.Ideas,
              where: { topicId: topicId },
              attributes: ["topicId"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (check) {
          resolve({
            errCode: 0,
            data: check,
          });
        } else {
          resolve({
            errCode: 0,
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllLikeByTopic = async (topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!topicId) {
        resolve({
          errCode: -1,
          message: "Missing topicId",
        });
      } else {
        let check = await db.Ideas_islike.findAll({
          where: { isLike: 1 },
          include: [
            {
              model: db.Ideas,
              where: { topicId: topicId },
              attributes: ["topicId"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (check) {
          resolve({
            errCode: 0,
            data: check,
          });
        } else {
          resolve({
            errCode: 0,
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDisLikeByTopic = async (topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!topicId) {
        resolve({
          errCode: -1,
          message: "Missing topicId",
        });
      } else {
        let check = await db.Ideas_islike.findAll({
          where: { isLike: 0 },
          include: [
            {
              model: db.Ideas,
              where: { topicId: topicId },
              attributes: ["topicId"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (check) {
          resolve({
            errCode: 0,
            data: check,
          });
        } else {
          resolve({
            errCode: 0,
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handlePostComment = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log("check data: ", data);
    try {
      if (!data.userId || !data.ideaId || !data.comment) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        await db.Ideas_comment.create({
          userId: data.userId,
          ideaId: data.ideaId,
          comment: data.comment,
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

let getAllCommentByIdea = (ideaId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ideaId) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        let allComment = await db.Ideas_comment.findAll({
          where: { ideaId: ideaId },
          order: [["createdAt", "DESC"]],
        });
        if (allComment) {
          resolve({
            errCode: 0,
            message: "Done!",
            data: allComment,
          });
        } else {
          resolve({
            errCode: 0,
            message: "Done!",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleEditComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.commentId || !data.commentEdit) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        let comment = await db.Ideas_comment.findOne({
          where: { id: data.commentId },
          raw: false,
        });
        if (comment) {
          comment.comment = data.commentEdit;
          await comment.save();
          resolve({
            errCode: 0,
            message: "Update done!",
          });
        }
        resolve({
          errCode: -2,
          message: "Update Fail!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment = await db.Ideas_comment.findOne({
        where: { id: id },
        raw: false,
      });
      if (comment) {
        await comment.destroy();
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
  createNewTopic: createNewTopic,
  allTopicService: allTopicService,
  updateTopic: updateTopic,
  deleteTopic: deleteTopic,
  getAllIdeasByTopic: getAllIdeasByTopic,
  handleLikeDisLike: handleLikeDisLike,
  getStatusIsLike: getStatusIsLike,
  getAllStatusByUserAndTopic: getAllStatusByUserAndTopic,
  getAllLikeByTopic: getAllLikeByTopic,
  getAllDisLikeByTopic: getAllDisLikeByTopic,
  handlePostComment: handlePostComment,
  getAllCommentByIdea: getAllCommentByIdea,
  handleEditComment: handleEditComment,
  deleteComment: deleteComment,
  handleCreateIdea: handleCreateIdea,
};
