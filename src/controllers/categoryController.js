import categoryService from "../services/categoryService";

let handleCreateNewCategory = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing parameter!",
    });
  } else {
    let message = await categoryService.createNewCategory(req.body);
    return res.status(200).json(message);
  }
};

let handleGetAllCategoryByDepartment = async (req, res) => {
  if (!req.query.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing Id!",
    });
  } else {
    let message = await categoryService.getAllcategoryServiceById(req.query.id);
    return res.status(200).json(message);
  }
};

let handleEditCategory = async (req, res) => {
  let message = await categoryService.updateCategory(req.body);
  return res.status(200).json(message);
};

let handleDeleteCategory = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }

  let message = await categoryService.deleteCategory(req.body.id);
  return res.status(200).json(message);
};

let handleGetAllCategory = async (req, res) => {
  let message = await categoryService.getAllCategory();
  return res.status(200).json(message);
};

module.exports = {
  handleGetAllCategory: handleGetAllCategory,
  handleCreateNewCategory: handleCreateNewCategory,
  handleGetAllCategoryByDepartment: handleGetAllCategoryByDepartment,
  handleEditCategory: handleEditCategory,
  handleDeleteCategory: handleDeleteCategory,
};
