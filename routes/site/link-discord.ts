import { Router } from "express";
const router = Router();
import fs from "node:fs";

router.get("/", (req, res) => {
    const file = String(fs.readFileSync("./public/html/discord.html", "utf8"));
    res.send(file);
});

export default router;