import { Router } from "express";
const router = Router();
import * as fs from "node:fs";

router.get("/", (req, res) => {
    const file = String(fs.readFileSync("./public/html/team.html", "utf8"));
    res.send(file);
});

export default router;
