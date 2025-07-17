import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(
    // upload.fields([
    //     {
    //         name: "avatar", // frontend ka field mei name hoga vo avatar hi hona chahiye tabhi work karega
    //         maxCount: 1
    //     },
    //     {
    //         name: "coverImage",
    //         maxCount: 1
    //     }
    // ]),
    registerUser
)
// it will send to user controller

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router