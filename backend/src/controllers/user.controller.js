import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {oldImageDeleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        // while saving mongoose model kicks in so password is requied to save changes but can be configured through:-
        user.save({validateBeforeSave: false}) 

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler( async (req, res) => {
    // get user deatails from frontend   --> depends on user model that is which data is needed to us.
    // validation  - not empty  --> fro validation a seperate file can be used through method calls to check for values
    // check if user already exists: username , email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // ---> STARTING STEPS

    // resolved ---> get user deatails from frontend-----------------
    const {fullName, email, username, password} = req.body
    // console.log("email: ", email);

    //SEQUENTIAL CHECK BY IF-ELSE
    // if (fullName === ""){
    //     throw new ApiError(400, "fullName required")
    // }

    //ANOTHER METHOD

    // resolved --->validation----------------------------------
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    
    // resolved --->check if user already exists:--------------------
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]  // checks for both 'username' and 'email' if any one of them is present in the database or not
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // ** resolved ---> check for images, check for avatar----------------

    //req.body --> sara data aata hai
    //routes mei middlewares add krne par aur options de dta hai 'req.' ko
    // handling multer file upload in local server

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; --> gives  typeError core js error: cannot read properties of undefined

    // handling-->
    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) &&  req.files.coverImage.length > 0){
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }


    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // ** resolved --->upload them to cloudinary, avatar

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if(!avatar){
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // await is used to handle error if occured due to that time cunsumed will be more
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    })
    
    //checking if user created or not
    const createdUser = await User.findById(user._id).select(
        // by default sare select hote hain
        // hme ye batana hota hai ki kya kya nhi chahiye
        //syntax ajeeb hai dhyaan se dekho
         
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

     // return res

     return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
     )
} ) 

const loginUser = asyncHandler( async (req, res) => {
    //STEPS:-
    // req body -> data
    // check username or email present or not
    // find the user
    // check password is correct
    // generate access token and refresh token 
    // give response
    // send cookie

    const {email, username, password} = req.body

    if(!(username || email)){
        console.log("1")
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or : [{username}, {email}] 
    })

    if(!user){
        console.log("2")

        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id)
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                "user": loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )

} )

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if (!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
        
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))


})

const getCurrentUser = asyncHandler(async(req, res) => {
    
    return res
    .status(200)
    .json( new ApiResponse(
        201,
        req.user,
        "Current user fetched successfully"
    ))


})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body
    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {},
        {new : true} // returns updated information
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user, 
        "Account details updated successfully"
    ))

})

const updateUserAvatar = asyncHandler(async(req, res) => {
    //multer middleware config
    //upload file and update user
    //remove existing avatar 
    //send response
    
    const avatarLocalPath = req.file?.path
    const oldFilePath = req.user.avatar;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(500, "Error while uploading the avatar")
    }

    const response = oldImageDeleteOnCloudinary(oldFilePath);
    if (!response) {
        throw new ApiError(500, "old image can not be deleted successfully")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .jason(new ApiResponse(
        200,
        user,
        "Avatar updated successfully"
    ))
})

const updateUserCoverImage = asyncHandler(async(req, res) => {

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(500, "Error while uploading the coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .jason(new ApiResponse(
        200,
        user,
        "Cover image updated successfully"
    ))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}