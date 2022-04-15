import ideaService from "../services/ideaService";
var appRoot = require("app-root-path");

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
    let message = await ideaService.handleCreateIdea(
      req.file.filename,
      req.file.path,
      req.body
    );
  }
  console.log("Check file: ", req.file);
};

let handleGetAllIdeasByTopic = async (req, res) => {
  if (!req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await ideaService.getAllIdeasByTopic(req.query.topicId);
  return res.status(200).json(message);
};

let handleDownloadFile = (req, res) => {
  let id = req.query.id;
  const file = `${appRoot}/src/public/files/${id}`;
  res.download(file);
};

module.exports = {
  handleGetAllIdeasByTopic: handleGetAllIdeasByTopic,
  handleCreateIdea: handleCreateIdea,
  handleDownloadFile: handleDownloadFile,
};
