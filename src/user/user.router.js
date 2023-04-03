const express = require("express");
const userController = require("./user.controller");

const router = express.Router();

router.route("/").get(userController.getUsers).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUserById)
  .post(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
