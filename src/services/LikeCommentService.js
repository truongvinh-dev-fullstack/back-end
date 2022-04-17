import db from "../models/index";
import emailService from "./emailService";

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

let getAllStatusByUserAndTopic = (userId, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !categoryId) {
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
              where: { categoryId: categoryId },
              attributes: ["categoryId"],
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

let getAllLikeByTopic = async (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId) {
        resolve({
          errCode: -1,
          message: "Missing categoryId",
        });
      } else {
        let check = await db.Ideas_islike.findAll({
          where: { isLike: 1 },
          include: [
            {
              model: db.Ideas,
              where: { categoryId: categoryId },
              attributes: ["categoryId"],
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

let getAllDisLikeByTopic = async (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId) {
        resolve({
          errCode: -1,
          message: "Missing categoryId",
        });
      } else {
        let check = await db.Ideas_islike.findAll({
          where: { isLike: 0 },
          include: [
            {
              model: db.Ideas,
              where: { categoryId: categoryId },
              attributes: ["categoryId"],
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
      let idea = await db.Ideas.findOne({
        where: { id: data.ideaId },
      });
      let userId = idea.userId;
      let user = await db.User.findOne({
        where: { id: userId },
      });
      let email = user.email;

      if (!data.userId || !data.ideaId || !data.comment) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        await emailService.emailService({
          receiverEmail: email,
          userName: "You has a new comment!",
        });
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

let deleteLikeDisLike = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ideas = await db.Ideas_islike.findAll({
        raw: false,
      });
      if (ideas) {
        await db.Ideas_islike.destroy({ where: { ideaId: id } });
        resolve({
          errCode: 0,
          message: "Delete like and dislike successly!",
        });
      } else {
        resolve({
          errCode: 2,
          message: "Fail",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleLikeDisLike: handleLikeDisLike,
  getStatusIsLike: getStatusIsLike,
  getAllStatusByUserAndTopic: getAllStatusByUserAndTopic,
  getAllLikeByTopic: getAllLikeByTopic,
  getAllDisLikeByTopic: getAllDisLikeByTopic,
  handlePostComment: handlePostComment,
  getAllCommentByIdea: getAllCommentByIdea,
  handleEditComment: handleEditComment,
  deleteComment: deleteComment,
  deleteLikeDisLike: deleteLikeDisLike,
};
