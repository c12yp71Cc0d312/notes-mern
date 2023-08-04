import express from "express";
import * as UsersController from "../controller/users";

const router = express.Router();

router.get("/", UsersController.getAuthenticatedUserId);
router.post("/signup", UsersController.signUp);
router.post("/login", UsersController.login);
router.post("/logout", UsersController.logout);

export default router;