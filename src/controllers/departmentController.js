import departmentService from "../services/departmentService";

let handleCreateNewDepartment = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      errCode: -1,
      message: "Missing parameter",
    });
  } else {
    let message = await departmentService.createNewDepartment(req.body);
    return res.status(200).json(message);
  }
};

let handleGetAllDepartments = async (req, res) => {
  let message = await departmentService.getAllDepartments();
  return res.status(200).json(message);
};

let handleEditDepartment = async (req, res) => {
  let dataDepartment = req.body;
  if (!dataDepartment) {
    return res.status(200).json({
      errCode: -1,
      message: "Missing parameter",
    });
  } else {
    let message = await departmentService.updateDepartment(dataDepartment);
    return res.status(200).json(message);
  }
};

let handleDeleteDepartment = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  let message = await departmentService.deleteDepartment(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleCreateNewDepartment: handleCreateNewDepartment,
  handleGetAllDepartments: handleGetAllDepartments,
  handleEditDepartment: handleEditDepartment,
  handleDeleteDepartment: handleDeleteDepartment,
};
