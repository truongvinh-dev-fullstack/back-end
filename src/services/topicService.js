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

module.exports = {
  createNewTopic: createNewTopic,
  allTopicService: allTopicService,
  updateTopic: updateTopic,
  deleteTopic: deleteTopic,
};
