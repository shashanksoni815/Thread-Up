import { Router } from "express";
import { activeCheck, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPosts, incrementInLikes } from "../controllers/posts.controller.js";
import multer from "multer";
const router = Router();
import path from "path";
import fs from "fs";
// import Comment from "../models/comments.model.js";
import { commentPost } from "../controllers/user.controller.js";
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

router.route('/posts').get(getAllPosts);
router.route('/delete_post').post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comment").get(get_comments_by_post)
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(incrementInLikes);


export default router;