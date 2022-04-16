import { resolveSoa } from "dns";
import ideaService from "../services/ideaService";
var appRoot = require("app-root-path");
const fs = require("fs");

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
    return res.status(200).json(message);
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

let handleGetIdeasByUserTopic = async (req, res) => {
  if (!req.query.userId || !req.query.topicId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await ideaService.handleGetIdeasByUserTopic(
    req.query.userId,
    req.query.topicId
  );
  return res.status(200).json(message);
};

let handleDeleteFileByIdea = async (req, res) => {
  console.log("check body: ", req.body);
  if (!req.body.ideaId || !req.body.file_name || !req.body.path) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  // fs.unlink(path, (err) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  // });

  let message = await ideaService.deleteFileByIdea(
    req.body.ideaId,
    req.body.file_name,
    req.body.path
  );
  return res.status(200).json(message);
};

let handleUpdateFile = async (req, res) => {
  if (!req.file.filename || !req.file.path || !req.body.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  } else {
    let message = await ideaService.handleUpdateFile(
      req.file.filename,
      req.file.path,
      req.body.ideaId
    );
    return res.status(200).json(message);
  }
};

let handleDeleteIdeaByUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: -1,
      message: "Missing parameter!",
    });
  } else {
    let message = await ideaService.handleDeleteIdeaByUser(
      req.body.id,
      req.body.linkFile
    );
    return res.status(200).json(message);
  }
};

module.exports = {
  handleGetAllIdeasByTopic: handleGetAllIdeasByTopic,
  handleCreateIdea: handleCreateIdea,
  handleDownloadFile: handleDownloadFile,
  handleGetIdeasByUserTopic: handleGetIdeasByUserTopic,
  handleDeleteFileByIdea: handleDeleteFileByIdea,
  handleUpdateFile: handleUpdateFile,
  handleDeleteIdeaByUser: handleDeleteIdeaByUser,
};
