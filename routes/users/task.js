const router = require("express").Router();
const taskController = require("../../controllers/user/task");
const middleware = require("../../middleware/index");

router.route("/test").get(taskController.test);
router.route("/add").post(middleware.verify, taskController.add);
router
  .route("/get-all-tasks")
  .get(middleware.verify, taskController.getAllTasks);
router.route("/delete").post(middleware.verify, taskController.delete);

router
  .route("/get-all-users-data")
  .get(middleware.verify, taskController.getAllUsersData);

module.exports = router;
