const express = require("express")
const router = express.Router();

router.get("/", async (req, res) => {
    const url = req.link;

    const response = await fetch(url).then(res => res.json());

    res.json(response);
});

module.exports = router;