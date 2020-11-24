const router = require("express").Router();
const authController = require("../../controllers/user/auth");

router.route("/test").get(authController.test);
router.route("/signin").post(authController.signIn);
router.route("/signup").post(authController.signUp);

module.exports = router;
