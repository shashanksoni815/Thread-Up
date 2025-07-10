import {Router} from "express";
import { activeCheck } from "../controllers/post.controller.js";
import { register, login } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({})

router.route('/register').post(register);
router.route('/login').post(login);

export default router;