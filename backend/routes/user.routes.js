import {Router} from "express";
import { activeCheck } from "../controllers/post.controller.js";
import { register } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(register);

export default router;