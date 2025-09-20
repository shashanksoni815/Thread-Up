import { Router } from "express";
import { activeCheck, createPost, deletePost, getAllPosts } from "../controllers/posts.controller.js";
import multer from "multer";
const router = Router();
import path from "path";
import fs from "fs";
// import { getAllPosts } from "../controllers/user.controller.js";

const uploads = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.route('/').get(activeCheck);

router.route('/post')
    .post(upload.single('media'), createPost)

router.route('/posts').get(getAllPosts)
router.route('/delete_post').post(deletePost);


export default router;