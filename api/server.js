const express = require("express");
const session = require("express-session");

const userRouter = require("../users/users-router");

const server = express();

const sessionConfig = {
    cookie: {
        maxAge: 1000 * 60 * 60, // One hour in milliseconds
        secure: process.env.SECURE_COOKIE || false, // Send the cookie only over https, true in production
        httpOnly: true, // True means client JS cannot access the cookie
    },
    resave: false,
    saveUninitialized: process.env.USER_ALLOWED_COOKIES || true,
    name: "CookieName",
    secret: process.env.COOKIE_SECRET || "keepitsecret,keepitsafe!",
};


server.use(session(sessionConfig)); // turns on the sessions for the API

server.use(express.json());

server.use("/api" ,userRouter) // Routers

server.get("/", (req, res) => {
    res.json({ api: "up" });
})

module.exports = server;