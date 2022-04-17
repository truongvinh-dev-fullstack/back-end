import { resolveSoa } from "dns";
import ideaService from "../services/ideaService";
import JSZip from "jszip";
const AdmZip = require("adm-zip");
var appRoot = require("app-root-path");
const fs = require("fs");
var uploadDir = fs.readdirSync(appRoot + "/src/public/files");

let handleCreateIdea = async (req, res) => {
  if (!req.file.filename || !req.body.name || !req.body.description) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  } else {
    let message = await ideaService.handleCreateIdea(
      req.file.filename,
      req.body
    );
    return res.status(200).json(message);
  }
};

let handleGetAllIdeasByCategory = async (req, res) => {
  if (!req.query.categoryId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await ideaService.getAllIdeasByCategory(req.query.categoryId);
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
  if (!req.body.ideaId || !req.body.file_name) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  let message = await ideaService.deleteFileByIdea(
    req.body.ideaId,
    req.body.file_name
  );
  return res.status(200).json(message);
};

let handleUpdateFile = async (req, res) => {
  if (!req.file.filename || !req.body.ideaId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  } else {
    let message = await ideaService.handleUpdateFile(
      req.file.filename,
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
      req.body.file_name
    );
    return res.status(200).json(message);
  }
};
let handleGetAllIdeas = async (req, res) => {
  let message = await ideaService.handleGetAllIdea();
  return res.status(200).json(message);
};

let handleGetIdeaLikeMost = async (req, res) => {
  let message = await ideaService.getIdeaLikeMost();
  return res.status(200).json(message);
};

let handleGetIdeaNewPost = async (req, res) => {
  let message = await ideaService.getIdeaNewPost();
  return res.status(200).json(message);
};

let handleDownloadZip = async (req, res) => {
  let message = await ideaService.downloadAllIdeaByCsv(req.query.id);

  res.set("Content-Type", "application/octet-stream");
  res.set(
    "Content-Disposition",
    `attachment; filename=${message.downloadName}`
  );
  res.set("Content-Length", message.data.length);
  res.send(message.data);
};

let handleDownloadCsv = async (req, res) => {
  let message = await ideaService.handleDeleteCsv(req.query.id);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
  res.send(message);
};

module.exports = {
  handleGetAllIdeasByCategory: handleGetAllIdeasByCategory,
  handleCreateIdea: handleCreateIdea,
  handleDownloadFile: handleDownloadFile,
  handleGetIdeasByUserTopic: handleGetIdeasByUserTopic,
  handleDeleteFileByIdea: handleDeleteFileByIdea,
  handleUpdateFile: handleUpdateFile,
  handleDeleteIdeaByUser: handleDeleteIdeaByUser,
  handleGetAllIdeas: handleGetAllIdeas,
  handleGetIdeaLikeMost: handleGetIdeaLikeMost,
  handleGetIdeaNewPost: handleGetIdeaNewPost,
  handleDownloadZip: handleDownloadZip,
  handleDownloadCsv: handleDownloadCsv,
};
