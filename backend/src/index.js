//require('dotenv').config({ path: './env'}) ---first syntax
import dotenv from 'dotenv'
import connectDB from "./db/index_DB.js";
import {app} from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log(error)
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!! ", err)
})











/*
FIRST APPROACH:


import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express()
// function connectDB(){}
// connectDB()

// using iffe

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on( "error", (error) => {
            console.log("Error:", error)
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error:" ,error)
        throw error
    }
})()
    */