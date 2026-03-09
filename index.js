const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const { connectToMongoDB } = require("./connect");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connection
connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server Started on: ${PORT}`));
