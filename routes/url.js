const express = require("express");
const {
    handleGenerateShortURL,
    handleRedirect,
    handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateShortURL);
// specific analytics route must come before the catch‑all redirect
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirect);

module.exports = router;