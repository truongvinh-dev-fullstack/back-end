import topicService from "../services/topicService";

let handleCreateNewTopic = async (req, res) => {
  let message = await topicService.createNewTopic(req.body);
  return res.status(200).json(message);
};

let handleGetAllTopics = async (req, res) => {
  let message = await topicService.allTopicService();
  return res.status(200).json(message);
};

let handleEditTopic = async (req, res) => {
  let dataTopic = req.body;
  let message = await topicService.updateTopic(dataTopic);
  return res.status(200).json(message);
};

let handleDeleteTopic = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  let message = await topicService.deleteTopic(req.body.id);
  return res.status(200).json(message);
};

let handleGetAllIdeasByTopic = async (req, res) => {
  if (!req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await topicService.getAllIdeasByTopic(req.query.topicId);
  return res.status(200).json(message);
};

let handleLikeorDislike = async (req, res) => {
  console.log(req.body);
  if (!req.body.userId || !req.body.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await topicService.handleLikeDisLike(req.body);
  return res.status(200).json(message);
};

let getStatusIsLike = async (req, res) => {
  if (!req.query.userId || !req.query.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await topicService.getStatusIsLike(
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
  let message = await topicService.getAllStatusByUserAndTopic(
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
  let message = await topicService.getAllLikeByTopic(req.query.topicId);
  return res.status(200).json(message);
};

let getAllDisLikeByTopic = async (req, res) => {
  if (!req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await topicService.getAllDisLikeByTopic(req.query.topicId);
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
  let message = await topicService.handlePostComment(req.body);
  return res.status(200).json(message);
};

let getAllCommentByIdea = async (req, res) => {
  if (!req.query.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await topicService.getAllCommentByIdea(req.query.ideaId);
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
  let message = await topicService.handleEditComment(req.body);
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

  let message = await topicService.deleteComment(req.body.id);
  return res.status(200).json(message);
};

let handleCreateIdea = async (req, res) => {
  if (
    !req.file.filename ||
    !req.file.path ||
    !req.body.name ||
    !req.body.description
  ) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  } else {
    let message = await topicService.handleCreateIdea(
      req.file.filename,
      req.file.path,
      req.body
    );
  }
  console.log("Check file: ", req.file);
};

module.exports = {
  handleCreateNewTopic: handleCreateNewTopic,
  handleGetAllTopics: handleGetAllTopics,
  handleEditTopic: handleEditTopic,
  handleDeleteTopic: handleDeleteTopic,
  handleGetAllIdeasByTopic: handleGetAllIdeasByTopic,
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
  handleCreateIdea: handleCreateIdea,
};
