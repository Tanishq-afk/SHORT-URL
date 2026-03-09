const { getUser } = require("../service/auth");

function extractToken(req) {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
        return bearerHeader.slice(7);
    }
    return req.cookies.token;
}

async function restrictToLoggedinUserOnly(req, res, next) {
    const token = extractToken(req);
    if (!token) return res.redirect("/login");

    const user = getUser(token);

    if (!user) {
        res.clearCookie("token");
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const token = extractToken(req);

    const user = getUser(token);
    if (token && !user) {
        res.clearCookie("token");
    }

    req.user = user;
    next();
}

module.exports = { 
    restrictToLoggedinUserOnly, 
    checkAuth,
};
