const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).render("signup", {
            error: "All fields are required",
        });
    }

    try {
        await User.create({
            name,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).render("signup", {
                error: "Email already exists",
            });
        }
        return res.status(500).render("signup", {
            error: "Something went wrong. Please try again.",
        });
    }
} 

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render("login", {
            error: "Email and password are required",
        });
    }

    const user = await User.findOne({
        email,
        password,
    });
    if (!user) {
        return res.status(401).render("login", {
            error: "Invalid Username or Password",
        });
    }
    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/");
}

module.exports = { 
    handleUserSignUp, handleUserLogin, }; 
