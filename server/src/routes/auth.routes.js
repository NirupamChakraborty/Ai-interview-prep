import { Router } from "express";
import { getMeController, loginUserController, logoutUserController, registerUserController } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
router.post("/login", loginUserController)


router.get("/logout", logoutUserController)

// procted route by auth middleware
router.get("/get-me", authUser, getMeController)
export default router;
