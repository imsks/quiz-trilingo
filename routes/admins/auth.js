const router = require("express").Router();
const authController = require("../../controllers/admins/auth");
const  Middleware = require('../../middleware/index');

router.route("/test").get(authController.test);
router.route("/signin").post(Middleware.verify ,authController.signIn);
router.route("/signup").post(authController.signUp);

module.exports = router;
