import express from "express";
import * as UsersController from "../controller/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UsersController.getAuthenticatedUserId);
router.post("/signup", UsersController.signUp);
router.post("/login", UsersController.login);
router.post("/logout", UsersController.logout);

export default router;