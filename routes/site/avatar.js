const express = require("express")
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    const id = req.img;
    
    try {
        const image = fs.readFileSync(`./data/avatars/${id}`);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length
        });

        res.end(image);
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.status(404).json({
                message: 'Avatar not found!'
            });
        } else {
            console.log(err);
            res.status(500).json({
                message: 'Fetching avatar failed!'
            });
        }
    }
});

module.exports = router;