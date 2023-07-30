import { Router } from "express";
const router = Router();
import * as fs from "node:fs";

const file = String(fs.readFileSync("./public/html/challenges.html", "utf8"));

router.get("/", (req, res) => {
    res.send(file)
});

export default router;