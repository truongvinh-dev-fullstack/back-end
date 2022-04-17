import LikeCommentService from "../services/LikeCommentService";

let handleLikeorDislike = async (req, res) => {
  console.log(req.body);
  if (!req.body.userId || !req.body.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.handleLikeDisLike(req.body);
  return res.status(200).json(message);
};

let getStatusIsLike = async (req, res) => {
  if (!req.query.userId || !req.query.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.getStatusIsLike(
    req.query.userId,
    req.query.ideaId
  );
  return res.status(200).json(message);
};
let getAllStatusByUserAndTopic = async (req, res) => {
  if (!req.query.userId || !req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.getAllStatusByUserAndTopic(
    req.query.userId,
    req.query.topicId
  );
  return res.status(200).json(message);
};

let getAllLikeByTopic = async (req, res) => {
  if (!req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.getAllLikeByTopic(req.query.topicId);
  return res.status(200).json(message);
};

let getAllDisLikeByTopic = async (req, res) => {
  if (!req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.getAllDisLikeByTopic(
    req.query.topicId
  );
  return res.status(200).json(message);
};

let handlePostComment = async (req, res) => {
  console.log(req.body);
  if (!req.body.userId || !req.body.ideaId || !req.body.comment) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.handlePostComment(req.body);
  return res.status(200).json(message);
};

let getAllCommentByIdea = async (req, res) => {
  if (!req.query.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.getAllCommentByIdea(req.query.ideaId);
  return res.status(200).json(message);
};

let handleEditComment = async (req, res) => {
  console.log(req.body);
  if (!req.body.commentId || !req.body.commentEdit) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await LikeCommentService.handleEditComment(req.body);
  return res.status(200).json(message);
};

let handleDeleteComment = async (req, res) => {
  console.log("check data: ", req.body);
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  let message = await LikeCommentService.deleteComment(req.body.id);
  return res.status(200).json(message);
};

let handleDeleteLikeDislikeByIdea = async (req, res) => {
  let message = LikeCommentService.deleteLikeDisLike(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleLikeorDislike: handleLikeorDislike,
  getStatusIsLike: getStatusIsLike,
  getAllStatusByUserAndTopic: getAllStatusByUserAndTopic,
  getAllLikeByTopic: getAllLikeByTopic,
  getAllDisLikeByTopic: getAllDisLikeByTopic,
  handlePostComment: handlePostComment,
  getAllCommentByIdea: getAllCommentByIdea,
  handlePostComment: handlePostComment,
  handleEditComment: handleEditComment,
  handleDeleteComment: handleDeleteComment,
  handleDeleteLikeDislikeByIdea: handleDeleteLikeDislikeByIdea,
};
