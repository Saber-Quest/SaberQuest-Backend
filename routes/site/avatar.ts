import { Router } from "express";
const router = Router();
import * as fs from "node:fs";

router.get("/:id", (req, res) => {
    const id = req.params.id;
    
    try {
        const image = fs.readFileSync(`./data/avatars/${id}`);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length
        });

        res.end(image);
    } catch (err: any) {
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

export default router;