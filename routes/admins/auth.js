const router = require("express").Router();
const authController = require("../../controllers/admins/auth");
const Middleware = require("../../middleware/index");

router.route("/test").get(Middleware.verify, authController.test);
router.route("/signin").post(authController.signIn);
router.route("/signup").post(authController.signUp);

router.route("/refresh-token").post(authController.refreshToken);

module.exports = router;
